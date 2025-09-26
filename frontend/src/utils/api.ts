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
          Keyword: 'tokyo cheapo',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 5400,
          'Current position': 1,
          'Organic traffic': 5322,
          KD: 2,
          'Current URL': 'https://tokyocheapo.com/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: true,
          Branded: true,
          Local: true
        },
        {
          Keyword: 'shimokitazawa',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 14000,
          'Current position': 1,
          'Organic traffic': 2481,
          KD: 5,
          'Current URL': 'https://tokyocheapo.com/locations/west-tokyo/shimokitazawa-2/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'best esim for japan',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 5100,
          'Current position': 1,
          'Organic traffic': 1839,
          KD: 8,
          'Current URL': 'https://tokyocheapo.com/business/internet/esim-japan-travel/',
          Informational: true,
          Commercial: true,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: false
        },
        {
          Keyword: 'shibuya',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 69000,
          'Current position': 5,
          'Organic traffic': 1800,
          KD: 15,
          'Current URL': 'https://tokyocheapo.com/locations/central-tokyo/shibuya-2/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'akihabara',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 49000,
          'Current position': 5,
          'Organic traffic': 1767,
          KD: 12,
          'Current URL': 'https://tokyocheapo.com/locations/central-tokyo/akihabara-central-tokyo/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo events',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 2500,
          'Current position': 1,
          'Organic traffic': 1580,
          KD: 10,
          'Current URL': 'https://tokyocheapo.com/events/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'esim for japan',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 3700,
          'Current position': 1,
          'Organic traffic': 1338,
          KD: 6,
          'Current URL': 'https://tokyocheapo.com/business/internet/esim-japan-travel/',
          Informational: true,
          Commercial: true,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: false
        },
        {
          Keyword: 'tokyo restaurants',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 3200,
          'Current position': 8,
          'Organic traffic': 960,
          KD: 25,
          'Current URL': 'https://tokyocheapo.com/restaurants/',
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
          Volume: 1800,
          'Current position': 12,
          'Organic traffic': 540,
          KD: 20,
          'Current URL': 'https://tokyocheapo.com/nightlife/',
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
          Volume: 1500,
          'Current position': 15,
          'Organic traffic': 450,
          KD: 22,
          'Current URL': 'https://tokyocheapo.com/shopping/',
          Informational: true,
          Commercial: true,
          Transactional: true,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo travel guide',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 1200,
          'Current position': 18,
          'Organic traffic': 360,
          KD: 18,
          'Current URL': 'https://tokyocheapo.com/travel-guide/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo cheap eats',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 1100,
          'Current position': 22,
          'Organic traffic': 330,
          KD: 16,
          'Current URL': 'https://tokyocheapo.com/restaurants/cheap-eats/',
          Informational: true,
          Commercial: true,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo budget travel',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 950,
          'Current position': 25,
          'Organic traffic': 285,
          KD: 14,
          'Current URL': 'https://tokyocheapo.com/budget-travel/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo free things to do',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 800,
          'Current position': 28,
          'Organic traffic': 240,
          KD: 12,
          'Current URL': 'https://tokyocheapo.com/free-things-to-do/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo transportation',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 750,
          'Current position': 30,
          'Organic traffic': 225,
          KD: 10,
          'Current URL': 'https://tokyocheapo.com/transportation/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo accommodation',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 700,
          'Current position': 32,
          'Organic traffic': 210,
          KD: 20,
          'Current URL': 'https://tokyocheapo.com/accommodation/',
          Informational: true,
          Commercial: true,
          Transactional: true,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo day trips',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 650,
          'Current position': 35,
          'Organic traffic': 195,
          KD: 15,
          'Current URL': 'https://tokyocheapo.com/day-trips/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo culture',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 600,
          'Current position': 38,
          'Organic traffic': 180,
          KD: 8,
          'Current URL': 'https://tokyocheapo.com/culture/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo temples',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 550,
          'Current position': 40,
          'Organic traffic': 165,
          KD: 12,
          'Current URL': 'https://tokyocheapo.com/temples/',
          Informational: true,
          Commercial: false,
          Transactional: false,
          Navigational: false,
          Branded: false,
          Local: true
        },
        {
          Keyword: 'tokyo markets',
          'Country code': 'JP',
          Location: 'Japan',
          Volume: 500,
          'Current position': 42,
          'Organic traffic': 150,
          KD: 10,
          'Current URL': 'https://tokyocheapo.com/markets/',
          Informational: true,
          Commercial: true,
          Transactional: false,
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
          opportunity_score: 85,
          status: 'worse'
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
          opportunity_score: 75,
          status: 'worse'
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
          opportunity_score: 95,
          status: 'worse'
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
          opportunity_score: 90,
          status: 'worse'
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
          opportunity_score: 70,
          status: 'worse'
        }
      ]
    case '/api/content/recommendations':
      return {
        summary: {
          new_content_proposals: 8,
          improvement_proposals: 12,
          potential_traffic: 45000,
          priority: 'High'
        },
        new_content: [
          {
            title: 'Tokyo Cherry Blossom Viewing Spots 2024',
            keyword: 'tokyo cherry blossom spots',
            volume: 3200,
            difficulty: 15,
            potential_traffic: 8500,
            content_type: 'Guide',
            priority: 'High',
            estimated_effort: 'Medium',
            target_audience: 'Tourists',
            content_angle: 'Seasonal guide with best viewing times and locations'
          },
          {
            title: 'Best Tokyo Ramen Shops by District',
            keyword: 'best tokyo ramen shops',
            volume: 2800,
            difficulty: 22,
            potential_traffic: 7200,
            content_type: 'Listicle',
            priority: 'High',
            estimated_effort: 'High',
            target_audience: 'Food enthusiasts',
            content_angle: 'Comprehensive district-by-district ramen guide'
          },
          {
            title: 'Tokyo Day Trip Destinations from Central Tokyo',
            keyword: 'tokyo day trips',
            volume: 2100,
            difficulty: 18,
            potential_traffic: 5600,
            content_type: 'Guide',
            priority: 'Medium',
            estimated_effort: 'Medium',
            target_audience: 'Tourists',
            content_angle: 'Accessible day trip options with transport details'
          },
          {
            title: 'Tokyo Nightlife Districts Complete Guide',
            keyword: 'tokyo nightlife districts',
            volume: 1800,
            difficulty: 25,
            potential_traffic: 4800,
            content_type: 'Guide',
            priority: 'Medium',
            estimated_effort: 'High',
            target_audience: 'Young adults',
            content_angle: 'Comprehensive nightlife area comparison'
          }
        ],
        improvements: [
          {
            title: 'Tokyo Events Calendar',
            current_url: 'https://www.tokyoweekender.com/events',
            keyword: 'tokyo events',
            current_position: 3,
            target_position: 1,
            potential_traffic_gain: 1200,
            improvement_type: 'Content Enhancement',
            priority: 'High',
            recommendations: [
              'Add more detailed event descriptions',
              'Include event photos and videos',
              'Add user reviews and ratings',
              'Implement event filtering by category'
            ]
          },
          {
            title: 'Tokyo Restaurants Guide',
            current_url: 'https://www.tokyoweekender.com/restaurants',
            keyword: 'tokyo restaurants',
            current_position: 5,
            target_position: 2,
            potential_traffic_gain: 800,
            improvement_type: 'SEO Optimization',
            priority: 'High',
            recommendations: [
              'Optimize meta descriptions',
              'Add structured data markup',
              'Improve page loading speed',
              'Add more restaurant photos'
            ]
          },
          {
            title: 'Tokyo Shopping Areas',
            current_url: 'https://www.tokyoweekender.com/shopping',
            keyword: 'tokyo shopping',
            current_position: 18,
            target_position: 8,
            potential_traffic_gain: 1500,
            improvement_type: 'Content Expansion',
            priority: 'Medium',
            recommendations: [
              'Add shopping district maps',
              'Include store opening hours',
              'Add price range information',
              'Create shopping itinerary suggestions'
            ]
          }
        ],
        topic_clusters: [
          {
            cluster_name: 'Tokyo Food & Dining',
            primary_keyword: 'tokyo food',
            supporting_keywords: [
              'tokyo ramen',
              'tokyo sushi',
              'tokyo street food',
              'tokyo izakaya',
              'tokyo dessert'
            ],
            content_pieces: 6,
            potential_traffic: 25000,
            priority: 'High'
          },
          {
            cluster_name: 'Tokyo Transportation',
            primary_keyword: 'tokyo transportation',
            supporting_keywords: [
              'tokyo metro',
              'tokyo train',
              'tokyo bus',
              'tokyo taxi',
              'tokyo airport transfer'
            ],
            content_pieces: 5,
            potential_traffic: 18000,
            priority: 'Medium'
          },
          {
            cluster_name: 'Tokyo Accommodation',
            primary_keyword: 'tokyo hotels',
            supporting_keywords: [
              'tokyo ryokan',
              'tokyo capsule hotel',
              'tokyo budget accommodation',
              'tokyo luxury hotels',
              'tokyo business hotels'
            ],
            content_pieces: 4,
            potential_traffic: 22000,
            priority: 'High'
          }
        ]
      }
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
