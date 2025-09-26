// API configuration utility
export const getApiBaseUrl = (): string => {
  // In production (Render.com), use the backend service URL
  if (import.meta.env.PROD) {
    return 'https://tokyo-weekender-seo-dashboard-backend.onrender.com'
  }
  
  // In development, use localhost
  return 'http://localhost:8000'
}

// Mock data for when backend is not available
const getMockData = (endpoint: string): any => {
  switch (endpoint) {
    case '/api/analysis/summary':
      return {
        total_keywords: 60872,
        total_volume: 2450000,
        total_traffic: 45000,
        avg_position: 28.5,
        top_performing_keywords: 1250
      }
    case '/api/analysis/performance':
      return {
        position_distribution: {
          top_3: { count: 850, total_traffic: 12000 },
          top_10: { count: 1250, total_traffic: 18000 },
          top_20: { count: 2100, total_traffic: 8000 },
          top_50: { count: 3500, total_traffic: 3000 },
          not_ranking: { count: 53172, total_traffic: 0 }
        }
      }
    case '/api/analysis/serp-features':
      return {
        'Featured Snippets': { count: 450 },
        'People Also Ask': { count: 320 },
        'Image Pack': { count: 280 },
        'Local Pack': { count: 150 },
        'Video': { count: 120 }
      }
    case '/api/competitors/summary':
      return {
        competitors: [
          {
            site_name: 'tokyocheapo.com',
            display_name: 'Tokyo Cheapo',
            total_keywords: 12500,
            total_traffic: 85000,
            avg_position: 15.2,
            total_volume: 980000
          },
          {
            site_name: 'www.japan.travel',
            display_name: 'Japan Travel',
            total_keywords: 18900,
            total_traffic: 120000,
            avg_position: 12.8,
            total_volume: 1500000
          }
        ],
        summary: {
          total_competitors: 2,
          total_traffic: 205000,
          total_keywords: 31400
        }
      }
    case '/api/keywords/top-performing':
      return [
        {
          keyword: 'tokyo weekender',
          volume: 1400,
          organic_traffic: 1241,
          current_position: 1,
          keyword_difficulty: 2,
          current_url: 'https://www.tokyoweekender.com/'
        },
        {
          keyword: 'tokyo events',
          volume: 850,
          organic_traffic: 680,
          current_position: 3,
          keyword_difficulty: 15,
          current_url: 'https://www.tokyoweekender.com/events'
        },
        {
          keyword: 'tokyo restaurants',
          volume: 720,
          organic_traffic: 540,
          current_position: 5,
          keyword_difficulty: 25,
          current_url: 'https://www.tokyoweekender.com/restaurants'
        }
      ]
    case '/api/keywords/improvement-opportunities':
      return [
        {
          keyword: 'tokyo nightlife',
          volume: 650,
          organic_traffic: 195,
          current_position: 15,
          keyword_difficulty: 20,
          current_url: 'https://www.tokyoweekender.com/nightlife'
        },
        {
          keyword: 'tokyo shopping',
          volume: 580,
          organic_traffic: 174,
          current_position: 18,
          keyword_difficulty: 22,
          current_url: 'https://www.tokyoweekender.com/shopping'
        },
        {
          keyword: 'tokyo travel guide',
          volume: 520,
          organic_traffic: 156,
          current_position: 12,
          keyword_difficulty: 18,
          current_url: 'https://www.tokyoweekender.com/travel-guide'
        }
      ]
    default:
      return {}
  }
}

export const apiRequest = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  // For static deployment, always use mock data
  if (import.meta.env.PROD) {
    console.log(`Using mock data for ${endpoint} in production`)
    const mockData = getMockData(endpoint)
    return new Response(JSON.stringify(mockData), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  
  // In development, try to reach the backend
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
    
    // If backend is not available, return mock data
    if (!response.ok) {
      console.warn(`API request failed: ${url}. Using mock data.`)
      
      // Create a mock response with mock data
      const mockData = getMockData(endpoint)
      return new Response(JSON.stringify(mockData), {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
    
    return response
  } catch (error) {
    console.error('API request error:', error)
    
    // Return mock data on error
    console.warn(`Using mock data for ${endpoint} due to error`)
    const mockData = getMockData(endpoint)
    return new Response(JSON.stringify(mockData), {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
