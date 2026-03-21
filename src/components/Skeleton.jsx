// Base skeleton block
function SkeletonBlock({ className = '' }) {
  return (
    <div className={`animate-pulse bg-bg-elevated rounded ${className}`} />
  )
}

// Skeleton for person card
export function PersonCardSkeleton() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-3/4" />
          <SkeletonBlock className="h-3 w-1/2" />
        </div>
      </div>
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-2/3" />
      <div className="flex gap-2">
        <SkeletonBlock className="h-5 w-16 rounded-full" />
        <SkeletonBlock className="h-5 w-12 rounded-full" />
      </div>
    </div>
  )
}

// Skeleton for news card
export function NewsCardSkeleton() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-5 w-16 rounded-full" />
        <SkeletonBlock className="h-3 w-24" />
      </div>
      <SkeletonBlock className="h-5 w-full" />
      <SkeletonBlock className="h-4 w-5/6" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-3/4" />
    </div>
  )
}

// Skeleton for KPI card
export function KPICardSkeleton() {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4 space-y-2">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-8 w-32" />
      <SkeletonBlock className="h-3 w-20" />
    </div>
  )
}

// Skeleton for table row
export function TableRowSkeleton({ cols = 4 }) {
  return (
    <tr className="border-b border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonBlock className={`h-4 ${i === 0 ? 'w-32' : 'w-20'}`} />
        </td>
      ))}
    </tr>
  )
}

// Page-level skeleton for PersonList
export function PersonListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <SkeletonBlock className="h-10 flex-1 rounded-lg" />
        <SkeletonBlock className="h-10 w-32 rounded-lg" />
        <SkeletonBlock className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => <PersonCardSkeleton key={i} />)}
      </div>
    </div>
  )
}

export default SkeletonBlock
