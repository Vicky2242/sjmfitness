import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'

function App() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const isAdminArea =
    location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/members') ||
    location.pathname.startsWith('/payments')
  const showDefaultNavbar = !isLanding && !isAdminArea
  const mainClass = showDefaultNavbar ? 'mx-auto w-full max-w-5xl px-4 py-8' : ''

  return (
    <div className='min-h-screen'>
      {showDefaultNavbar ? <Navbar /> : null}
      <main className={mainClass}>
        <Outlet />
      </main>
    </div>
  )
}

export default App

