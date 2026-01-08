import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import usePortfolioData from '../hooks/usePortfolioData'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const { data, loading } = usePortfolioData()

  if (loading || !data) {
    return (
      <section className="min-h-screen section-padding bg-elegant-off-white flex items-center justify-center">
        <div className="text-elegant-dark-charcoal text-center">Loading...</div>
      </section>
    )
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
            About <span className="text-elegant-accent">Me</span>
          </h2>
          <div className="w-24 h-1 bg-elegant-accent mx-auto mb-6 " />
        </motion.div>

        <div className="items-center">

          {/* Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4 text-elegant-dark-charcoal/90 leading-relaxed text-base md:text-lg">
              {data.personal.about.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="hover:text-elegant-dark-charcoal transition-colors duration-200"
                >
                  {index === 0 ? (
                    <>
                      {paragraph.split(data.personal.fullName)[0]}
                      <span className="text-elegant-accent font-semibold">{data.personal.fullName}</span>
                      {paragraph.split(data.personal.fullName)[1]}
                    </>
                  ) : (
                    paragraph
                  )}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About

