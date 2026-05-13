import SectionContainer from './SectionContainer'
import SectionHeading from './SectionHeading'

const testimonials = [
  {
    name: 'Riya Malhotra',
    role: 'Member - 8 months',
    quote: 'The coaching is elite. I lost 12kg and gained confidence while training in a supportive, premium environment.',
  },
  {
    name: 'Arjun Mehta',
    role: 'Corporate Professional',
    quote: 'Short, effective sessions fit my schedule perfectly. Progress tracking keeps me motivated every week.',
  },
  {
    name: 'Vikram S.',
    role: 'Athlete',
    quote: 'The trainers understand performance metrics and recovery. My strength and conditioning improved significantly.',
  },
]

function TestimonialsSection() {
  return (
    <SectionContainer id='testimonials' className='bg-slate-900/30'>
      <SectionHeading
        eyebrow='Testimonials'
        title='What our members say'
        description='Real stories from people who transformed their lifestyle with our gym ecosystem.'
      />
      <div className='grid gap-6 md:grid-cols-3'>
        {testimonials.map((item) => (
          <blockquote key={item.name} className='rounded-xl border border-slate-800 bg-slate-900/60 p-6 animate-fade-up'>
            <p className='text-slate-200'>"{item.quote}"</p>
            <footer className='mt-5'>
              <p className='font-semibold text-white'>{item.name}</p>
              <p className='text-sm text-slate-400'>{item.role}</p>
            </footer>
          </blockquote>
        ))}
      </div>
    </SectionContainer>
  )
}

export default TestimonialsSection

