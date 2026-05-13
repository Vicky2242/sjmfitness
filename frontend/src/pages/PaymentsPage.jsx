import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import EmptyState from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import ToastStack from '../components/members/ToastStack'
import StatusBadge from '../components/payments/StatusBadge'
import useToast from '../hooks/useToast'
import { apiClient } from '../lib/apiClient'
import { clearAuthSession, getAdminProfile } from '../lib/auth'
import { exportToCsv, exportToPdfLikeText } from '../utils/exporters'

const PAGE_SIZE = 8

function PaymentsPage() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(getAdminProfile())
  const [members, setMembers] = useState([])
  const [payments, setPayments] = useState([])
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [analytics, setAnalytics] = useState({ totalRevenue: 0, statusCounts: { paid: 0, pending: 0, overdue: 0 }, revenueSeries: [] })
  const [loading, setLoading] = useState(false)
  const { toasts, addToast, closeToast } = useToast()
  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    dueDate: '',
    status: 'pending',
    paymentMethod: 'cash',
  })

  const logout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  const handleAuthFailure = useCallback(() => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }, [navigate])

  const fetchMembers = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/members', { params: { page: 1, limit: 200, status: 'all' } })
      setMembers(data.members)
      if (!formData.memberId && data.members[0]?._id) {
        setFormData((prev) => ({ ...prev, memberId: data.members[0]._id }))
      }
    } catch {
      addToast('Failed to load members for payment form', 'error')
    }
  }, [addToast, formData.memberId])

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get('/payments', { params: { page, limit: PAGE_SIZE, status } })
      setPayments(data.payments)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) {
        handleAuthFailure()
        return
      }
      addToast(error.response?.data?.message || 'Failed to load payments', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast, handleAuthFailure, page, status])

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/payments/analytics')
      setAnalytics(data)
    } catch {
      addToast('Failed to load payment analytics', 'error')
    }
  }, [addToast])

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await apiClient.get('/auth/admin/me')
        setAdmin(data.admin)
      } catch {
        handleAuthFailure()
      }
    }

    bootstrap()
  }, [handleAuthFailure])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics, payments.length])

  const handleRecordPayment = async (event) => {
    event.preventDefault()
    try {
      await apiClient.post('/payments', {
        ...formData,
        amount: Number(formData.amount),
      })
      addToast('Payment recorded successfully')
      setFormData((prev) => ({ ...prev, amount: '', dueDate: '' }))
      fetchPayments()
      fetchAnalytics()
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to record payment', 'error')
    }
  }

  const handleRenewMembership = async (memberId) => {
    try {
      await apiClient.post(`/payments/renew/${memberId}`, { months: 1, amount: 0, paymentMethod: 'cash' })
      addToast('Membership renewed for 1 month')
      fetchPayments()
      fetchAnalytics()
    } catch (error) {
      addToast(error.response?.data?.message || 'Renewal failed', 'error')
    }
  }

  const handleDownloadInvoice = async (paymentId) => {
    try {
      const { data } = await apiClient.get(`/payments/${paymentId}/invoice`)
      const text = JSON.stringify(data.invoice, null, 2)
      const blob = new Blob([text], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${data.invoice.invoiceNumber}.json`
      anchor.click()
      URL.revokeObjectURL(url)
      addToast('Invoice downloaded')
    } catch {
      addToast('Failed to generate invoice', 'error')
    }
  }

  const statusPieData = useMemo(
    () => [
      { name: 'Paid', value: analytics.statusCounts.paid, color: '#10b981' },
      { name: 'Pending', value: analytics.statusCounts.pending, color: '#f59e0b' },
      { name: 'Overdue', value: analytics.statusCounts.overdue, color: '#ef4444' },
    ],
    [analytics.statusCounts.overdue, analytics.statusCounts.paid, analytics.statusCounts.pending],
  )

  const paymentRows = useMemo(
    () =>
      payments.map((payment) => ({
        Invoice: payment.invoiceNumber,
        Member: payment.member?.name || 'Unknown',
        Amount: payment.amount,
        Status: payment.status,
        DueDate: new Date(payment.dueDate).toLocaleDateString(),
      })),
    [payments],
  )

  return (
    <>
      <DashboardLayout adminName={admin?.name} onLogout={logout}>
        <div className='rounded-xl border border-slate-800 bg-slate-900/70 p-5'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-white'>Payment Management</h1>
              <p className='mt-1 text-sm text-slate-400'>Track payment history, monitor statuses, and manage membership renewals.</p>
              <p className='mt-3 text-lg font-semibold text-emerald-300'>Total Revenue: ${analytics.totalRevenue.toLocaleString()}</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <button type='button' onClick={() => exportToCsv('payments.csv', paymentRows)} className='rounded-md border border-cyan-500/40 px-4 py-2 text-sm text-cyan-300'>
                Export CSV
              </button>
              <button
                type='button'
                onClick={() =>
                  exportToPdfLikeText(
                    'payments-report.pdf',
                    'Gym Payments Report',
                    paymentRows.map((row) => `${row.Invoice} | ${row.Member} | ${row.Amount} | ${row.Status}`),
                  )
                }
                className='rounded-md border border-violet-500/40 px-4 py-2 text-sm text-violet-300'
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleRecordPayment} className='grid gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-5 md:grid-cols-5'>
          <select value={formData.memberId} onChange={(event) => setFormData((prev) => ({ ...prev, memberId: event.target.value }))} className='rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'>
            <option value=''>Select Member</option>
            {members.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name}
              </option>
            ))}
          </select>
          <input type='number' placeholder='Amount' value={formData.amount} onChange={(event) => setFormData((prev) => ({ ...prev, amount: event.target.value }))} className='rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100' />
          <input type='date' value={formData.dueDate} onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))} className='rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100' />
          <select value={formData.status} onChange={(event) => setFormData((prev) => ({ ...prev, status: event.target.value }))} className='rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'>
            <option value='paid'>Paid</option>
            <option value='pending'>Pending</option>
            <option value='overdue'>Overdue</option>
          </select>
          <button type='submit' className='rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-900'>
            Record Payment
          </button>
        </form>

        <div className='grid gap-5 lg:grid-cols-2'>
          <div className='rounded-xl border border-slate-800 bg-slate-900/70 p-5'>
            <h2 className='mb-4 text-lg font-semibold text-white'>Revenue Analytics</h2>
            <div className='h-72'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={analytics.revenueSeries}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#1e293b' />
                  <XAxis dataKey='month' stroke='#94a3b8' />
                  <YAxis stroke='#94a3b8' />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                  <Bar dataKey='revenue' fill='#10b981' radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className='rounded-xl border border-slate-800 bg-slate-900/70 p-5'>
            <h2 className='mb-4 text-lg font-semibold text-white'>Status Breakdown</h2>
            <div className='h-72'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie data={statusPieData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={95}>
                    {statusPieData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className='rounded-xl border border-slate-800 bg-slate-900/70 p-5'>
          <div className='mb-4 flex items-center justify-between gap-3'>
            <h2 className='text-lg font-semibold text-white'>Payment History</h2>
            <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value) }} className='rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'>
              <option value='all'>All</option>
              <option value='paid'>Paid</option>
              <option value='pending'>Pending</option>
              <option value='overdue'>Overdue</option>
            </select>
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='text-left text-slate-300'>
                <tr>
                  <th className='px-3 py-2'>Invoice</th>
                  <th className='px-3 py-2'>Member</th>
                  <th className='px-3 py-2'>Amount</th>
                  <th className='px-3 py-2'>Status</th>
                  <th className='px-3 py-2'>Due Date</th>
                  <th className='px-3 py-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className='px-3 py-1' colSpan='6'>
                      <LoadingState message='Loading payments...' />
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td className='px-3 py-1' colSpan='6'>
                      <EmptyState title='No payments found' description='Record a payment or adjust status filter.' />
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id} className='border-t border-slate-800'>
                      <td className='px-3 py-3 text-slate-200'>{payment.invoiceNumber}</td>
                      <td className='px-3 py-3 text-slate-200'>{payment.member?.name || 'Unknown'}</td>
                      <td className='px-3 py-3 text-slate-200'>${payment.amount}</td>
                      <td className='px-3 py-3'><StatusBadge status={payment.status} /></td>
                      <td className='px-3 py-3 text-slate-200'>{new Date(payment.dueDate).toLocaleDateString()}</td>
                      <td className='px-3 py-3'>
                        <div className='flex flex-wrap gap-2'>
                          <button type='button' onClick={() => handleDownloadInvoice(payment._id)} className='rounded border border-cyan-500/40 px-2 py-1 text-xs text-cyan-300'>Invoice</button>
                          <button type='button' onClick={() => handleRenewMembership(payment.member?._id)} className='rounded border border-emerald-500/40 px-2 py-1 text-xs text-emerald-300'>Renew</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className='mt-4 flex items-center justify-between'>
            <p className='text-sm text-slate-400'>Page {page} of {totalPages}</p>
            <div className='flex gap-2'>
              <button type='button' disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)} className='rounded border border-slate-700 px-3 py-1 text-sm text-slate-200 disabled:opacity-50'>Previous</button>
              <button type='button' disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)} className='rounded border border-slate-700 px-3 py-1 text-sm text-slate-200 disabled:opacity-50'>Next</button>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <ToastStack toasts={toasts} onClose={closeToast} />
    </>
  )
}

export default PaymentsPage
