import SectionContainer from './SectionContainer'
import SectionHeading from './SectionHeading'

function ContactSection() {
  return (
    <SectionContainer id='contact'>
      <SectionHeading
        eyebrow='Contact'
        title='Start your transformation today'
        description='Book a free consultation and get a personalized plan from our coaching team.'
      />
      <form className='mx-auto grid max-w-3xl gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:grid-cols-2'>
        <input type='text' placeholder='Full Name' className='rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-emerald-400 focus:ring-2' />
        <input type='email' placeholder='Email Address' className='rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-emerald-400 focus:ring-2' />
        <input type='tel' placeholder='Phone Number' className='rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-emerald-400 focus:ring-2 sm:col-span-2' />
        <textarea rows='4' placeholder='Tell us about your fitness goal' className='rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none ring-emerald-400 focus:ring-2 sm:col-span-2' />
        <button type='submit' className='rounded-md bg-emerald-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-emerald-400 sm:col-span-2'>
          Get Free Consultation
        </button>
      </form>
    </SectionContainer>
  )
}

export default ContactSection

