// API configuration utility
export const getApiBaseUrl = (): string => {
  // In production (Render.com), use the backend service URL
  if (import.meta.env.PROD) {
    return 'https://tokyo-weekender-seo-dashboard-backend.onrender.com'
  }
  
  // In development, use localhost
  return 'http://localhost:8000'
}

export const apiRequest = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const baseUrl = getApiBaseUrl()
  const url = `${baseUrl}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    
    // If backend is not available, return mock data for development
    if (!response.ok && import.meta.env.PROD) {
      console.warn(`API request failed: ${url}. Backend may not be deployed yet.`)
      throw new Error('Backend service is not available')
    }
    
    return response
  } catch (error) {
    console.error('API request error:', error)
    throw error
  }
}
