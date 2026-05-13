import SectionContainer from './SectionContainer'
import SectionHeading from './SectionHeading'

const services = [
  {
    title: 'Strength Training',
    description: 'Progressive programs for power, hypertrophy, and functional strength.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Cardio Conditioning',
    description: 'HIIT and endurance plans to increase stamina and burn fat effectively.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Personal Coaching',
    description: '1-on-1 sessions tailored to your lifestyle, injuries, and goals.',
    image: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=900&q=80',
  },
]

function ServicesSection() {
  return (
    <SectionContainer id='services' className='bg-slate-900/30'>
      <SectionHeading
        eyebrow='Services'
        title='Programs designed for every fitness level'
        description='Whether you are starting out or competing, our programs scale with your ability and goals.'
      />
      <div className='grid gap-6 md:grid-cols-3'>
        {services.map((service) => (
          <article key={service.title} className='group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 animate-fade-up'>
            <img src={service.image} alt={service.title} className='h-52 w-full object-cover transition duration-500 group-hover:scale-105' />
            <div className='space-y-3 p-5'>
              <h3 className='text-xl font-semibold text-white'>{service.title}</h3>
              <p className='text-slate-300'>{service.description}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionContainer>
  )
}

export default ServicesSection

