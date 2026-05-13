function EmptyState({ title = 'No data found', description = 'Try changing filters or adding new records.' }) {
  return (
    <div className='py-8 text-center'>
      <h3 className='text-lg font-semibold text-slate-200'>{title}</h3>
      <p className='mt-2 text-sm text-slate-400'>{description}</p>
    </div>
  )
}

export default EmptyState
