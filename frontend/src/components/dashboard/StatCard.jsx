function StatCard({ title, value, subtitle, accent = 'text-emerald-400' }) {
  return (
    <article className='rounded-xl border border-slate-800 bg-slate-900/70 p-5'>
      <p className='text-sm text-slate-400'>{title}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
      <p className='mt-2 text-xs text-slate-500'>{subtitle}</p>
    </article>
  )
}

export default StatCard
