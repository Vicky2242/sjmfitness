import CtaButton from './CtaButton'
import SectionContainer from './SectionContainer'

function HeroSection() {
  return (
    <SectionContainer id='home' className='relative overflow-hidden pt-20 sm:pt-24'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.20),_transparent_45%)]'></div>
      <div className='relative grid items-center gap-12 lg:grid-cols-2'>
        <div className='space-y-6 animate-fade-up'>
          <p className='inline-flex rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300'>
            Elite Fitness Experience
          </p>
          <h1 className='text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl'>
            Transform Your Body. Build Your Best Routine.
          </h1>
          <p className='max-w-xl text-lg text-slate-300'>
            Premium coaching, modern equipment, and performance-focused plans that help you achieve sustainable fitness goals.
          </p>
          <div className='flex flex-wrap gap-3'>
            <CtaButton href='#contact'>Start Membership</CtaButton>
            <CtaButton href='#services' variant='secondary'>
              Explore Programs
            </CtaButton>
          </div>
        </div>

        <div className='animate-fade-up delay-200'>
          <img
            src='https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80'
            alt='Athlete lifting weights in gym'
            className='h-[420px] w-full rounded-2xl object-cover shadow-2xl shadow-emerald-500/20'
          />
        </div>
      </div>
    </SectionContainer>
  )
}

export default HeroSection

