const navItems = [
  { href: '#home', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#services', label: 'Services' },
  { href: '#features', label: 'Features' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact', label: 'Contact' },
]

function LandingNavbar() {
  return (
    <header className='sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur'>
      <nav className='mx-auto flex max-w-6xl items-center justify-between px-4 py-4'>
        <a href='#home' className='text-lg font-bold tracking-wide text-white'>
          Gym<span className='text-emerald-400'>Pro</span>
        </a>
        <ul className='hidden items-center gap-5 md:flex'>
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className='text-sm text-slate-300 transition hover:text-emerald-300'>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a href='#contact' className='rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-emerald-400'>
          Join Now
        </a>
      </nav>
    </header>
  )
}

export default LandingNavbar

