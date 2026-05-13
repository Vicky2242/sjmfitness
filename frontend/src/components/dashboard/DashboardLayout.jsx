import Sidebar from './Sidebar'

function DashboardLayout({ adminName, onLogout, children }) {
  return (
    <section className='w-full'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-5 px-2 py-4 lg:flex-row lg:px-4'>
        <Sidebar adminName={adminName} onLogout={onLogout} />
        <div className='w-full space-y-5'>{children}</div>
      </div>
    </section>
  )
}

export default DashboardLayout
