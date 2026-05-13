import SectionContainer from './SectionContainer'
import SectionHeading from './SectionHeading'

const features = [
  'Smart member management dashboard',
  'Flexible plans and automated billing',
  'Trainer scheduling and attendance tracking',
  'Workout and nutrition progress insights',
  'Secure JWT-based account access',
  'Mobile-first seamless experience',
]

function FeaturesSection() {
  return (
    <SectionContainer id='features'>
      <SectionHeading
        eyebrow='Features'
        title='Everything needed to run a modern gym'
        description='Built to support operations, member engagement, and business growth in one ecosystem.'
      />
      <div className='grid gap-4 sm:grid-cols-2'>
        {features.map((feature) => (
          <div key={feature} className='rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-slate-200 animate-fade-up'>
            <span className='mr-2 text-emerald-400'>?</span>
            {feature}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}

export default FeaturesSection

