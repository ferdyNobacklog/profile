import { useState, useEffect } from 'react'

interface PortfolioData {
  personal: {
    fullName: string
    nickname: string
    title: string
    bio: string
    about: string[]
  }
  social: {
    github: string
    linkedin: string
    twitter: string
    email: string
  }
  contact: {
    email: string
    phone: string
    location: string
  }
  skills: {
    categories: Array<{
      category: string
      skills: Array<{
        name: string
        level: number
      }>
    }>
  }
  projects: Array<{
    id: number
    title: string
    description: string
    longDescription: string
    image: string
    tags: string[]
    github: string
    demo: string
    featured: boolean
  }>
  experience: Array<{
    type: 'work' | 'education'
    title: string
    company: string
    location: string
    period: string
    description: string[]
    technologies?: string[]
  }>
  resume: {
    url: string
  }
}

const usePortfolioData = () => {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json')
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data')
        }
        const jsonData = await response.json()
        setData(jsonData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        console.error('Error loading portfolio data:', err)
        // Set loading to false even on error so UI can render
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

export default usePortfolioData
export type { PortfolioData }

