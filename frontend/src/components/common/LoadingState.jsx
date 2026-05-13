function LoadingState({ message = 'Loading...' }) {
  return (
    <div className='flex items-center justify-center gap-3 py-8 text-slate-300'>
      <span className='h-4 w-4 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent'></span>
      <span>{message}</span>
    </div>
  )
}

export default LoadingState
