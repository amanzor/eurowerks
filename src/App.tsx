import { useState } from 'react'
import { CarAssembly } from './components/hero/CarAssembly'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { SmoothScroll } from './components/SmoothScroll'
import { CarSpa } from './components/sections/CarSpa'
import { Contact, Footer, ServiceAreas } from './components/sections/Contact'
import { Garage } from './components/sections/Garage'
import { Manifesto } from './components/sections/Manifesto'
import { MarqueBand } from './components/sections/Marquee'
import { Marques } from './components/sections/Marques'
import { Services } from './components/sections/Services'

export default function App() {
  const [ready, setReady] = useState(false)
  return (
    <div className="grain">
      <SmoothScroll />
      <Preloader onDone={() => setReady(true)} />
      <Navbar />
      <main>
        <CarAssembly ready={ready} />
        <MarqueBand />
        <Manifesto />
        <Services />
        <CarSpa />
        <Garage />
        <Marques />
        <ServiceAreas />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
