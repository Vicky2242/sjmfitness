function Footer() {
  return (
    <footer className='border-t border-slate-800 bg-slate-950 py-8'>
      <div className='mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 text-sm text-slate-400 sm:flex-row'>
        <p>© {new Date().getFullYear()} GymPro. All rights reserved.</p>
        <p>Built for performance and healthy lifestyles.</p>
      </div>
    </footer>
  )
}

export default Footer

