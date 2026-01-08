import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa'
import usePortfolioData from '../hooks/usePortfolioData'

interface ExperienceItem {
  type: 'work' | 'education'
  title: string
  company: string
  location: string
  period: string
  description: string[]
  technologies?: string[]
}

const Experience = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { data, loading } = usePortfolioData()

  if (loading || !data) {
    return (
      <section className="min-h-screen section-padding bg-elegant-white flex items-center justify-center">
        <div className="text-elegant-dark-charcoal text-center">Loading...</div>
      </section>
    )
  }

  const experiences: ExperienceItem[] = data.experience

  return (
    <section ref={ref} className="min-h-screen section-padding bg-elegant-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 px-6 sm:px-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-elegant-dark-charcoal font-display">
            Experience <span className="text-elegant-accent">&</span> Education
          </h2>
          <div className="w-24 h-1 bg-elegant-accent/60 mx-auto mb-4 sm:mb-6 shadow-elegant" />
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-elegant-dark-charcoal/90 max-w-3xl mx-auto font-mono leading-relaxed">
            My professional journey and educational background
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto px-6 sm:px-4 md:px-0">
          {/* Timeline Line */}
          <div className="absolute left-6 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-elegant-accent via-elegant-teal to-elegant-accent transform md:-translate-x-1/2" />

          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-start ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-6 sm:left-8 md:left-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-elegant-accent border-2 sm:border-4 border-elegant-white shadow-elegant transform md:-translate-x-1/2 z-10 ${
                    exp.type === 'education' ? 'bg-elegant-teal border-elegant-white' : ''
                  }`}
                />

                {/* Content Card */}
                <div
                  className={`ml-14 sm:ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                  }`}
                >
                  <div className="bg-elegant-off-white rounded-xl p-5 sm:p-6 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 border border-elegant-accent/30 hover:border-elegant-accent hover:scale-105 transform">
                    <div className="flex flex-col gap-4 mb-4">
                      <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                            exp.type === 'work'
                              ? 'bg-elegant-accent/10 text-elegant-accent border-elegant-accent/30'
                              : 'bg-elegant-teal/10 text-elegant-teal border-elegant-teal/30'
                          }`}
                        >
                          {exp.type === 'work' ? (
                            <FaBriefcase size={18} className="sm:w-5 sm:h-5" />
                          ) : (
                            <FaGraduationCap size={18} className="sm:w-5 sm:h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-elegant-dark-charcoal mb-1 break-words">{exp.title}</h3>
                          <p className="text-sm sm:text-base text-elegant-accent font-semibold mb-1 break-words">{exp.company}</p>
                          <p className="text-xs sm:text-sm text-elegant-charcoal break-words">{exp.location}</p>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-elegant-charcoal bg-elegant-light-gray border border-elegant-accent/30 px-2 sm:px-3 py-1 rounded-full whitespace-nowrap self-start sm:self-auto text-center">
                        {exp.period}
                      </span>
                    </div>

                    <ul className="space-y-2.5 sm:space-y-2 mb-4 sm:mb-4">
                      {exp.description.map((item, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + idx * 0.05 }}
                          className="text-elegant-charcoal flex items-start gap-2.5 sm:gap-2 text-xs sm:text-sm md:text-base leading-relaxed hover:text-elegant-dark-charcoal transition-colors duration-200"
                        >
                          <span className="text-elegant-accent mt-1.5 flex-shrink-0">•</span>
                          <span className="break-words">{item}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {exp.technologies && (
                      <div className="flex flex-wrap gap-2.5 sm:gap-2 pt-4 sm:pt-4 border-t border-elegant-accent/30">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 sm:px-3 py-1 bg-elegant-accent/10 text-elegant-accent border border-elegant-accent/30 rounded-full text-xs sm:text-sm font-medium hover:bg-elegant-accent/20 hover:scale-105 transform transition-all duration-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience

