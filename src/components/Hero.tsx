import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope, FaDownload } from 'react-icons/fa'
import ProfileImage from './ProfileImage'
import RotatingText from './RotatingText'
import profileImage from '../assets/profile.jpeg'
import usePortfolioData from '../hooks/usePortfolioData'
import { theme } from '../theme/theme'

const Hero = () => {
  const { data, loading } = usePortfolioData()

  if (loading || !data) {
    return (
      <section className="min-h-screen flex items-center justify-center section-padding">
        <div className={`${theme.text.primary} text-center`}>Loading...</div>
      </section>
    )
  }

  const socialLinks = [
    { icon: FaGithub, href: data.social.github, label: 'GitHub' },
    { icon: FaLinkedin, href: data.social.linkedin, label: 'LinkedIn' },
    { icon: FaEnvelope, href: `mailto:${data.social.email}`, label: 'Email' },
  ]

  return (
    <section className={`min-h-screen flex items-center justify-center section-padding relative overflow-hidden ${theme.bg.primary}`}>
      
      <div className="container-max relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Right Content - Profile Image (appears first on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 relative flex justify-center"
          >
            <div className={`relative w-64 h-64 md:w-full md:h-96 lg:h-[500px] rounded-full md:rounded-2xl overflow-hidden ${theme.border.default} ${theme.bg.card} ${theme.shadow.hover} border-4 md:border-2`}>
              {/* Profile Image */}
              <ProfileImage 
                src={profileImage}
                alt={data.personal.fullName}
                fallbackText={`[${data.personal.nickname.toUpperCase()}]`}
              />
            </div>
          </motion.div>

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 text-center md:text-left"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-4xl md:text-6xl font-bold mb-6 leading-tight ${theme.text.primary} font-display`}
            >
              Hello, I'm {data.personal.nickname}
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl font-semibold mb-6 text-elegant-accent"
            >
              <RotatingText />
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`text-base md:text-lg ${theme.text.secondary} mb-8 max-w-xl leading-relaxed`}
            >
              {data.personal.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row md:justify-center lg:justify-start gap-4 mb-8"
            >
              <a
                href="/contact"
                className={`px-8 py-3 rounded-lg font-medium ${theme.button.primary} transform hover:scale-105 transition-transform duration-200`}
              >
                Get in Touch
              </a>
              <a
                href={data.resume.url}
                download
                className={`px-8 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${theme.button.secondary} transform hover:scale-105 transition-transform duration-200`}
              >
                <FaDownload /> Download Resume
              </a>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-4 justify-center lg:justify-start"
            >
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-12 h-12 flex items-center justify-center ${theme.bg.tertiary} rounded-full ${theme.text.secondary} transition-all duration-300 ${theme.border.default} hover:border-elegant-accent hover:text-elegant-accent hover:bg-elegant-accent/10 hover:shadow-elegant hover:scale-110 hover:-translate-y-1`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero

