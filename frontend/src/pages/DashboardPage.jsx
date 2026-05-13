import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '../lib/apiClient'
import { clearAuthSession, getAdminProfile } from '../lib/auth'
import StatCard from '../components/dashboard/StatCard'
import RevenueChart from '../components/dashboard/RevenueChart'
import DashboardLayout from '../components/dashboard/DashboardLayout'

const dashboardStats = [
  { title: 'Total Members', value: '2,480', subtitle: 'Across all plans', accent: 'text-emerald-400' },
  { title: 'Active Members', value: '1,920', subtitle: 'Currently in good standing', accent: 'text-cyan-400' },
  { title: 'Inactive Members', value: '420', subtitle: 'No recent attendance', accent: 'text-amber-400' },
  { title: 'Pending Payments', value: '140', subtitle: 'Requires follow-up', accent: 'text-rose-400' },
]

const revenueData = [
  { month: 'Jan', revenue: 18000 },
  { month: 'Feb', revenue: 22000 },
  { month: 'Mar', revenue: 25000 },
  { month: 'Apr', revenue: 23000 },
  { month: 'May', revenue: 28000 },
  { month: 'Jun', revenue: 32000 },
  { month: 'Jul', revenue: 30000 },
  { month: 'Aug', revenue: 34000 },
]

function DashboardPage() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(getAdminProfile())
  const [error, setError] = useState('')

  const logout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const { data } = await apiClient.get('/auth/admin/me')
        setAdmin(data.admin)
      } catch (apiError) {
        setError(apiError.response?.data?.message || 'Session expired. Please login again.')
        clearAuthSession()
        navigate('/login', { replace: true })
      }
    }

    fetchAdminProfile()
  }, [navigate])

  return (
    <DashboardLayout adminName={admin?.name} onLogout={logout}>
      <div className='rounded-xl border border-slate-800 bg-slate-900/70 p-5'>
        <h1 className='text-2xl font-bold text-white'>Gym Admin Dashboard</h1>
        <p className='mt-2 text-slate-300'>Track operations, member activity, and payment performance in one view.</p>
        {admin ? (
          <p className='mt-2 text-sm text-slate-400'>
            Logged in as <span className='font-semibold text-emerald-300'>{admin.name}</span> ({admin.email})
          </p>
        ) : null}
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} subtitle={stat.subtitle} accent={stat.accent} />
        ))}
      </div>

      <RevenueChart data={revenueData} />

      {error ? <p className='rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-300'>{error}</p> : null}
    </DashboardLayout>
  )
}

export default DashboardPage
