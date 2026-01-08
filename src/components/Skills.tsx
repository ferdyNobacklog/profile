import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import usePortfolioData from '../hooks/usePortfolioData'
import { getSkillIcon } from '../utils/skillIcons'

const Skills = () => {
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

  const skillCategories = data.skills.categories.map(category => ({
    ...category,
    skills: category.skills.map(skill => ({
      ...skill,
      icon: getSkillIcon(skill.name),
    })),
  }))

  return (
    <section ref={ref} className="min-h-screen section-padding bg-elegant-white">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-elegant-dark-charcoal font-display">
            My <span className="text-elegant-accent">Skills</span>
          </h2>
          <div className="w-24 h-1 bg-elegant-accent/60 mx-auto mb-6 shadow-elegant" />
          <p className="text-lg md:text-xl text-elegant-dark-charcoal/90 max-w-3xl mx-auto font-mono leading-relaxed">
            Technologies and tools I work with
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              className="bg-elegant-off-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 border border-elegant-accent/30 hover:border-elegant-accent hover:scale-105 transform"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-elegant-dark-charcoal text-elegant-accent font-display">{category.category}</h3>
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => {
                  const Icon = skill.icon
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: categoryIndex * 0.1 + skillIndex * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {Icon && (
                            <div className="w-8 h-8 text-elegant-dark-charcoal">
                              <Icon size={24} />
                            </div>
                          )}
                          <span className="font-semibold text-elegant-dark-charcoal text-base">{skill.name}</span>
                        </div>
                        <span className="text-sm md:text-base text-elegant-dark-charcoal/80 font-mono">{skill.level}%</span>
                      </div>
                      <div className="h-2 bg-elegant-light-gray rounded-full overflow-hidden border border-elegant-accent/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: categoryIndex * 0.1 + skillIndex * 0.1 }}
                          className="h-full bg-gradient-to-r from-cyber-green to-cyber-cyan rounded-full shadow-elegant"
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills

