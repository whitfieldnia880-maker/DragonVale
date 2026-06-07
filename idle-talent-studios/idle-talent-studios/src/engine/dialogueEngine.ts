import type { PlayerStats, StatKey } from './gameState'
import { checkStat } from './statEngine'
import type { StatDelta } from './statEngine'

// ─── Node types ───────────────────────────────────────────────────────────────

export type NodeType =
  | 'dialogue'
  | 'inner_monologue'
  | 'memory'
  | 'narration'
  | 'choice'
  | 'stat_check'
  | 'affection_delta'
  | 'flag_set'
  | 'scene_end'

export interface DialogueLine {
  id: string
  speaker: string
  text: string
  portrait?: string
  emotion?: string
}

export interface DialogueChoice {
  id: string
  text: string
  statCheck?: { stat: StatKey; required: number }
  /** If stat check fails, route here instead of nextNodeId */
  failNodeId?: string
  affectionDelta?: { characterId: string; delta: number }
  statDeltas?: StatDelta[]
  nextNodeId: string
  lockedText?: string
}

export interface DialogueNode {
  id: string
  type?: NodeType
  lines: DialogueLine[]
  /** ms before auto-advancing. inner_monologue: 3000ms, memory: 4000ms */
  autoAdvanceMs?: number
  choices?: DialogueChoice[]
  autoNext?: string
  statDeltas?: StatDelta[]
  /** Applied when this node is entered (not tied to a choice). */
  affectionDeltas?: Array<{ characterId: string; delta: number }>
  setFlags?: Record<string, boolean>
  requireFlags?: Record<string, boolean>
  /** For stat_check nodes: describes the branch */
  statCheckData?: { stat: StatKey; required: number; passNode: string; failNode: string }
}

export interface DialogueScene {
  id: string
  title: string
  characterId: string
  chapter: number
  nodes: DialogueNode[]
  startNodeId: string
}

// ─── Session-level scene cache ─────────────────────────────────────────────────

const sceneCache = new Map<string, DialogueScene>()

export function loadScene(raw: unknown): DialogueScene {
  const validated = validateScene(raw)
  sceneCache.set(validated.id, validated)
  return validated
}

export function getCachedScene(sceneId: string): DialogueScene | undefined {
  return sceneCache.get(sceneId)
}

export function prefetchScene(raw: unknown): void {
  try { loadScene(raw) } catch { /* ignore prefetch errors */ }
}

// ─── Schema validation ────────────────────────────────────────────────────────

export function validateScene(raw: unknown): DialogueScene {
  if (!raw || typeof raw !== 'object') throw new Error('Scene must be an object')
  const s = raw as Record<string, unknown>
  if (typeof s.id !== 'string') throw new Error('Scene missing id')
  if (typeof s.title !== 'string') throw new Error('Scene missing title')
  if (typeof s.characterId !== 'string') throw new Error('Scene missing characterId')
  if (typeof s.chapter !== 'number') throw new Error('Scene missing chapter')
  if (!Array.isArray(s.nodes)) throw new Error('Scene missing nodes array')
  if (typeof s.startNodeId !== 'string') throw new Error('Scene missing startNodeId')
  const startExists = (s.nodes as Array<Record<string, unknown>>).some(
    (n) => n.id === s.startNodeId
  )
  if (!startExists) throw new Error(`startNodeId "${s.startNodeId}" not found in nodes`)
  return s as unknown as DialogueScene
}

// ─── Runtime state ────────────────────────────────────────────────────────────

export interface DialogueState {
  scene: DialogueScene
  currentNodeId: string
  lineIndex: number
  history: string[]
}

export function initDialogue(scene: DialogueScene): DialogueState {
  return {
    scene,
    currentNodeId: scene.startNodeId,
    lineIndex: 0,
    history: [scene.startNodeId],
  }
}

export function getCurrentNode(state: DialogueState): DialogueNode | undefined {
  return state.scene.nodes.find((n) => n.id === state.currentNodeId)
}

