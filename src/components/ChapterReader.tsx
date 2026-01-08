import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { FaTimes, FaChevronLeft, FaChevronRight, FaSpinner, FaList } from 'react-icons/fa'
import { ChapterWithPages, Chapter } from '../types/mangadex'

interface ChapterReaderProps {
  chapter: ChapterWithPages
  mangaTitle: string
  chapters: Chapter[] // List of all chapters
  currentChapterIndex: number // Index of current chapter in chapters array
  initialPage?: number
  onPageChange?: (page: number) => void
  onChapterChange?: (chapterId: string) => void
  onClose: () => void
  onBack: () => void
}

const ChapterReader = ({ 
  chapter, 
  mangaTitle, 
  chapters,
  currentChapterIndex,
  initialPage: _initialPage = 0, 
  onPageChange: _onPageChange, 
  onChapterChange,
  onClose, 
  onBack 
}: ChapterReaderProps) => {
  const [loading, setLoading] = useState(true)
  const [_imagesLoaded, setImagesLoaded] = useState<boolean[]>([])
  const [_allImagesPreloaded, setAllImagesPreloaded] = useState(false)
  const [showChapterList, setShowChapterList] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const hasPreviousChapter = currentChapterIndex > 0 && currentChapterIndex >= 0
  const hasNextChapter = currentChapterIndex >= 0 && currentChapterIndex < chapters.length - 1
  const previousChapter = hasPreviousChapter ? chapters[currentChapterIndex - 1] : null
  const nextChapter = hasNextChapter ? chapters[currentChapterIndex + 1] : null

  // Preload all images when chapter changes
  useEffect(() => {
    setLoading(true)
    setAllImagesPreloaded(false)
    setImagesLoaded(new Array(chapter.pages.length).fill(false))
    
    // Preload all images
    let loadedCount = 0
    const totalImages = chapter.pages.length
    
    if (totalImages === 0) {
      setLoading(false)
      setAllImagesPreloaded(true)
      return
    }
    
    chapter.pages.forEach((pageUrl, index) => {
      const img = new Image()
      img.onload = () => {
        setImagesLoaded(prev => {
          const newState = [...prev]
          newState[index] = true
          return newState
        })
        loadedCount++
        if (loadedCount === totalImages) {
          setAllImagesPreloaded(true)
          setLoading(false)
        }
      }
      img.onerror = () => {
        setImagesLoaded(prev => {
          const newState = [...prev]
          newState[index] = true // Mark as loaded even if error to show placeholder
          return newState
        })
        loadedCount++
        if (loadedCount === totalImages) {
          setAllImagesPreloaded(true)
          setLoading(false)
        }
      }
      img.src = pageUrl
    })
    
    // Scroll to top when chapter changes
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [chapter])

  const goToPreviousChapter = () => {
    if (previousChapter && onChapterChange) {
      onChapterChange(previousChapter.id)
    }
  }

  const goToNextChapter = () => {
    if (nextChapter && onChapterChange) {
      onChapterChange(nextChapter.id)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPreviousChapter) {
        e.preventDefault()
        goToPreviousChapter()
      } else if (e.key === 'ArrowRight' && hasNextChapter) {
        e.preventDefault()
        goToNextChapter()
      } else if (e.key === 'Escape') {
        if (showChapterList) {
          setShowChapterList(false)
        } else {
          onBack()
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [hasPreviousChapter, hasNextChapter, showChapterList, onBack, onChapterChange, previousChapter, nextChapter])

  const handleChapterSelect = (selectedChapter: Chapter) => {
    onChapterChange?.(selectedChapter.id)
    setShowChapterList(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-10 p-4">
          <div className="container-max flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 text-white hover:text-elegant-accent transition-colors"
                aria-label="Back to chapters"
              >
                <FaChevronLeft />
              </button>
              <div>
                <h2 className="text-gradient-elegant font-bold text-xl">{mangaTitle}</h2>
                <p className="text-gradient-elegant-subtle text-sm font-medium">
                  Chapter {chapter.chapter} {chapter.title && `- ${chapter.title}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Chapter List Button */}
              <button
                onClick={() => setShowChapterList(!showChapterList)}
                className="p-2 text-white hover:text-elegant-accent transition-colors"
                aria-label="Chapter list"
                title="Chapter List"
              >
                <FaList className="text-xl" />
              </button>
              <span className="text-white/80 text-sm">
                {chapter.pages.length} pages
              </span>
              <button
                onClick={onClose}
                className="p-2 text-white hover:text-elegant-accent transition-colors"
                aria-label="Close reader"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Previous/Next Chapter Buttons */}
        <button
          onClick={goToPreviousChapter}
          disabled={!hasPreviousChapter}
          className={`fixed left-4 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all ${
            !hasPreviousChapter ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Previous chapter"
          title="Previous Chapter (←)"
        >
          <FaChevronLeft className="text-2xl" />
        </button>

        <button
          onClick={goToNextChapter}
          disabled={!hasNextChapter}
          className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full bg-black/50 text-white hover:bg-black/80 transition-all ${
            !hasNextChapter ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Next chapter"
          title="Next Chapter (→)"
        >
          <FaChevronRight className="text-2xl" />
        </button>

        {/* Chapter List Dropdown */}
        {showChapterList && (
          <div className="fixed top-20 right-4 z-30 bg-black/90 backdrop-blur-sm rounded-lg shadow-2xl max-h-[70vh] overflow-y-auto min-w-[200px] max-w-[300px]">
            <div className="p-4 border-b border-white/20">
              <h3 className="text-gradient-elegant font-bold">Chapters</h3>
            </div>
            <div className="p-2">
              {chapters.map((ch, index) => (
                <button
                  key={ch.id}
                  onClick={() => handleChapterSelect(ch)}
                  className={`w-full text-left px-4 py-2 rounded hover:bg-white/10 transition-colors ${
                    index === currentChapterIndex ? 'bg-elegant-accent/20 text-elegant-accent' : 'text-white/80'
                  }`}
                >
                  <div className="font-semibold">Chapter {ch.chapter}</div>
                  {ch.title && (
                    <div className="text-xs text-white/60 line-clamp-1">{ch.title}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manga Pages Container - Scrollable with all pages */}
        <div ref={scrollContainerRef} className="absolute inset-0 pt-20 pb-24 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-full">
              <FaSpinner className="text-4xl text-white animate-spin mb-4" />
              <p className="text-gradient-elegant-subtle text-sm font-medium">
                Loading {chapter.pages.length} pages...
              </p>
            </div>
          ) : (
            <div className="flex justify-center items-start min-h-full py-8">
              <div className="w-full max-w-4xl space-y-4">
                {/* Show all pages - all preloaded */}
                {chapter.pages.map((pageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-center"
                  >
                    <img
                      src={pageUrl}
                      alt={`Page ${index + 1}`}
                      className="max-w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x1200?text=Image+Failed+to+Load'
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chapter Navigation (Bottom) */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-full">
            <div className="flex items-center gap-4 text-white text-sm">
              <button
                onClick={goToPreviousChapter}
                disabled={!hasPreviousChapter}
                className={`p-2 ${!hasPreviousChapter ? 'opacity-50 cursor-not-allowed' : 'hover:text-elegant-accent'}`}
                title="Previous Chapter"
              >
                <FaChevronLeft />
              </button>
              <span className="px-4 text-gradient-elegant-subtle font-medium">
                Chapter {chapter.chapter} / {chapters.length}
              </span>
              <button
                onClick={goToNextChapter}
                disabled={!hasNextChapter}
                className={`p-2 ${!hasNextChapter ? 'opacity-50 cursor-not-allowed' : 'hover:text-elegant-accent'}`}
                title="Next Chapter"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ChapterReader

