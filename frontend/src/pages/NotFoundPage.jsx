import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className='space-y-3'>
      <h2 className='text-2xl font-semibold text-red-400'>404 - Page Not Found</h2>
      <Link className='text-emerald-400 underline' to='/'>
        Go back to home
      </Link>
    </section>
  )
}

export default NotFoundPage
