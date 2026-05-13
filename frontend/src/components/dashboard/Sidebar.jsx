import { NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Overview', to: '/dashboard' },
  { label: 'Members', to: '/members' },
  { label: 'Payments', to: '/payments' },
]

function Sidebar({ adminName, onLogout }) {
  return (
    <aside className='w-full shrink-0 rounded-xl border border-slate-800 bg-slate-900/70 p-4 lg:w-64'>
      <div className='mb-6 border-b border-slate-800 pb-4'>
        <p className='text-xs uppercase tracking-[0.2em] text-slate-400'>Admin Panel</p>
        <h2 className='mt-2 text-xl font-bold text-emerald-400'>GymPro</h2>
        <p className='mt-2 text-sm text-slate-300'>Welcome, {adminName || 'Admin'}</p>
      </div>

      <nav className='space-y-2'>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                isActive
                  ? 'bg-emerald-500 text-slate-900'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-emerald-300'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type='button'
        onClick={onLogout}
        className='mt-6 w-full rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-400'
      >
        Logout
      </button>
    </aside>
  )
}

export default Sidebar
