import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatedBackground } from './components/Chrome'
import { Footer, Navbar } from './components/Navbar'
import { PwaManifest } from './components/PwaManifest'
import { PageFade } from './components/Reveal'
import { ThemeProvider } from './context/ThemeContext'
import { AboutPage } from './pages/About'
import { AdminPage } from './pages/Admin'
import { ContactPage } from './pages/Contact'
import { HomePage } from './pages/Home'
import { PortfolioPage } from './pages/Portfolio'
import { ProjectDetailPage } from './pages/ProjectDetail'

export default function App() {
  const location = useLocation()

  return (
    <ThemeProvider>
      <PwaManifest />
      <div className="site-shell">
        <AnimatedBackground />
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
