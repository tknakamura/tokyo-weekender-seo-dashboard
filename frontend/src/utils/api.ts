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
  // Remove query parameters for matching
  const cleanEndpoint = endpoint.split('?')[0]
  
  switch (cleanEndpoint) {
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
          },
          {
            site_name: 'www.timeout.com/tokyo',
            display_name: 'Time Out Tokyo',
            total_keywords: 15200,
            total_traffic: 95000,
            avg_position: 18.5,
            total_volume: 1200000
          },
          {
            site_name: 'www.lonelyplanet.com/japan/tokyo',
            display_name: 'Lonely Planet Tokyo',
            total_keywords: 22100,
            total_traffic: 135000,
            avg_position: 14.3,
            total_volume: 1800000
          }
        ],
        summary: {
          total_competitors: 4,
          total_traffic: 435000,
          total_keywords: 68700
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
    case '/api/competitors/tokyocheapo.com/comparison':
    case '/api/competitors/www.japan.travel/comparison':
    case '/api/competitors/www.timeout.com/tokyo/comparison':
    case '/api/competitors/www.lonelyplanet.com/japan/tokyo/comparison':
      return [
        {
          keyword: 'tokyo restaurants',
          volume: 720,
          competitor_position: 3,
          competitor_traffic: 450,
          competitor_url: 'https://tokyocheapo.com/restaurants/',
          keyword_difficulty: 25,
          cpc: 1.2,
          serp_features: 'Local Pack',
          informational: false,
          commercial: true,
          transactional: false,
          navigational: false,
          branded: false,
          local: true,
          tokyo_weekender_position: 5,
          tokyo_weekender_traffic: 540,
          tokyo_weekender_url: 'https://www.tokyoweekender.com/restaurants',
          opportunity_score: 85
        },
        {
          keyword: 'tokyo events',
          volume: 850,
          competitor_position: 2,
          competitor_traffic: 680,
          competitor_url: 'https://tokyocheapo.com/events/',
          keyword_difficulty: 15,
          cpc: 0.8,
          serp_features: 'Featured Snippets',
          informational: true,
          commercial: false,
          transactional: false,
          navigational: false,
          branded: false,
          local: true,
          tokyo_weekender_position: 3,
          tokyo_weekender_traffic: 680,
          tokyo_weekender_url: 'https://www.tokyoweekender.com/events',
          opportunity_score: 75
        },
        {
          keyword: 'tokyo nightlife',
          volume: 650,
          competitor_position: 1,
          competitor_traffic: 520,
          competitor_url: 'https://tokyocheapo.com/nightlife/',
          keyword_difficulty: 20,
          cpc: 1.5,
          serp_features: 'Image Pack',
          informational: false,
          commercial: true,
          transactional: false,
          navigational: false,
          branded: false,
          local: true,
          tokyo_weekender_position: 15,
          tokyo_weekender_traffic: 195,
          tokyo_weekender_url: 'https://www.tokyoweekender.com/nightlife',
          opportunity_score: 95
        },
        {
          keyword: 'tokyo shopping',
          volume: 580,
          competitor_position: 4,
          competitor_traffic: 290,
          competitor_url: 'https://tokyocheapo.com/shopping/',
          keyword_difficulty: 18,
          cpc: 1.0,
          serp_features: 'Local Pack',
          informational: false,
          commercial: true,
          transactional: true,
          navigational: false,
          branded: false,
          local: true,
          tokyo_weekender_position: 18,
          tokyo_weekender_traffic: 174,
          tokyo_weekender_url: 'https://www.tokyoweekender.com/shopping',
          opportunity_score: 90
        },
        {
          keyword: 'tokyo travel guide',
          volume: 420,
          competitor_position: 2,
          competitor_traffic: 336,
          competitor_url: 'https://tokyocheapo.com/travel-guide/',
          keyword_difficulty: 12,
          cpc: 0.6,
          serp_features: 'Featured Snippets',
          informational: true,
          commercial: false,
          transactional: false,
          navigational: false,
          branded: false,
          local: true,
          tokyo_weekender_position: 8,
          tokyo_weekender_traffic: 252,
          tokyo_weekender_url: 'https://www.tokyoweekender.com/guide',
          opportunity_score: 70
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
  console.log(`Mock data for ${endpoint}:`, mockData)
  
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
