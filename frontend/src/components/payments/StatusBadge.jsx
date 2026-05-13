function StatusBadge({ status }) {
  const classMap = {
    paid: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    pending: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    overdue: 'border-red-500/40 bg-red-500/10 text-red-300',
  }

  return (
    <span className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase ${classMap[status] || classMap.pending}`}>
      {status}
    </span>
  )
}

export default StatusBadge
