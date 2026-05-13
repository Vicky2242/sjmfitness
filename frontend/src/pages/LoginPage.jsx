import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/apiClient'
import { saveAuthSession } from '../lib/auth'

const initialForm = { email: '', password: '' }

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const nextErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setApiError('')

    if (!validate()) {
      return
    }

    try {
      setLoading(true)
      const { data } = await apiClient.post('/auth/admin/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })

      saveAuthSession({ token: data.token, admin: data.admin })

      const redirectTo = location.state?.from?.pathname || '/dashboard'
      navigate(redirectTo, { replace: true })
    } catch (error) {
      setApiError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className='mx-auto w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/60 p-6'>
      <h2 className='text-2xl font-semibold text-emerald-400'>Admin Login</h2>
      <p className='mt-2 text-slate-300'>Sign in with admin credentials to access protected dashboard features.</p>

      <form className='mt-6 space-y-4' onSubmit={handleSubmit} noValidate>
        <div>
          <label className='mb-1 block text-sm text-slate-300' htmlFor='email'>
            Email
          </label>
          <input
            id='email'
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-emerald-400 focus:ring-2'
            placeholder='admin@gympro.com'
          />
          {errors.email ? <p className='mt-1 text-sm text-red-400'>{errors.email}</p> : null}
        </div>

        <div>
          <label className='mb-1 block text-sm text-slate-300' htmlFor='password'>
            Password
          </label>
          <input
            id='password'
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none ring-emerald-400 focus:ring-2'
            placeholder='Enter your secure password'
          />
          {errors.password ? <p className='mt-1 text-sm text-red-400'>{errors.password}</p> : null}
        </div>

        {apiError ? <p className='text-sm text-red-400'>{apiError}</p> : null}

        <button
          type='submit'
          disabled={loading}
          className='w-full rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70'
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </section>
  )
}

export default LoginPage
