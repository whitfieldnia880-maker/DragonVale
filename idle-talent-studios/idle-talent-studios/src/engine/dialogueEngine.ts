import type { PlayerStats, StatKey } from './gameState'
import { checkStat } from './statEngine'
import type { StatDelta } from './statEngine'

// ─── Node types ───────────────────────────────────────────────────────────────

export type NodeType = 'dialogue' | 'inner_monologue' | 'scene_end'

export interface DialogueLine {
  id: string
  speaker: string
  text: string
  portrait?: string
}

export interface DialogueChoice {
  id: string
  text: string
  statCheck?: { stat: StatKey; required: number }
  affectionDelta?: { characterId: string; delta: number }
  statDeltas?: StatDelta[]
  nextNodeId: string
  lockedText?: string
}

export interface DialogueNode {
  id: string
  type?: NodeType
  lines: DialogueLine[]
  /** ms before auto-advancing. Inner_monologue defaults to 2800 if unset. */
  autoAdvanceMs?: number
  choices?: DialogueChoice[]
  autoNext?: string
  statDeltas?: StatDelta[]
  /** Applied when this node is entered (not tied to a choice). */
  affectionDeltas?: Array<{ characterId: string; delta: number }>
  setFlags?: Record<string, boolean>
  requireFlags?: Record<string, boolean>
}

export interface DialogueScene {
  id: string
  title: string
  characterId: string
  chapter: number
  nodes: DialogueNode[]
  startNodeId: string
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

export function selectChoice(
  state: DialogueState,
  choiceId: string
): DialogueState {
  const node = getCurrentNode(state)
  const choice = node?.choices?.find((c) => c.id === choiceId)
  if (!choice) return state

  return {
    ...state,
    currentNodeId: choice.nextNodeId,
    lineIndex: 0,
    history: [...state.history, choice.nextNodeId],
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

export function getNodeAutoAdvanceMs(node: DialogueNode): number | null {
  if (node.autoAdvanceMs !== undefined) return node.autoAdvanceMs
  if (node.type === 'inner_monologue') return 2800
  return null
}
