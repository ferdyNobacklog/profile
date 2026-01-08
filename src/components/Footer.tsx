import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import usePortfolioData from '../hooks/usePortfolioData'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const { data } = usePortfolioData()

  if (!data) return null

  const socialLinks = [
    { icon: FaGithub, href: data.social.github, label: 'GitHub' },
    { icon: FaLinkedin, href: data.social.linkedin, label: 'LinkedIn' },
    { icon: FaEnvelope, href: `mailto:${data.social.email}`, label: 'Email' },
  ]

  return (
    <footer className="bg-elegant-off-white border-t border-elegant-accent/30 text-elegant-charcoal/80 py-8 md:py-12">
      <div className="container-max px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-6 md:mb-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4 text-elegant-dark-charcoal">
              Portfolio
            </h3>
            <p className="text-elegant-charcoal mb-4 md:mb-6 leading-relaxed text-xs sm:text-sm md:text-base max-w-sm mx-auto sm:mx-0">
              {data.personal.title} passionate about creating exceptional digital experiences.
            </p>
            <div className="flex gap-3 md:gap-4 justify-center sm:justify-start">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 md:w-10 md:h-10 bg-elegant-light-gray border border-elegant-accent/50 rounded-lg flex items-center justify-center hover:bg-elegant-accent hover:text-white transition-all hover:shadow-elegant"
                >
                  <Icon size={16} className="md:w-[18px] md:h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm md:text-base lg:text-lg font-semibold mb-3 md:mb-4 text-elegant-dark-charcoal">Quick Links</h4>
            <ul className="space-y-1.5 md:space-y-2 text-xs sm:text-sm md:text-base">
              <li>
                <Link to="/about" className="hover:text-elegant-accent transition-colors text-elegant-charcoal inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-elegant-accent transition-colors text-elegant-charcoal inline-block">
                  Skills
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-elegant-accent transition-colors text-elegant-charcoal inline-block">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-elegant-accent transition-colors text-elegant-charcoal inline-block">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-elegant-accent transition-colors text-elegant-charcoal inline-block">
                  Game Corner
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h4 className="text-sm md:text-base lg:text-lg font-semibold mb-3 md:mb-4 text-elegant-dark-charcoal">Get in Touch</h4>
            <ul className="space-y-1.5 md:space-y-2 text-elegant-charcoal text-xs sm:text-sm md:text-base">
              <li className="break-words">{data.contact.email}</li>
              <li>{data.contact.phone}</li>
              <li>{data.contact.location}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-elegant-accent/30 pt-6 md:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
          <p className="text-elegant-charcoal text-xs sm:text-sm md:text-base flex flex-wrap items-center justify-center gap-1 text-center">
            © {currentYear} Portfolio. Made with <FaHeart className="text-red-500" /> using React
            & Tailwind CSS
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 text-xs sm:text-sm md:text-base justify-center">
            <a href="#" className="hover:text-elegant-accent transition-colors text-elegant-charcoal">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-elegant-accent transition-colors text-elegant-charcoal">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

