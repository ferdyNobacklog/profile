// MangaDex API Types based on https://api.mangadex.org/docs/swagger.html

// Base response structure
export interface MangaDexResponse<T> {
  result: string
  response: string
  data: T
  limit?: number
  offset?: number
  total?: number
}

// Chapter Attributes
export interface ChapterAttributes {
  volume: string | null
  chapter: string | null
  title: string | null
  translatedLanguage: string
  externalUrl: string | null
  publishAt: string
  readableAt: string
  createdAt: string
  updatedAt: string
  pages: number
  version: number
}

// Chapter Relationship
export interface ChapterRelationship {
  id: string
  type: string
  attributes?: any
}

// MangaDex Chapter
export interface MangaDexChapter {
  id: string
  type: 'chapter'
  attributes: ChapterAttributes
  relationships: ChapterRelationship[]
}

// At-Home Server Response
export interface AtHomeServerResponse {
  result: string
  baseUrl: string
  chapter: {
    hash: string
    data: string[]
    dataSaver: string[]
  }
}

// Manga Attributes
export interface MangaAttributes {
  title: Record<string, string>
  altTitles?: Array<Record<string, string>>
  description?: Record<string, string>
  isLocked: boolean
  links?: Record<string, string>
  originalLanguage: string
  lastVolume: string | null
  lastChapter: string | null
  publicationDemographic: string | null
  status: string
  year: number | null
  contentRating: string
  tags: Array<{
    id: string
    type: string
    attributes: {
      name: Record<string, string>
      group: string
      version: number
    }
  }>
  state: string
  chapterNumbersResetOnNewVolume: boolean
  createdAt: string
  updatedAt: string
  version: number
  availableTranslatedLanguages: string[]
  latestUploadedChapter: string | null
}

// MangaDex Manga
export interface MangaDexManga {
  id: string
  type: 'manga'
  attributes: MangaAttributes
  relationships: ChapterRelationship[]
}

// Feed Response (for chapter lists)
export interface FeedResponse {
  result: string
  response: string
  data: MangaDexChapter[]
  limit: number
  offset: number
  total: number
}

// Our simplified Chapter interface for UI
export interface Chapter {
  id: string
  chapter: string
  title?: string | null
  pages?: string[] // Page URLs - fetched when chapter is opened
  pageCount?: number // Number of pages from attributes.pages
  volume?: string | null
  translatedLanguage?: string
  publishAt?: string
  readableAt?: string
}

// Chapter interface for ChapterReader (pages required, title without null)
export interface ChapterWithPages extends Omit<Chapter, 'title' | 'pages'> {
  title?: string
  pages: string[] // Required when chapter is opened
}

// Helper function to convert MangaDex Chapter to our Chapter
export function mapMangaDexChapterToChapter(mangaDexChapter: MangaDexChapter): Chapter {
  return {
    id: mangaDexChapter.id,
    chapter: mangaDexChapter.attributes.chapter || '0',
    title: mangaDexChapter.attributes.title,
    pageCount: mangaDexChapter.attributes.pages,
    volume: mangaDexChapter.attributes.volume,
    translatedLanguage: mangaDexChapter.attributes.translatedLanguage,
    publishAt: mangaDexChapter.attributes.publishAt,
    readableAt: mangaDexChapter.attributes.readableAt,
  }
}

// Helper function to build page URLs from AtHomeServerResponse
export function buildPageUrls(response: AtHomeServerResponse): string[] {
  const { baseUrl, chapter } = response
  return chapter.data.map((page: string) => `${baseUrl}/data/${chapter.hash}/${page}`)
}

