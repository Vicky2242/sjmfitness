import SectionContainer from './SectionContainer'
import SectionHeading from './SectionHeading'

function AboutSection() {
  return (
    <SectionContainer id='about'>
      <SectionHeading
        eyebrow='About Us'
        title='A high-performance gym built for real results'
        description='We combine science-backed training, nutrition coaching, and accountability to help members achieve long-term transformation.'
      />
      <div className='grid gap-6 md:grid-cols-3'>
        {[
          { label: 'Years Experience', value: '12+' },
          { label: 'Certified Trainers', value: '30+' },
          { label: 'Active Members', value: '2,500+' },
        ].map((item) => (
          <article key={item.label} className='rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center animate-fade-up'>
            <p className='text-3xl font-bold text-emerald-400'>{item.value}</p>
            <p className='mt-2 text-slate-300'>{item.label}</p>
          </article>
        ))}
      </div>
    </SectionContainer>
  )
}

export default AboutSection

