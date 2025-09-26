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
    case '/api/keywords/search':
      return [
        {
          Keyword: 'tokyo weekender',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 1400,
          'Current position': 1,
          'Organic traffic': 1241,
          KD: 2,
          'Current URL': 'https://www.tokyoweekender.com/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: true,
          Branded: true,
          Local: true
        },
        {
          Keyword: 'tokyo events',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 850,
          'Current position': 3,
          'Organic traffic': 680,
          KD: 15,
          'Current URL': 'https://www.tokyoweekender.com/events',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo restaurants',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 720,
          'Current position': 5,
          'Organic traffic': 540,
          KD: 25,
          'Current URL': 'https://www.tokyoweekender.com/restaurants',
          Informational: true,
          Commercial: true,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo nightlife',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 650,
          'Current position': 15,
          'Organic traffic': 195,
          KD: 20,
          'Current URL': 'https://www.tokyoweekender.com/nightlife',
          Informational: true,
          Commercial: true,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo shopping',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 580,
          'Current position': 18,
          'Organic traffic': 174,
          KD: 22,
          'Current URL': 'https://www.tokyoweekender.com/shopping',
          Informational: true,
          Commercial: true,
          Transactional: true,
          Navigational: false,
          Branded: false,
          Local: true
        }
      ]
    default:
      return {}
  }
}

export const apiRequest = async (endpoint: string, _options?: RequestInit): Promise<Response> => {
  // Always use mock data for now (both dev and prod)
  console.log(`Using mock data for ${endpoint}`)
  const mockData = getMockData(endpoint)
  
  // Simulate network delay for realistic behavior
  await new Promise(resolve => setTimeout(resolve, 100))
  
  return new Response(JSON.stringify(mockData), {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
