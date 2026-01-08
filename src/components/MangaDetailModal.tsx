import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaTimes, FaSpinner, FaBook, FaStar } from 'react-icons/fa'
import { theme } from '../theme/theme'
import ChapterReader from './ChapterReader'

interface MangaDetail {
  mal_id: number
  title: string
  title_english?: string
  title_japanese?: string
  images: {
    jpg: {
      image_url: string
      large_image_url: string
    }
  }
  synopsis?: string
  score?: number
  chapters?: number
  volumes?: number
  status?: string
  type?: string
  published?: {
    from?: string
    to?: string
  }
  authors?: Array<{ name: string }>
  genres?: Array<{ name: string }>
}

interface Chapter {
  id: string
  chapter: string
  title?: string
  pages: string[]
}

interface MangaDetailModalProps {
  isOpen: boolean
  onClose: () => void
  mangaId: number
  mangaTitle: string
}

const MangaDetailModal = ({ isOpen, onClose, mangaId, mangaTitle }: MangaDetailModalProps) => {
  const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingChapters, setLoadingChapters] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)

  useEffect(() => {
    if (isOpen && mangaId) {
      fetchMangaDetail()
      fetchChapters()
    }
  }, [isOpen, mangaId])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setSelectedChapter(null)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (selectedChapter) {
          setSelectedChapter(null)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, selectedChapter, onClose])

  const fetchMangaDetail = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.jikan.moe/v4/manga/${mangaId}/full`)
      if (!response.ok) {
        throw new Error('Failed to fetch manga details')
      }
      const data = await response.json()
      setMangaDetail(data.data)
    } catch (err) {
      setError('Failed to load manga details')
      console.error('Error fetching manga detail:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchChapters = async () => {
    setLoadingChapters(true)
    try {
      // Search MangaDex for the manga
      const searchResponse = await fetch(
        `https://api.mangadex.org/manga?title=${encodeURIComponent(mangaTitle)}&limit=5`
      )
      if (!searchResponse.ok) {
        throw new Error('Failed to search MangaDex')
      }
      const searchData = await searchResponse.json()
      
      if (searchData.data && searchData.data.length > 0) {
        const mangaDexId = searchData.data[0].id
        
        // Get chapters for this manga
        const chaptersResponse = await fetch(
          `https://api.mangadex.org/manga/${mangaDexId}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=100`
        )
        if (!chaptersResponse.ok) {
          throw new Error('Failed to fetch chapters')
        }
        const chaptersData = await chaptersResponse.json()
        
        // Fetch chapter pages for each chapter
        const chaptersWithPages: Chapter[] = []
        for (const chapter of chaptersData.data.slice(0, 20)) { // Limit to first 20 chapters
          try {
            const chapterId = chapter.id
            const pagesResponse = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`)
            if (pagesResponse.ok) {
              const pagesData = await pagesResponse.json()
              const baseUrl = pagesData.baseUrl
              const chapterHash = pagesData.chapter.hash
              const pages = pagesData.chapter.data.map((page: string) => 
                `${baseUrl}/data/${chapterHash}/${page}`
              )
              
              chaptersWithPages.push({
                id: chapterId,
                chapter: chapter.attributes.chapter || '0',
                title: chapter.attributes.title,
                pages
              })
            }
          } catch (err) {
            console.error('Error fetching chapter pages:', err)
          }
        }
        
        setChapters(chaptersWithPages.sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter)))
      }
    } catch (err) {
      console.error('Error fetching chapters:', err)
    } finally {
      setLoadingChapters(false)
    }
  }

  if (selectedChapter) {
    // Find current chapter index
    const currentChapterIndex = chapters.findIndex(ch => ch.id === selectedChapter.id)
    
    return (
      <ChapterReader
        chapter={selectedChapter}
        mangaTitle={mangaTitle}
        chapters={chapters}
        currentChapterIndex={currentChapterIndex >= 0 ? currentChapterIndex : 0}
        onClose={() => setSelectedChapter(null)}
        onBack={() => setSelectedChapter(null)}
      />
    )
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-elegant-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden my-8">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-elegant-accent/30 sticky top-0 bg-elegant-white z-10">
                <h3 className="text-2xl font-bold text-elegant-dark-charcoal font-display">
                  {mangaDetail?.title_english || mangaDetail?.title || mangaTitle}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 text-elegant-charcoal hover:text-elegant-accent hover:bg-elegant-accent/10 rounded-lg transition-all"
                  aria-label="Close modal"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              
              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <FaSpinner className="text-4xl text-elegant-accent animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-elegant-charcoal">{error}</div>
                ) : mangaDetail ? (
                  <div className="space-y-6">
                    {/* Manga Info */}
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={mangaDetail.images.jpg.large_image_url}
                          alt={mangaDetail.title}
                          className="w-48 h-72 object-cover rounded-lg shadow-elegant"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x300?text=No+Image'
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-elegant-dark-charcoal font-display mb-2">
                          {mangaDetail.title_english || mangaDetail.title}
                        </h2>
                        {mangaDetail.title_japanese && (
                          <p className="text-elegant-charcoal mb-4">{mangaDetail.title_japanese}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 mb-4">
                          {mangaDetail.score && (
                            <div className="flex items-center gap-2 text-elegant-accent">
                              <FaStar />
                              <span className="font-semibold">{mangaDetail.score}</span>
                            </div>
                          )}
                          {mangaDetail.chapters && (
                            <div className="flex items-center gap-2 text-elegant-charcoal">
                              <FaBook />
                              <span>{mangaDetail.chapters} Chapters</span>
                            </div>
                          )}
                          {mangaDetail.status && (
                            <div className="flex items-center gap-2 text-elegant-charcoal">
                              <span className="bg-elegant-light-gray px-3 py-1 rounded-full text-sm">
                                {mangaDetail.status}
                              </span>
                            </div>
                          )}
                        </div>

                        {mangaDetail.authors && mangaDetail.authors.length > 0 && (
                          <p className="text-elegant-charcoal mb-2">
                            <span className="font-semibold">Author:</span> {mangaDetail.authors.map(a => a.name).join(', ')}
                          </p>
                        )}

                        {mangaDetail.genres && mangaDetail.genres.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {mangaDetail.genres.map((genre, idx) => (
                              <span
                                key={idx}
                                className="bg-elegant-accent/10 text-elegant-accent px-3 py-1 rounded-full text-sm"
                              >
                                {genre.name}
                              </span>
                            ))}
                          </div>
                        )}

                        {mangaDetail.synopsis && (
                          <div className="mt-4">
                            <h3 className="font-bold text-elegant-dark-charcoal mb-2">Synopsis</h3>
                            <p className="text-elegant-charcoal text-sm leading-relaxed line-clamp-6">
                              {mangaDetail.synopsis}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Chapters List */}
                    <div className="border-t border-elegant-accent/30 pt-6">
                      <h3 className="text-xl font-bold text-elegant-dark-charcoal font-display mb-4">
                        Chapters
                      </h3>
                      {loadingChapters ? (
                        <div className="flex justify-center py-8">
                          <FaSpinner className="text-2xl text-elegant-accent animate-spin" />
                        </div>
                      ) : chapters.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {chapters.map((chapter) => (
                            <button
                              key={chapter.id}
                              onClick={() => setSelectedChapter(chapter)}
                              className={`${theme.card} p-4 text-left hover:scale-105 transition-all duration-300 group`}
                            >
                              <div className="font-semibold text-elegant-dark-charcoal group-hover:text-elegant-accent transition-colors">
                                Chapter {chapter.chapter}
                              </div>
                              {chapter.title && (
                                <div className="text-xs text-elegant-charcoal mt-1 line-clamp-2">
                                  {chapter.title}
                                </div>
                              )}
                              <div className="text-xs text-elegant-charcoal mt-2">
                                {chapter.pages.length} pages
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-elegant-charcoal text-center py-8">
                          No chapters available
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MangaDetailModal

