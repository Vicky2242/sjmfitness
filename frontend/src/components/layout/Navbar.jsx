import { NavLink, useNavigate } from 'react-router-dom'
import { clearAuthSession, isAuthenticated } from '../../lib/auth'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/login', label: 'Login' },
  { to: '/dashboard', label: 'Dashboard' },
]

function Navbar() {
  const navigate = useNavigate()
  const authed = isAuthenticated()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login', { replace: true })
  }

  return (
    <header className='border-b border-slate-800 bg-slate-900/70'>
      <nav className='mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4'>
        <h1 className='text-lg font-semibold text-emerald-400'>Gym Management System</h1>
        <ul className='flex items-center gap-3'>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm ${
                    isActive ? 'bg-emerald-500 text-slate-900' : 'text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          {authed ? (
            <li>
              <button
                type='button'
                onClick={handleLogout}
                className='rounded-md bg-red-500 px-3 py-2 text-sm text-white transition hover:bg-red-400'
              >
                Logout
              </button>
            </li>
          ) : null}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
