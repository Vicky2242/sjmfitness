function DeleteConfirmModal({ open, memberName, loading, onCancel, onConfirm }) {
  if (!open) {
    return null
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
      <div className='w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <h3 className='text-lg font-semibold text-white'>Delete Member</h3>
        <p className='mt-2 text-sm text-slate-300'>
          Are you sure you want to delete <span className='font-semibold text-red-300'>{memberName}</span>? This action cannot be undone.
        </p>
        <div className='mt-5 flex gap-3'>
          <button type='button' onClick={onCancel} className='w-full rounded-md border border-slate-700 px-4 py-2 text-slate-200'>
            Cancel
          </button>
          <button type='button' onClick={onConfirm} disabled={loading} className='w-full rounded-md bg-red-500 px-4 py-2 font-semibold text-white disabled:opacity-70'>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
