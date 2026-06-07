import { cn } from '@/lib/utils'

// ─── Base pulse unit ─────────────────────────────────────────────────────────

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl bg-white/5 animate-pulse', className)} />
  )
}

// ─── Full screen skeleton (Suspense fallback) ─────────────────────────────────

export function ScreenSkeleton() {
  return (
    <div className="min-h-svh bg-slate-950 flex flex-col" role="status" aria-label="Loading">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="flex-1 p-5 space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
        <Skeleton className="h-36 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  )
}

// ─── Character card skeleton (matches CharacterCard portrait aspect ratio) ────

export function CharacterCardSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Portrait — 2:3 aspect */}
      <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: '2/3' }} />
      {/* Name line */}
      <Skeleton className="h-3.5 w-4/5 rounded-md" />
      {/* Rarity chip */}
      <Skeleton className="h-3 w-1/2 rounded-md" />
    </div>
  )
}

// ─── Collection grid skeleton (2-column, 6 cards) ────────────────────────────

export function CollectionGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {Array.from({ length: count }).map((_, i) => (
        <CharacterCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Dialogue box skeleton ────────────────────────────────────────────────────

export function DialogueBoxSkeleton() {
  return (
    <div className="rounded-2xl bg-white/4 border border-white/8 p-4 space-y-3">
      {/* Nameplate */}
      <Skeleton className="h-4 w-28 rounded-md" />
      {/* Two lines of dialogue */}
      <Skeleton className="h-3.5 w-full rounded-md" />
      <Skeleton className="h-3.5 w-3/4 rounded-md" />
    </div>
  )
}

// ─── Gig card skeleton ────────────────────────────────────────────────────────

export function GigCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white/4 border border-white/8 p-4 space-y-3 min-w-[220px]">
      {/* Title */}
      <Skeleton className="h-4 w-3/4 rounded-md" />
      {/* Chip row */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      {/* Reward placeholder */}
      <Skeleton className="h-8 w-full rounded-xl" />
    </div>
  )
}

// ─── Generic card list skeleton ───────────────────────────────────────────────

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
      ))}
    </div>
  )
}