export function getCurrentLine(state: DialogueState): DialogueLine | undefined {
  const node = getCurrentNode(state)
  return node?.lines[state.lineIndex]
}

export function canAdvanceLine(state: DialogueState): boolean {
  const node = getCurrentNode(state)
  if (!node) return false
  return state.lineIndex < node.lines.length - 1
}

export function advanceLine(state: DialogueState): DialogueState {
  if (canAdvanceLine(state)) {
    return { ...state, lineIndex: state.lineIndex + 1 }
  }
  return state
}

export function isAtLastLine(state: DialogueState): boolean {
  const node = getCurrentNode(state)
  if (!node) return false
  return state.lineIndex >= node.lines.length - 1
}

export function isAtChoices(state: DialogueState): boolean {
  const node = getCurrentNode(state)
  if (!node) return false
  return isAtLastLine(state) && !!node.choices && node.choices.length > 0
}

export function isSceneEnd(state: DialogueState): boolean {
  const node = getCurrentNode(state)
  if (!node) return false
  return (
    (node.type === 'scene_end' && isAtLastLine(state)) ||
    (isAtLastLine(state) && !node.choices && !node.autoNext)
  )
}

/** Returns true if this node should auto-route without rendering (stat_check). */
export function isSilentNode(node: DialogueNode): boolean {
  return node.type === 'stat_check' || node.type === 'flag_set' || node.type === 'affection_delta'
}

export function getAvailableChoices(
  state: DialogueState,
  stats: PlayerStats
): Array<DialogueChoice & { available: boolean }> {
  const node = getCurrentNode(state)
  if (!node?.choices) return []

  return node.choices.map((choice) => {
    if (!choice.statCheck) return { ...choice, available: true }
    const check = checkStat(stats, choice.statCheck.stat, choice.statCheck.required)
    return { ...choice, available: check.passed }
  })
}

/**
 * Selects a choice and advances state. When a choice has both a statCheck
 * and a failNodeId, routes to failNodeId on failure.
 */
export function selectChoice(
  state: DialogueState,
  choiceId: string,
  stats?: PlayerStats
): DialogueState {
  const node = getCurrentNode(state)
  const choice = node?.choices?.find((c) => c.id === choiceId)
  if (!choice) return state

  let targetNodeId = choice.nextNodeId

  if (choice.statCheck && choice.failNodeId && stats) {
    const passed = (stats[choice.statCheck.stat] ?? 0) >= choice.statCheck.required
    if (!passed) targetNodeId = choice.failNodeId
  }

  return {
    ...state,
    currentNodeId: targetNodeId,
    lineIndex: 0,
    history: [...state.history, targetNodeId],
  }
}

export function advanceAuto(state: DialogueState): DialogueState | null {
  const node = getCurrentNode(state)
  if (!node?.autoNext) return null
  return {
    ...state,
    currentNodeId: node.autoNext,
    lineIndex: 0,
    history: [...state.history, node.autoNext],
  }
}

/** Route a stat_check node to pass or fail target silently. */
export function routeStatCheck(
  state: DialogueState,
  stats: PlayerStats
): DialogueState | null {
  const node = getCurrentNode(state)
  if (node?.type !== 'stat_check' || !node.statCheckData) return null
  const { stat, required, passNode, failNode } = node.statCheckData
  const passed = (stats[stat] ?? 0) >= required
  const target = passed ? passNode : failNode
  return {
    ...state,
    currentNodeId: target,
    lineIndex: 0,
    history: [...state.history, target],
  }
}

export function getNodeAutoAdvanceMs(node: DialogueNode): number | null {
  if (node.autoAdvanceMs !== undefined) return node.autoAdvanceMs
  if (node.type === 'inner_monologue') return 3000
  if (node.type === 'memory') return 4000
  return null
}

/** Whether auto-advance should still fire even when at the last line with choices. */
export function shouldAutoAdvanceAtChoices(_node: DialogueNode): boolean {
  return false
}
