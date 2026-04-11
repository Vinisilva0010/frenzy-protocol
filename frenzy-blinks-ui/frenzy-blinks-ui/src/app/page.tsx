import HeroSection from '@/components/hero/HeroSection'
import HeroCanvas from '@/components/hero/HeroCanvas' 
import VaultCanvas from '@/components/hero/VaultCanvas'
import BlinkSection from '@/components/BlinkSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <HeroCanvas />
      <VaultCanvas />
      <BlinkSection />
    </>
  )
}