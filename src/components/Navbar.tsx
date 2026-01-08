import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const location = useLocation()
  const currentPath = location.pathname.slice(1) || 'home'

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'skills', label: 'Skills', path: '/skills' },
    { id: 'experience', label: 'Experience', path: '/experience' },
    { id: 'contact', label: 'Contact', path: '/contact' },
    { id: 'games', label: 'Game Corner', path: '/games' },
    { id: 'manga', label: 'Manga', path: '/manga' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-elegant-white/95 backdrop-blur-sm shadow-elegant border-b border-elegant-gray' : 'bg-transparent'
      }`}
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-16 md:h-20 px-3">
          <Link
            to="/"
            className="text-2xl font-bold text-elegant-dark-charcoal hover:text-elegant-accent transition-all font-display tracking-tight hover:scale-105 transform duration-200"
          >
            Portfolio
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`relative text-base font-medium transition-all duration-200 ${
                  currentPath === item.id
                    ? 'text-elegant-accent'
                    : 'text-elegant-charcoal hover:text-elegant-accent hover:scale-105'
                }`}
              >
                {item.label}
                {currentPath === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-elegant-accent"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-elegant-dark-charcoal hover:text-elegant-accent transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-elegant-off-white border-t border-elegant-gray"
          >
            <div className="container-max py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPath === item.id
                      ? 'bg-elegant-accent/10 text-elegant-accent border border-elegant-accent/30'
                      : 'text-elegant-charcoal hover:bg-elegant-light-gray hover:text-elegant-accent hover:translate-x-1'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar

