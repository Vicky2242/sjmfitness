import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import LoadingState from '../components/common/LoadingState'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import DeleteConfirmModal from '../components/members/DeleteConfirmModal'
import MemberFormModal from '../components/members/MemberFormModal'
import ToastStack from '../components/members/ToastStack'
import useDebouncedValue from '../hooks/useDebouncedValue'
import useToast from '../hooks/useToast'
import { apiClient } from '../lib/apiClient'
import { clearAuthSession, getAdminProfile } from '../lib/auth'
import { exportToCsv, exportToPdfLikeText } from '../utils/exporters'

const PAGE_SIZE = 8

function MembersPage() {
  const navigate = useNavigate()
  const [admin, setAdmin] = useState(getAdminProfile())
  const [members, setMembers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [deleteMember, setDeleteMember] = useState(null)
  const debouncedSearch = useDebouncedValue(search)
  const { toasts, addToast, closeToast } = useToast()

  const exportRows = useMemo(
    () =>
      members.map((member) => ({
        Name: member.name,
        Email: member.email,
        Phone: member.phone,
        Plan: member.membershipPlan,
        Status: member.memberStatus,
        PaymentStatus: member.paymentStatus,
        ExpiryDate: new Date(member.expiryDate).toLocaleDateString(),
      })),
    [members],
  )

  const logout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get('/members', {
        params: { page, limit: PAGE_SIZE, search: debouncedSearch, status },
      })
      setMembers(data.members)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        clearAuthSession()
        navigate('/login', { replace: true })
        return
      }
      addToast(error.response?.data?.message || 'Failed to load members', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast, debouncedSearch, navigate, page, status])

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await apiClient.get('/auth/admin/me')
        setAdmin(data.admin)
      } catch {
        clearAuthSession()
        navigate('/login', { replace: true })
      }
    }

    bootstrap()
  }, [navigate])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const openCreate = () => {
    setEditingMember(null)
    setModalOpen(true)
  }

  const openEdit = (member) => {
    setEditingMember(member)
    setModalOpen(true)
  }

  const handleSave = async (payload) => {
    try {
      setSaving(true)
      if (editingMember?._id) {
        await apiClient.put(`/members/${editingMember._id}`, payload)
        addToast('Member updated successfully')
      } else {
        await apiClient.post('/members', payload)
        addToast('Member added successfully')
      }

      setModalOpen(false)
      setEditingMember(null)
      fetchMembers()
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to save member', 'error')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (!deleteMember?._id) return

    try {
      setDeleting(true)
      await apiClient.delete(`/members/${deleteMember._id}`)
      setDeleteMember(null)
      addToast('Member deleted successfully')
      fetchMembers()
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to delete member', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <DashboardLayout adminName={admin?.name} onLogout={logout}>
        <div className='rounded-xl border border-slate-800 bg-slate-900/70 p-5'>
          <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-white'>Member Management</h1>
              <p className='mt-1 text-sm text-slate-400'>Create, update, search, filter, and manage gym members.</p>
            </div>
            <div className='flex flex-wrap gap-2'>
              <button type='button' onClick={openCreate} className='rounded-md bg-emerald-500 px-4 py-2 font-semibold text-slate-900'>
                Add Member
              </button>
              <button
                type='button'
                onClick={() => exportToCsv('members.csv', exportRows)}
                className='rounded-md border border-cyan-500/40 px-4 py-2 text-sm text-cyan-300'
              >
                Export CSV
              </button>
              <button
                type='button'
                onClick={() =>
                  exportToPdfLikeText(
                    'members-report.pdf',
                    'Gym Members Report',
                    exportRows.map((row) => `${row.Name} | ${row.Email} | ${row.Status} | ${row.Plan}`),
                  )
                }
                className='rounded-md border border-violet-500/40 px-4 py-2 text-sm text-violet-300'
              >
                Export PDF
              </button>
            </div>
          </div>

          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <input
              type='text'
              placeholder='Search by name, email, or phone'
              value={search}
              onChange={(event) => {
                setPage(1)
                setSearch(event.target.value)
              }}
              className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'
            />
            <select
              value={status}
              onChange={(event) => {
                setPage(1)
                setStatus(event.target.value)
              }}
              className='w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100'
            >
              <option value='all'>All Members</option>
              <option value='active'>Active</option>
              <option value='inactive'>Inactive</option>
            </select>
          </div>
        </div>

        <div className='overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70'>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-sm'>
              <thead className='bg-slate-950/70 text-left text-slate-300'>
                <tr>
                  <th className='px-4 py-3'>Name</th>
                  <th className='px-4 py-3'>Plan</th>
                  <th className='px-4 py-3'>Status</th>
                  <th className='px-4 py-3'>Payment</th>
                  <th className='px-4 py-3'>Expiry</th>
                  <th className='px-4 py-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className='px-4 py-2' colSpan='6'>
                      <LoadingState message='Loading members...' />
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td className='px-4 py-2' colSpan='6'>
                      <EmptyState title='No members found' description='Try changing search/filter or add your first member.' />
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member._id} className='border-t border-slate-800'>
                      <td className='px-4 py-3 text-slate-100'>
                        <p className='font-medium'>{member.name}</p>
                        <p className='text-xs text-slate-400'>{member.email}</p>
                      </td>
                      <td className='px-4 py-3 text-slate-300'>{member.membershipPlan}</td>
                      <td className='px-4 py-3 text-slate-300'>{member.memberStatus}</td>
                      <td className='px-4 py-3 text-slate-300'>{member.paymentStatus}</td>
                      <td className='px-4 py-3 text-slate-300'>{new Date(member.expiryDate).toLocaleDateString()}</td>
                      <td className='px-4 py-3'>
                        <div className='flex gap-2'>
                          <button type='button' onClick={() => openEdit(member)} className='rounded-md border border-cyan-500/40 px-3 py-1 text-xs text-cyan-300'>
                            Edit
                          </button>
                          <button type='button' onClick={() => setDeleteMember(member)} className='rounded-md border border-red-500/40 px-3 py-1 text-xs text-red-300'>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className='flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4'>
          <p className='text-sm text-slate-400'>
            Page {page} of {totalPages}
          </p>
          <div className='flex gap-2'>
            <button type='button' disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)} className='rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 disabled:opacity-50'>
              Previous
            </button>
            <button type='button' disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)} className='rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 disabled:opacity-50'>
              Next
            </button>
          </div>
        </div>
      </DashboardLayout>

      <MemberFormModal
        open={modalOpen}
        initialData={editingMember}
        onClose={() => {
          setModalOpen(false)
          setEditingMember(null)
        }}
        onSubmit={handleSave}
        loading={saving}
      />

      <DeleteConfirmModal
        open={Boolean(deleteMember)}
        memberName={deleteMember?.name}
        loading={deleting}
        onCancel={() => setDeleteMember(null)}
        onConfirm={confirmDelete}
      />

      <ToastStack toasts={toasts} onClose={closeToast} />
    </>
  )
}

export default MembersPage
