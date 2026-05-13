function SectionContainer({ id, children, className = '' }) {
  return (
    <section id={id} className={`px-4 py-16 sm:py-20 ${className}`}>
      <div className='mx-auto w-full max-w-6xl'>{children}</div>
    </section>
  )
}

export default SectionContainer

