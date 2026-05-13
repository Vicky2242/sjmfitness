function CtaButton({ href, children, variant = 'primary' }) {
  const baseClass = 'inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition duration-300'
  const variantClass =
    variant === 'primary'
      ? 'bg-emerald-500 text-slate-900 hover:bg-emerald-400'
      : 'border border-slate-700 bg-slate-900/50 text-slate-100 hover:border-emerald-400 hover:text-emerald-300'

  return (
    <a href={href} className={`${baseClass} ${variantClass}`}>
      {children}
    </a>
  )
}

export default CtaButton

