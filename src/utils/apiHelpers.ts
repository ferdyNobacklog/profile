// API helper functions with rate limiting and retry logic

interface RetryOptions {
  maxRetries?: number
  retryDelay?: number
  backoffMultiplier?: number
}

// Simple rate limiter
class RateLimiter {
  private lastRequestTime: number = 0
  private minDelay: number

  constructor(minDelayMs: number = 400) {
    this.minDelay = minDelayMs
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.minDelay) {
      const waitTime = this.minDelay - timeSinceLastRequest
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
    
    this.lastRequestTime = Date.now()
  }
}

// Create rate limiters for different APIs
export const jikanRateLimiter = new RateLimiter(400) // 400ms between requests (2.5 requests/second)
export const mangadexRateLimiter = new RateLimiter(300) // 300ms between requests

// Retry fetch with exponential backoff
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    backoffMultiplier = 2
  } = retryOptions

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options)

      // If rate limited (429), wait and retry
      if (response.status === 429) {
        if (attempt < maxRetries) {
          const waitTime = retryDelay * Math.pow(backoffMultiplier, attempt)
          console.log(`Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`)
          await new Promise(resolve => setTimeout(resolve, waitTime))
          continue
        }
      }

      // If successful or other error, return response
      return response
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      
      // If not the last attempt, wait and retry
      if (attempt < maxRetries) {
        const waitTime = retryDelay * Math.pow(backoffMultiplier, attempt)
        await new Promise(resolve => setTimeout(resolve, waitTime))
        continue
      }
    }
  }

  throw lastError || new Error('Failed to fetch after retries')
}

// Fetch with rate limiting and retry for Jikan API
export async function fetchJikan(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  await jikanRateLimiter.waitIfNeeded()
  return fetchWithRetry(url, options, {
    maxRetries: 3,
    retryDelay: 1000,
    backoffMultiplier: 2
  })
}

// Fetch with rate limiting and retry for MangaDex API
export async function fetchMangaDex(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  await mangadexRateLimiter.waitIfNeeded()
  return fetchWithRetry(url, options, {
    maxRetries: 3,
    retryDelay: 800,
    backoffMultiplier: 1.5
  })
}

