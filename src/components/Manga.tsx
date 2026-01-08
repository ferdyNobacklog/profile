import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaBook, FaSpinner } from 'react-icons/fa'
import { theme } from '../theme/theme'
import { fetchJikan } from '../utils/apiHelpers'

interface MangaItem {
  mal_id: number
  title: string
  title_english?: string
  images: {
    jpg: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
    webp: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  synopsis?: string
  score?: number
  chapters?: number
  volumes?: number
  status?: string
  type?: string
}

const Manga = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [mangaList, setMangaList] = useState<MangaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  // Ref to track if initial fetch has been done
  const hasInitialFetch = useRef(false)

  // Memoized fetchManga function
  const fetchManga = useCallback(async (query: string = '', pageNum: number = 1) => {
    setLoading(true)
    setError(null)
    try {
      // Add delay to respect rate limits (3 requests per second)
      if (pageNum > 1) {
        await new Promise(resolve => setTimeout(resolve, 400))
      }

      let url = 'https://api.jikan.moe/v4/manga'
      
      if (query.trim()) {
        url = `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&page=${pageNum}&limit=20`
      } else {
        url = `https://api.jikan.moe/v4/top/manga?page=${pageNum}&limit=20`
      }

      const response = await fetchJikan(url)
      if (!response.ok) {
        throw new Error('Failed to fetch manga')
      }
      
      const data = await response.json()
      const newManga = data.data || []
      
      if (pageNum === 1) {
        setMangaList(newManga)
      } else {
        setMangaList(prev => [...prev, ...newManga])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load manga. Please try again later.'
      setError(errorMessage)
      console.error('Error fetching manga:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Memoized handleSearch function
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchManga(searchQuery, 1)
  }, [searchQuery, fetchManga])

  // Memoized handleLoadMore function
  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchManga(searchQuery, nextPage)
  }, [page, searchQuery, fetchManga])

  // Memoized handleMangaClick function
  const handleMangaClick = useCallback((mangaId: number) => {
    navigate(`/manga/${mangaId}`)
  }, [navigate])

  // Initial fetch on mount
  useEffect(() => {
    if (!hasInitialFetch.current) {
      hasInitialFetch.current = true
      fetchManga('', 1)
    }
  }, [fetchManga])

  return (
    <section ref={ref} className="min-h-screen section-padding bg-elegant-white pt-24">
      <div className="container-max">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-elegant-dark-charcoal font-display">
            Manga <span className="text-elegant-accent">Library</span>
          </h2>
          <div className="w-24 h-1 bg-elegant-accent mx-auto mb-6" />
          <p className="text-elegant-charcoal text-base md:text-lg max-w-2xl mx-auto">
            Discover and explore thousands of manga titles
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-elegant-charcoal" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for manga..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-elegant-accent/30 focus:outline-none focus:border-elegant-accent bg-elegant-off-white text-elegant-dark-charcoal"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium ${theme.button.primary} flex items-center gap-2`}
              >
                {loading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
                Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && mangaList.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="text-4xl text-elegant-accent animate-spin" />
          </div>
        )}

        {/* Manga Grid */}
        {mangaList.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
              {mangaList.map((manga, index) => (
                <motion.div
                  key={manga.mal_id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  onClick={() => handleMangaClick(manga.mal_id)}
                  className={`${theme.card} p-4 hover:scale-105 transition-all duration-300 cursor-pointer group`}
                >
                  <div className="relative mb-3 overflow-hidden rounded-lg">
                    <img
                      src={manga.images.webp.image_url || manga.images.jpg.image_url}
                      alt={manga.title}
                      className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=No+Image'
                      }}
                    />
                    {manga.score && (
                      <div className="absolute top-2 right-2 bg-elegant-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                        {manga.score.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-elegant-dark-charcoal text-sm mb-1 line-clamp-2 group-hover:text-elegant-accent transition-colors">
                    {manga.title_english || manga.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-elegant-charcoal">
                    {manga.type && (
                      <span className="bg-elegant-light-gray px-2 py-1 rounded">
                        {manga.type}
                      </span>
                    )}
                    {manga.chapters && (
                      <span className="flex items-center gap-1">
                        <FaBook className="text-xs" />
                        {manga.chapters}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Load More Button */}
            {!loading && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  className={`px-8 py-3 rounded-lg font-medium ${theme.button.primary}`}
                >
                  Load More
                </button>
              </div>
            )}

            {loading && (
              <div className="text-center py-4">
                <FaSpinner className="text-2xl text-elegant-accent animate-spin mx-auto" />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && mangaList.length === 0 && !error && (
          <div className="text-center py-20">
            <FaBook className="text-6xl text-elegant-charcoal/30 mx-auto mb-4" />
            <p className="text-elegant-charcoal text-lg">No manga found. Try a different search.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Manga

