import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatedBackground } from './components/Chrome'
import { Footer, Navbar } from './components/Navbar'
import { PwaManifest } from './components/PwaManifest'
import { PageFade } from './components/Reveal'
import { ScrollProgress } from './components/ScrollProgress'
import { ThemeProvider } from './context/ThemeContext'
import { AboutPage } from './pages/About'
import { AdminPage } from './pages/Admin'
import { ContactPage } from './pages/Contact'
import { HomePage } from './pages/Home'
import { PortfolioPage } from './pages/Portfolio'
import { ProjectDetailPage } from './pages/ProjectDetail'
import { CityScroll } from './components/CityScroll'

export default function App() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <ThemeProvider>
        <PwaManifest />
        <ScrollProgress />
        <div className="site-shell">
        <div className="water-left" aria-hidden="true" />
        {location.pathname !== '/' && <AnimatedBackground />}
        {location.pathname === '/' && <CityScroll />}
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageFade><HomePage /></PageFade>} />
            <Route path="/a-propos" element={<PageFade><AboutPage /></PageFade>} />
            <Route path="/portfolio" element={<PageFade><PortfolioPage /></PageFade>} />
            <Route path="/portfolio/:id" element={<PageFade><ProjectDetailPage /></PageFade>} />
            <Route path="/contact" element={<PageFade><ContactPage /></PageFade>} />
            <Route path="/admin" element={<PageFade><AdminPage /></PageFade>} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
