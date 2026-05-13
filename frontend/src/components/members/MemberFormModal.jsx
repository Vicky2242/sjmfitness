import { useEffect, useMemo, useState } from 'react'

const baseForm = {
  name: '',
  gender: 'male',
  age: '',
  phone: '',
  email: '',
  address: '',
  membershipPlan: 'basic',
  joiningDate: '',
  expiryDate: '',
  paymentStatus: 'pending',
  memberStatus: 'active',
  profileImage: '',
}

function MemberFormModal({ open, initialData, onClose, onSubmit, loading }) {
  const [errors, setErrors] = useState({})
  const formState = useMemo(() => ({ ...baseForm, ...initialData }), [initialData])
  const [formData, setFormData] = useState(formState)

  useEffect(() => {
    setFormData(formState)
    setErrors({})
  }, [formState, open])

  if (!open) {
    return null
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = 'Name is required'
    if (!formData.email.trim()) nextErrors.email = 'Email is required'
    if (!formData.phone.trim()) nextErrors.phone = 'Phone is required'
    if (!formData.joiningDate) nextErrors.joiningDate = 'Joining date is required'
    if (!formData.expiryDate) nextErrors.expiryDate = 'Expiry date is required'
    if (!formData.address.trim()) nextErrors.address = 'Address is required'
    if (!formData.age || Number(formData.age) < 10) nextErrors.age = 'Age must be at least 10'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    onSubmit({ ...formData, age: Number(formData.age) })
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4'>
      <div className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6'>
        <h2 className='text-xl font-semibold text-white'>{initialData?._id ? 'Edit Member' : 'Add Member'}</h2>
        <form className='mt-4 grid gap-4 sm:grid-cols-2' onSubmit={handleSubmit}>
          {[
            ['name', 'Name'],
            ['age', 'Age'],
            ['phone', 'Phone'],
            ['email', 'Email'],
            ['address', 'Address'],
            ['profileImage', 'Profile Image URL'],
          ].map(([name, label]) => (
            <div key={name} className={name === 'address' ? 'sm:col-span-2' : ''}>
              <label className='mb-1 block text-sm text-slate-300'>{label}</label>
              <input
                name={name}
                type={name === 'age' ? 'number' : 'text'}
                value={formData[name]}
                onChange={handleChange}
                className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'
              />
              {errors[name] ? <p className='mt-1 text-xs text-red-400'>{errors[name]}</p> : null}
            </div>
          ))}

          <div>
            <label className='mb-1 block text-sm text-slate-300'>Gender</label>
            <select name='gender' value={formData.gender} onChange={handleChange} className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'>
              <option value='male'>Male</option>
              <option value='female'>Female</option>
              <option value='other'>Other</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm text-slate-300'>Membership Plan</label>
            <select name='membershipPlan' value={formData.membershipPlan} onChange={handleChange} className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'>
              <option value='basic'>Basic</option>
              <option value='standard'>Standard</option>
              <option value='premium'>Premium</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm text-slate-300'>Joining Date</label>
            <input name='joiningDate' type='date' value={formData.joiningDate?.slice(0, 10) || ''} onChange={handleChange} className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100' />
            {errors.joiningDate ? <p className='mt-1 text-xs text-red-400'>{errors.joiningDate}</p> : null}
          </div>

          <div>
            <label className='mb-1 block text-sm text-slate-300'>Expiry Date</label>
            <input name='expiryDate' type='date' value={formData.expiryDate?.slice(0, 10) || ''} onChange={handleChange} className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100' />
            {errors.expiryDate ? <p className='mt-1 text-xs text-red-400'>{errors.expiryDate}</p> : null}
          </div>

          <div>
            <label className='mb-1 block text-sm text-slate-300'>Payment Status</label>
            <select name='paymentStatus' value={formData.paymentStatus} onChange={handleChange} className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'>
              <option value='paid'>Paid</option>
              <option value='pending'>Pending</option>
              <option value='overdue'>Overdue</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm text-slate-300'>Member Status</label>
            <select name='memberStatus' value={formData.memberStatus} onChange={handleChange} className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>

          <div className='flex gap-3 sm:col-span-2'>
            <button type='button' onClick={onClose} className='w-full rounded-md border border-slate-700 px-4 py-2 text-slate-200'>
              Cancel
            </button>
            <button type='submit' disabled={loading} className='w-full rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-900 disabled:opacity-70'>
              {loading ? 'Saving...' : 'Save Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MemberFormModal
