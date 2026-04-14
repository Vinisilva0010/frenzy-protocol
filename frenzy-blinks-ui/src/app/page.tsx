import HeroSection from '@/components/hero/HeroSection'
import HeroCanvas from '@/components/hero/HeroCanvas' 
import VaultCanvas from '@/components/hero/VaultCanvas'
import BlinkSection from '@/components/BlinkSection'
import VideoPanel from '@/components/VideoPanel'
import DividerTape from '@/components/DividerTape'
import ArchitectureCarousel from '@/components/ArchitectureCarousel'
import FaqSection from '@/components/FaqSection'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import SecuritySection from '@/components/SecuritySection'
export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HeroCanvas />
      <VaultCanvas />
      <DividerTape />
      <VideoPanel />
      <SecuritySection />
       <DividerTape />
      <BlinkSection />
      <DividerTape />
      <ArchitectureCarousel />
      <FaqSection />
      <Footer />
    </>
  )
}