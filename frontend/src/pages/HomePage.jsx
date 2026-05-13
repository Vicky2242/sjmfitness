import LandingNavbar from '../components/landing/LandingNavbar'
import HeroSection from '../components/landing/HeroSection'
import AboutSection from '../components/landing/AboutSection'
import ServicesSection from '../components/landing/ServicesSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import ContactSection from '../components/landing/ContactSection'
import Footer from '../components/landing/Footer'

function HomePage() {
  return (
    <div className='bg-slate-950 text-slate-100'>
      <LandingNavbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

export default HomePage

