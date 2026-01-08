import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiPython,
  SiDocker,
  SiGit,
  SiTailwindcss,
  SiNextdotjs,
  SiGraphql,
  SiRedis,
} from 'react-icons/si'

export const getSkillIcon = (skillName: string) => {
  const iconMap: { [key: string]: any } = {
    React: SiReact,
    TypeScript: SiTypescript,
    JavaScript: SiJavascript,
    'Node.js': SiNodedotjs,
    Express: SiExpress,
    MongoDB: SiMongodb,
    PostgreSQL: SiPostgresql,
    Python: SiPython,
    Docker: SiDocker,
    Git: SiGit,
    'Tailwind CSS': SiTailwindcss,
    'Next.js': SiNextdotjs,
    GraphQL: SiGraphql,
    Redis: SiRedis,
  }
  return iconMap[skillName] || null
}

