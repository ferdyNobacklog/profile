import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaSpinner, FaBook, FaStar, FaArrowLeft } from 'react-icons/fa'
import { theme } from '../theme/theme'
import { Chapter, FeedResponse, mapMangaDexChapterToChapter } from '../types/mangadex'
import { fetchJikan, fetchMangaDex } from '../utils/apiHelpers'

// Jikan API types (MyAnimeList)
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

interface MangaDetailProps {
  mangaId: number
}

const MangaDetail = ({ mangaId }: MangaDetailProps) => {
  const navigate = useNavigate()
  const [mangaDetail, setMangaDetail] = useState<MangaDetail | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingChapters, setLoadingChapters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Refs to prevent duplicate fetches on reload
  const fetchedMangaDetailRef = useRef<number | null>(null)
  const fetchedChaptersRef = useRef<number | null>(null)

  // Memoized fetchMangaDetail function
  const fetchMangaDetail = useCallback(async () => {
    // Prevent duplicate fetch if already fetched for this manga
    if (fetchedMangaDetailRef.current === mangaId) {
      return
    }

    setLoading(true)
    setError(null)
    fetchedMangaDetailRef.current = mangaId

    try {
      const response = await fetchJikan(`https://api.jikan.moe/v4/manga/${mangaId}/full`)
      if (!response.ok) {
        throw new Error('Failed to fetch manga details')
      }
      const data = await response.json()
      setMangaDetail(data.data)
    } catch (err) {
      setError('Failed to load manga details')
      console.error('Error fetching manga detail:', err)
      fetchedMangaDetailRef.current = null
    } finally {
      setLoading(false)
    }
  }, [mangaId])

  // Memoized fetchChapters function
  const fetchChapters = useCallback(async () => {
    // Prevent duplicate fetch if already fetched for this manga
    if (fetchedChaptersRef.current === mangaId) {
      return
    }

    setLoadingChapters(true)
    fetchedChaptersRef.current = mangaId

    try {
      // Get manga title from detail first with rate limiting
      const detailResponse = await fetchJikan(`https://api.jikan.moe/v4/manga/${mangaId}`)
      if (!detailResponse.ok) return
      
      const detailData = await detailResponse.json()
      const mangaTitle = detailData.data.title_english || detailData.data.title

      // Search MangaDex for the manga with rate limiting
      const searchResponse = await fetchMangaDex(
        `https://api.mangadex.org/manga?title=${encodeURIComponent(mangaTitle)}&limit=5`
      )
      if (!searchResponse.ok) {
        throw new Error('Failed to search MangaDex')
      }
      const searchData = await searchResponse.json()
      
      if (searchData.data && searchData.data.length > 0) {
        const mangaDexId = searchData.data[0].id
        
        // Get chapters for this manga with rate limiting
        const chaptersResponse = await fetchMangaDex(
          `https://api.mangadex.org/manga/${mangaDexId}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=100`
        )
        if (!chaptersResponse.ok) {
          throw new Error('Failed to fetch chapters')
        }
        const chaptersData: FeedResponse = await chaptersResponse.json()
        
        // Just list chapters without fetching pages (pages will be fetched when chapter is opened)
        // Use proper MangaDex API types
        const chaptersList: Chapter[] = chaptersData.data
          .slice(0, 100)
          .map(mapMangaDexChapterToChapter)
        
        setChapters(chaptersList.sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter)))
      }
    } catch (err) {
      console.error('Error fetching chapters:', err)
      fetchedChaptersRef.current = null
    } finally {
      setLoadingChapters(false)
    }
  }, [mangaId])

  // Memoized handleChapterClick function
  const handleChapterClick = useCallback((chapter: Chapter) => {
    // Navigate to chapter with chapters list in state
    navigate(`/manga/${mangaId}/chapter/${chapter.id}`, {
      state: {
        mangaTitle: mangaDetail?.title_english || mangaDetail?.title || 'Manga',
        chapters: chapters
      }
    })
  }, [mangaId, mangaDetail, chapters, navigate])

  // Memoized handleBack function
  const handleBack = useCallback(() => {
    navigate('/manga')
  }, [navigate])

  // Fetch data when mangaId changes
  useEffect(() => {
    // Only fetch if we don't have the data or it's a different manga
    if (fetchedMangaDetailRef.current !== mangaId) {
      fetchMangaDetail()
    }
    if (fetchedChaptersRef.current !== mangaId) {
      fetchChapters()
    }
  }, [mangaId, fetchMangaDetail, fetchChapters])

  return (
    <section className="min-h-screen section-padding bg-elegant-white pt-24">
      <div className="container-max">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-elegant-charcoal hover:text-elegant-accent transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Manga Library</span>
        </button>

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
                <h1 className="text-3xl font-bold text-elegant-dark-charcoal font-display mb-2">
                  {mangaDetail.title_english || mangaDetail.title}
                </h1>
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
                    <p className="text-elegant-charcoal text-sm leading-relaxed">
                      {mangaDetail.synopsis}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chapters List */}
            <div className="border-t border-elegant-accent/30 pt-6">
              <h2 className="text-2xl font-bold text-elegant-dark-charcoal font-display mb-4">
                Chapters
              </h2>
              {loadingChapters ? (
                <div className="flex justify-center py-8">
                  <FaSpinner className="text-2xl text-elegant-accent animate-spin" />
                </div>
              ) : chapters.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterClick(chapter)}
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
                      {chapter.pageCount && (
                        <div className="text-xs text-elegant-charcoal mt-2">
                          {chapter.pageCount} pages
                        </div>
                      )}
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
    </section>
  )
}

export default MangaDetail

