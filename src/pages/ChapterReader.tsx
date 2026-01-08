import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { FaSpinner } from 'react-icons/fa'
import ChapterReaderComponent from '../components/ChapterReader'
import { ChapterWithPages, Chapter, MangaDexResponse, MangaDexChapter, AtHomeServerResponse, buildPageUrls, FeedResponse, mapMangaDexChapterToChapter } from '../types/mangadex'
import { fetchJikan, fetchMangaDex } from '../utils/apiHelpers'

const ChapterReaderPage = () => {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [chapter, setChapter] = useState<ChapterWithPages | null>(location.state?.chapter || null)
  const [chapters, setChapters] = useState<Chapter[]>(location.state?.chapters || [])
  const mangaTitle = location.state?.mangaTitle || 'Manga'
  const [loading, setLoading] = useState(!location.state?.chapter)
  
  // Refs to prevent duplicate fetches on reload
  const fetchedChapterRef = useRef<string | null>(null)
  const fetchedChaptersRef = useRef<string | null>(null)
  const isInitialMount = useRef(true)

  // Find current chapter index - memoized
  const currentChapterIndex = useMemo(() => {
    return chapters.findIndex(ch => ch.id === chapterId)
  }, [chapters, chapterId])

  // Memoized fetchChapter function
  const fetchChapter = useCallback(async () => {
    if (!chapterId || !id) return
    
    // Prevent duplicate fetch if already fetched this chapter
    if (fetchedChapterRef.current === chapterId) {
      return
    }

    setLoading(true)
    fetchedChapterRef.current = chapterId
    
    try {
      // First get chapter info using proper MangaDex API types with rate limiting
      const chapterInfoResponse = await fetchMangaDex(`https://api.mangadex.org/chapter/${chapterId}`)
      if (!chapterInfoResponse.ok) {
        throw new Error('Failed to fetch chapter info')
      }

      const chapterInfo: MangaDexResponse<MangaDexChapter> = await chapterInfoResponse.json()
      const chapterData = chapterInfo.data
      const chapterNum = chapterData.attributes.chapter || '0'
      const chapterTitle = chapterData.attributes.title || ''

      // Fetch chapter pages from MangaDex at-home server with rate limiting
      const pagesResponse = await fetchMangaDex(`https://api.mangadex.org/at-home/server/${chapterId}`)
      if (!pagesResponse.ok) {
        throw new Error('Failed to fetch chapter pages')
      }

      const pagesData: AtHomeServerResponse = await pagesResponse.json()
      const pages = buildPageUrls(pagesData)

      setChapter({
        id: chapterId,
        chapter: chapterNum,
        title: chapterTitle || undefined,
        pages
      })
    } catch (err) {
      console.error('Error fetching chapter:', err)
      fetchedChapterRef.current = null
      navigate(`/manga/${id}`)
    } finally {
      setLoading(false)
    }
  }, [chapterId, id, navigate])

  // Memoized fetchChapters function
  const fetchChapters = useCallback(async (): Promise<Chapter[]> => {
    if (!id) return []

    // Prevent duplicate fetch if already fetched for this manga
    if (fetchedChaptersRef.current === id) {
      // Return current chapters from state if available
      return chapters.length > 0 ? chapters : []
    }

    fetchedChaptersRef.current = id

    try {
      // Get manga title from Jikan API with rate limiting and retry
      const detailResponse = await fetchJikan(`https://api.jikan.moe/v4/manga/${id}`)
      if (!detailResponse.ok) {
        console.error('Failed to fetch manga details:', detailResponse.status)
        return []
      }

      const detailData = await detailResponse.json()
      const mangaTitleFromApi = detailData.data.title_english || detailData.data.title

      // Search MangaDex for the manga with rate limiting
      const searchResponse = await fetchMangaDex(
        `https://api.mangadex.org/manga?title=${encodeURIComponent(mangaTitleFromApi)}&limit=5`
      )
      if (!searchResponse.ok) {
        console.error('Failed to search MangaDex:', searchResponse.status)
        return []
      }

      const searchData = await searchResponse.json()
      if (searchData.data && searchData.data.length > 0) {
        const mangaDexId = searchData.data[0].id

        // Get chapters for this manga with rate limiting
        const chaptersResponse = await fetchMangaDex(
          `https://api.mangadex.org/manga/${mangaDexId}/feed?translatedLanguage[]=en&order[chapter]=asc&limit=100`
        )
        if (!chaptersResponse.ok) {
          console.error('Failed to fetch chapters:', chaptersResponse.status)
          return []
        }

        const chaptersData: FeedResponse = await chaptersResponse.json()
        const chaptersList: Chapter[] = chaptersData.data
          .slice(0, 100)
          .map(mapMangaDexChapterToChapter)

        const sortedChapters = chaptersList.sort((a, b) => parseFloat(a.chapter) - parseFloat(b.chapter))
        setChapters(sortedChapters)
        return sortedChapters
      }
    } catch (err) {
      console.error('Error fetching chapters:', err)
      fetchedChaptersRef.current = null
    }
    return []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Handle chapter change - memoized
  const handleChapterChange = useCallback(async (newChapterId: string) => {
    if (!id) return

    // If chapters list is empty, fetch it first
    let chaptersToUse = chapters
    if (chapters.length === 0) {
      chaptersToUse = await fetchChapters()
    }

    navigate(`/manga/${id}/chapter/${newChapterId}`, {
      state: {
        mangaTitle,
        chapters: chaptersToUse.length > 0 ? chaptersToUse : chapters
      }
    })
  }, [id, chapters, mangaTitle, navigate, fetchChapters])

  // Memoized navigation handlers
  const handleClose = useCallback(() => {
    navigate(`/manga/${id}`)
  }, [id, navigate])

  const handleBack = useCallback(() => {
    navigate(`/manga/${id}`)
  }, [id, navigate])

  // Initial mount check - fetch chapters if needed
  useEffect(() => {
    if (!id) {
      navigate('/manga')
      return
    }

    if (isInitialMount.current) {
      isInitialMount.current = false
      // Only fetch chapters if we don't have them from location.state
      if (chapters.length === 0) {
        fetchChapters()
      }
    }
  }, [id, navigate, chapters.length, fetchChapters])

  // Fetch chapter when chapterId changes (but not on initial mount if we have it from state)
  useEffect(() => {
    if (!chapterId || !id) return

    // Only fetch if we don't have the chapter or it's a different chapter
    if (!chapter || chapter.id !== chapterId) {
      fetchChapter()
    }
  }, [chapterId, id, chapter, fetchChapter])

  if (!id || !chapterId) {
    return null
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <FaSpinner className="text-4xl text-white animate-spin" />
      </div>
    )
  }

  if (!chapter) {
    navigate(`/manga/${id}`)
    return null
  }

  return (
    <ChapterReaderComponent
      chapter={chapter}
      mangaTitle={mangaTitle}
      chapters={chapters}
      currentChapterIndex={currentChapterIndex >= 0 ? currentChapterIndex : 0}
      onChapterChange={handleChapterChange}
      onClose={handleClose}
      onBack={handleBack}
    />
  )
}

export default ChapterReaderPage

