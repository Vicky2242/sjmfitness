function ToastStack({ toasts, onClose }) {
  return (
    <div className='fixed right-4 top-4 z-[60] space-y-2'>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-64 rounded-md border px-4 py-3 text-sm shadow-lg ${
            toast.type === 'error'
              ? 'border-red-500/40 bg-red-500/10 text-red-200'
              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          <div className='flex items-start justify-between gap-3'>
            <span>{toast.message}</span>
            <button type='button' onClick={() => onClose(toast.id)} className='text-xs text-slate-300'>
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ToastStack
