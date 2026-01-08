import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import usePortfolioData from '../hooks/usePortfolioData'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { data, loading } = usePortfolioData()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (loading || !data) {
    return (
      <section className="min-h-screen section-padding bg-elegant-off-white flex items-center justify-center">
        <div className="text-elegant-dark-charcoal text-center">Loading...</div>
      </section>
    )
  }

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: data.contact.email,
      href: `mailto:${data.contact.email}`,
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: data.contact.phone,
      href: `tel:${data.contact.phone.replace(/\s/g, '')}`,
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Location',
      value: data.contact.location,
      href: '#',
    },
  ]

  const socialLinks = [
    { icon: FaGithub, href: data.social.github, label: 'GitHub' },
    { icon: FaLinkedin, href: data.social.linkedin, label: 'LinkedIn' },
    { icon: FaTwitter, href: data.social.twitter, label: 'Twitter' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! I will get back to you soon.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section ref={ref} className="min-h-screen section-padding bg-elegant-off-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-elegant-dark-charcoal font-display">
            Get in <span className="text-elegant-accent">Touch</span>
          </h2>
          <div className="w-24 h-1 bg-elegant-accent/60 mx-auto mb-6 shadow-elegant" />
          <p className="text-lg md:text-xl text-elegant-dark-charcoal/90 max-w-3xl mx-auto font-mono leading-relaxed">
            Have a project in mind or want to collaborate? Let's talk!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-elegant-accent font-display">Let's Connect</h3>
              <p className="text-elegant-dark-charcoal/90 mb-8 leading-relaxed text-base md:text-lg">
                I'm always open to discussing new projects, creative ideas, or opportunities 
                to be part of your vision. Feel free to reach out!
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon
                return (
                  <motion.a
                    key={info.label}
                    href={info.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-elegant-light-gray rounded-xl hover:bg-elegant-accent/10 transition-all border border-elegant-accent/30 hover:border-elegant-accent group"
                  >
                    <div className="w-12 h-12 bg-elegant-accent text-cyber-black rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform border border-elegant-accent shadow-elegant">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm text-elegant-dark-charcoal/70 mb-1 font-mono">{info.label}</div>
                      <div className="font-semibold text-elegant-dark-charcoal font-mono text-base">{info.value}</div>
                    </div>
                  </motion.a>
                )
              })}
            </div>

            <div>
              <h4 className="text-base md:text-lg font-semibold mb-4 text-elegant-dark-charcoal font-mono">Follow Me</h4>
              <div className="flex gap-4">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-12 h-12 bg-elegant-light-gray text-elegant-dark-charcoal border border-elegant-accent/50 rounded-lg flex items-center justify-center hover:bg-elegant-accent hover:text-cyber-black transition-all hover:shadow-elegant"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-elegant-light-gray rounded-2xl p-8 border border-elegant-accent/30"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm md:text-base font-medium text-elegant-dark-charcoal mb-2 font-mono">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-elegant-off-white border border-elegant-accent/50 text-elegant-dark-charcoal rounded-lg focus:ring-2 focus:ring-cyber-green/50 focus:border-elegant-accent/70 outline-none transition-all font-mono placeholder-cyber-green-soft/50 text-base"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm md:text-base font-medium text-elegant-dark-charcoal mb-2 font-mono">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-elegant-off-white border border-elegant-accent/50 text-elegant-dark-charcoal rounded-lg focus:ring-2 focus:ring-cyber-green/50 focus:border-elegant-accent/70 outline-none transition-all font-mono placeholder-cyber-green-soft/50 text-base"
                  placeholder={data.contact.email}
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm md:text-base font-medium text-elegant-dark-charcoal mb-2 font-mono">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-elegant-off-white border border-elegant-accent/50 text-elegant-dark-charcoal rounded-lg focus:ring-2 focus:ring-cyber-green/50 focus:border-elegant-accent/70 outline-none transition-all font-mono placeholder-cyber-green-soft/50 text-base"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm md:text-base font-medium text-elegant-dark-charcoal mb-2 font-mono">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-elegant-off-white border border-elegant-accent/50 text-elegant-dark-charcoal rounded-lg focus:ring-2 focus:ring-cyber-green/50 focus:border-elegant-accent/70 outline-none transition-all resize-none font-mono placeholder-cyber-green-soft/50 text-base leading-relaxed"
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-elegant-accent text-cyber-black rounded-lg font-semibold hover:bg-elegant-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-elegant border border-elegant-accent font-mono"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact

