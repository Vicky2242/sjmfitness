function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className='mx-auto mb-10 max-w-3xl text-center animate-fade-up'>
      <p className='mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-400'>{eyebrow}</p>
      <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>{title}</h2>
      <p className='mt-4 text-slate-300'>{description}</p>
    </div>
  )
}

export default SectionHeading

