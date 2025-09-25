"""
Database service for keyword data operations
"""
import json
import pandas as pd
import numpy as np
from typing import List, Dict, Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.models.database import get_db
from backend.models.keyword import Keyword, CompetitorKeyword, AnalysisResult, ContentRecommendation

class DatabaseService:
    """Service class for database operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def convert_numpy_types(self, obj):
        """Convert numpy types to Python native types for JSON serialization"""
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            if np.isnan(obj) or np.isinf(obj):
                return None
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, dict):
            return {key: self.convert_numpy_types(value) for key, value in obj.items()}
        elif isinstance(obj, list):
            return [self.convert_numpy_types(item) for item in obj]
        return obj
    
    def bulk_insert_keywords(self, keywords_data: List[Dict]) -> int:
        """Bulk insert keywords data"""
        try:
            # Clear existing data
            self.db.query(Keyword).delete()
            
            # Prepare data for bulk insert
            keywords = []
            for data in keywords_data:
                # Handle NaN values and convert to appropriate types
                def safe_get(key, default=None):
                    value = data.get(key, default)
                    if pd.isna(value) if hasattr(pd, 'isna') else (value is None or str(value).lower() == 'nan'):
                        return default
                    return value
                
                keyword = Keyword(
                    keyword=str(safe_get('Keyword', '')),
                    country_code=str(safe_get('Country code', '')),
                    location=str(safe_get('Location', '')),
                    entities=str(safe_get('Entities', '')),
                    serp_features=str(safe_get('SERP features', '')),
                    volume=int(float(safe_get('Volume', 0) or 0)),
                    keyword_difficulty=float(safe_get('KD', 0) or 0),
                    cpc=float(safe_get('CPC', 0) or 0),
                    organic_traffic=int(float(safe_get('Organic traffic', 0) or 0)),
                    paid_traffic=int(float(safe_get('Paid traffic', 0) or 0)),
                    current_position=int(float(safe_get('Current position', 999) or 999)) if safe_get('Current position') else 999,
                    current_url=str(safe_get('Current URL', '')),
                    current_url_inside=bool(safe_get('Current URL inside', False)),
                    navigational=bool(safe_get('Navigational', False)),
                    informational=bool(safe_get('Informational', False)),
                    commercial=bool(safe_get('Commercial', False)),
                    transactional=bool(safe_get('Transactional', False)),
                    branded=bool(safe_get('Branded', False)),
                    local=bool(safe_get('Local', False))
                )
                keywords.append(keyword)
            
            # Bulk insert
            self.db.add_all(keywords)
            self.db.commit()
            
            return len(keywords)
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_keywords_summary(self) -> Dict[str, Any]:
        """Get keywords summary statistics"""
        try:
            # Total keywords
            total_keywords = self.db.query(Keyword).count()
            
            # Total volume and traffic
            result = self.db.execute(text("""
                SELECT 
                    COALESCE(SUM(volume), 0) as total_volume,
                    COALESCE(SUM(organic_traffic), 0) as total_traffic,
                    COALESCE(AVG(current_position), 0) as avg_position
                FROM keywords
                WHERE current_position IS NOT NULL
            """)).fetchone()
            
            # Top performing keywords (position <= 3)
            top_performing = self.db.query(Keyword).filter(
                Keyword.current_position <= 3
            ).count()
            
            return {
                'total_keywords': total_keywords,
                'total_volume': result.total_volume if result else 0,
                'total_traffic': result.total_traffic if result else 0,
                'avg_position': float(result.avg_position) if result else 0.0,
                'top_performing_keywords': top_performing
            }
        except Exception as e:
            print(f"Keywords summary error: {e}")
            return {
                'total_keywords': 0,
                'total_volume': 0,
                'total_traffic': 0,
                'avg_position': 0.0,
                'top_performing_keywords': 0
            }
    
    def get_performance_analysis(self) -> Dict:
        """Get performance analysis data"""
        try:
            # Position distribution analysis
            position_stats = self.db.execute(text("""
                SELECT 
                    CASE 
                        WHEN current_position <= 3 THEN 'top_3'
                        WHEN current_position <= 10 THEN 'top_10'
                        WHEN current_position <= 20 THEN 'top_20'
                        WHEN current_position <= 50 THEN 'top_50'
                        ELSE 'not_ranking'
                    END as position_group,
                    COUNT(*) as count,
                    SUM(organic_traffic) as total_traffic
                FROM keywords 
                WHERE current_position IS NOT NULL
                GROUP BY position_group
            """)).fetchall()
            
            position_distribution = {}
            for row in position_stats:
                position_distribution[row[0]] = {
                    'count': int(row[1]) if row[1] is not None else 0,
                    'total_traffic': int(row[2]) if row[2] is not None else 0
                }
            
            # SERP features analysis
            serp_stats = self.db.execute(text("""
                SELECT serp_features, COUNT(*) as count
                FROM keywords 
                WHERE serp_features IS NOT NULL AND serp_features != ''
                GROUP BY serp_features
            """)).fetchall()
            
            serp_features = {}
            for row in serp_stats:
                if row[0]:  # Only process non-empty SERP features
                    features = row[0].split(', ')
                    for feature in features:
                        feature = feature.strip()
                        if feature:
                            serp_features[feature] = serp_features.get(feature, 0) + int(row[1])
            
            return {
                'position_distribution': position_distribution,
                'serp_features': serp_features
            }
            
        except Exception as e:
            print(f"Performance analysis error: {e}")
            return {
                'position_distribution': {},
                'serp_features': {}
            }
    
    def search_keywords(self, min_volume: int = 100, max_position: int = 50, intent: str = "", limit: int = 100) -> List[Dict]:
        """Search keywords with filters"""
        try:
            # Build query
            query = self.db.query(Keyword)
            
            # Apply filters
            if min_volume > 0:
                query = query.filter(Keyword.volume >= min_volume)
            
            if max_position > 0:
                query = query.filter(Keyword.current_position <= max_position)
            
            if intent:
                # Map intent string to boolean field
                intent_map = {
                    'Informational': Keyword.informational,
                    'Commercial': Keyword.commercial,
                    'Transactional': Keyword.transactional,
                    'Navigational': Keyword.navigational,
                    'Branded': Keyword.branded,
                    'Local': Keyword.local
                }
                if intent in intent_map:
                    query = query.filter(intent_map[intent] == True)
            
            # Order by traffic and position
            query = query.order_by(Keyword.organic_traffic.desc(), Keyword.current_position.asc())
            
            # Limit results
            results = query.limit(limit).all()
            
            # Convert to dictionary format
            keywords = []
            for keyword in results:
                keywords.append({
                    'Keyword': keyword.keyword,
                    'Country code': keyword.country_code,
                    'Location': keyword.location,
                    'Entities': keyword.entities,
                    'SERP features': keyword.serp_features,
                    'Volume': keyword.volume,
                    'KD': keyword.keyword_difficulty,
                    'CPC': keyword.cpc,
                    'Organic traffic': keyword.organic_traffic,
                    'Paid traffic': keyword.paid_traffic,
                    'Current position': keyword.current_position,
                    'Current URL': keyword.current_url,
                    'Current URL inside': keyword.current_url_inside,
                    'Updated': keyword.updated.isoformat() if keyword.updated else None,
                    'Navigational': keyword.navigational,
                    'Informational': keyword.informational,
                    'Commercial': keyword.commercial,
                    'Transactional': keyword.transactional,
                    'Branded': keyword.branded,
                    'Local': keyword.local
                })
            
            return keywords
            
        except Exception as e:
            print(f"Keyword search error: {e}")
            return []
    
    def get_competitors_summary(self) -> Dict:
        """Get competitors summary"""
        try:
            # Get competitor sites and their statistics
            competitors = self.db.execute(text("""
                SELECT 
                    competitor_site,
                    COUNT(*) as total_keywords,
                    SUM(organic_traffic) as total_traffic,
                    AVG(CASE WHEN current_position < 999 THEN current_position END) as avg_position,
                    SUM(volume) as total_volume
                FROM keywords 
                WHERE competitor_site IS NOT NULL
                GROUP BY competitor_site
                ORDER BY total_traffic DESC
            """)).fetchall()
            
            competitor_data = []
            for row in competitors:
                site_name = row[0]
                display_name = {
                    "tokyocheapo.com": "Tokyo Cheapo",
                    "www.japan.travel": "Japan Travel", 
                    "www.timeout.jp": "Timeout Tokyo",
                    "www.gotokyo.org": "Go Tokyo"
                }.get(site_name, site_name)
                
                competitor_data.append({
                    "site_name": site_name,
                    "display_name": display_name,
                    "total_keywords": int(row[1]) if row[1] else 0,
                    "total_traffic": int(row[2]) if row[2] else 0,
                    "avg_position": float(row[3]) if row[3] else 0.0,
                    "total_volume": int(row[4]) if row[4] else 0
                })
            
            # Calculate total statistics
            total_competitors = len(competitor_data)
            total_traffic = sum(c["total_traffic"] for c in competitor_data)
            total_keywords = sum(c["total_keywords"] for c in competitor_data)
            
            return {
                "competitors": competitor_data,
                "summary": {
                    "total_competitors": total_competitors,
                    "total_traffic": total_traffic,
                    "total_keywords": total_keywords
                }
            }
            
        except Exception as e:
            print(f"Competitors summary error: {e}")
            return {
                "competitors": [],
                "summary": {
                    "total_competitors": 0,
                    "total_traffic": 0,
                    "total_keywords": 0
                }
            }
    
    def get_competitor_keywords(self, competitor_site: str, min_volume: int = 100, max_position: int = 50, limit: int = 100) -> List[Dict]:
        """Get keywords for a specific competitor"""
        try:
            query = self.db.query(Keyword).filter(Keyword.competitor_site == competitor_site)
            
            if min_volume > 0:
                query = query.filter(Keyword.volume >= min_volume)
            
            if max_position > 0:
                query = query.filter(Keyword.current_position <= max_position)
            
            query = query.order_by(Keyword.organic_traffic.desc(), Keyword.current_position.asc())
            results = query.limit(limit).all()
            
            keywords = []
            for keyword in results:
                keywords.append({
                    'Keyword': keyword.keyword,
                    'Country code': keyword.country_code,
                    'Location': keyword.location,
                    'Entities': keyword.entities,
                    'SERP features': keyword.serp_features,
                    'Volume': keyword.volume,
                    'KD': keyword.keyword_difficulty,
                    'CPC': keyword.cpc,
                    'Organic traffic': keyword.organic_traffic,
                    'Paid traffic': keyword.paid_traffic,
                    'Current position': keyword.current_position,
                    'Current URL': keyword.current_url,
                    'Current URL inside': keyword.current_url_inside,
                    'Updated': keyword.updated.isoformat() if keyword.updated else None,
                    'Navigational': keyword.navigational,
                    'Informational': keyword.informational,
                    'Commercial': keyword.commercial,
                    'Transactional': keyword.transactional,
                    'Branded': keyword.branded,
                    'Local': keyword.local,
                    'Competitor Site': keyword.competitor_site
                })
            
            return keywords
            
        except Exception as e:
            print(f"Competitor keywords error: {e}")
            return []
    
    def get_competitor_opportunities(self, min_volume: int = 100, limit: int = 100) -> List[Dict]:
        """Get competitor opportunity keywords (keywords where competitors rank well but Tokyo Weekender doesn't)"""
        try:
            # Find keywords where competitors rank well (position <= 20) but Tokyo Weekender doesn't rank or ranks poorly
            opportunities = self.db.execute(text("""
                WITH competitor_good_keywords AS (
                    SELECT 
                        keyword,
                        competitor_site,
                        volume,
                        current_position as competitor_position,
                        organic_traffic as competitor_traffic,
                        current_url as competitor_url
                    FROM keywords 
                    WHERE competitor_site IS NOT NULL 
                    AND current_position <= 20 
                    AND volume >= :min_volume
                ),
                tokyo_weekender_keywords AS (
                    SELECT 
                        keyword,
                        current_position as tw_position,
                        organic_traffic as tw_traffic
                    FROM keywords 
                    WHERE competitor_site IS NULL
                )
                SELECT 
                    c.keyword,
                    c.competitor_site,
                    c.volume,
                    c.competitor_position,
                    c.competitor_traffic,
                    c.competitor_url,
                    COALESCE(t.tw_position, 999) as tw_position,
                    COALESCE(t.tw_traffic, 0) as tw_traffic
                FROM competitor_good_keywords c
                LEFT JOIN tokyo_weekender_keywords t ON c.keyword = t.keyword
                WHERE COALESCE(t.tw_position, 999) > 20
                ORDER BY c.volume DESC, c.competitor_traffic DESC
                LIMIT :limit
            """), {"min_volume": min_volume, "limit": limit}).fetchall()
            
            opportunity_data = []
            for row in opportunities:
                opportunity_data.append({
                    'keyword': row[0],
                    'competitor_site': row[1],
                    'volume': int(row[2]) if row[2] else 0,
                    'competitor_position': int(row[3]) if row[3] else 0,
                    'competitor_traffic': int(row[4]) if row[4] else 0,
                    'competitor_url': row[5],
                    'tokyo_weekender_position': int(row[6]) if row[6] else 999,
                    'tokyo_weekender_traffic': int(row[7]) if row[7] else 0,
                    'opportunity_score': int(row[2]) * (1.0 / max(int(row[3]), 1)) if row[2] and row[3] else 0
                })
            
            return opportunity_data
            
        except Exception as e:
            print(f"Competitor opportunities error: {e}")
            return []
    
    def get_competitor_vs_tw_comparison(self, competitor_site: str, limit: int = 100) -> List[Dict]:
        """Get detailed comparison between competitor and Tokyo Weekender for top keywords"""
        try:
            # Get competitor's top keywords with Tokyo Weekender comparison
            comparison_data = self.db.execute(text("""
                WITH competitor_top_keywords AS (
                    SELECT 
                        keyword,
                        volume,
                        current_position as competitor_position,
                        organic_traffic as competitor_traffic,
                        current_url as competitor_url,
                        keyword_difficulty,
                        cpc,
                        serp_features,
                        informational,
                        commercial,
                        transactional,
                        navigational,
                        branded,
                        local
                    FROM keywords 
                    WHERE competitor_site = :competitor_site
                    ORDER BY organic_traffic DESC, volume DESC
                    LIMIT :limit
                ),
                tokyo_weekender_keywords AS (
                    SELECT 
                        keyword,
                        current_position as tw_position,
                        organic_traffic as tw_traffic,
                        current_url as tw_url
                    FROM keywords 
                    WHERE competitor_site IS NULL
                )
                SELECT 
                    c.keyword,
                    c.volume,
                    c.competitor_position,
                    c.competitor_traffic,
                    c.competitor_url,
                    c.keyword_difficulty,
                    c.cpc,
                    c.serp_features,
                    c.informational,
                    c.commercial,
                    c.transactional,
                    c.navigational,
                    c.branded,
                    c.local,
                    COALESCE(t.tw_position, 999) as tw_position,
                    COALESCE(t.tw_traffic, 0) as tw_traffic,
                    t.tw_url
                FROM competitor_top_keywords c
                LEFT JOIN tokyo_weekender_keywords t ON c.keyword = t.keyword
                ORDER BY c.competitor_traffic DESC, c.volume DESC
            """), {"competitor_site": competitor_site, "limit": limit}).fetchall()
            
            comparison_results = []
            for row in comparison_data:
                # Calculate opportunity score (higher is better opportunity)
                opportunity_score = 0
                if row[2] <= 10 and row[15] > 20:  # Competitor ranks well, TW doesn't
                    opportunity_score = int(row[1]) * (1.0 / max(row[2], 1))
                elif row[15] <= row[2]:  # TW ranks better than competitor
                    opportunity_score = -int(row[1]) * (1.0 / max(row[15], 1))
                
                comparison_results.append({
                    'keyword': row[0],
                    'volume': int(row[1]) if row[1] else 0,
                    'competitor_position': int(row[2]) if row[2] else 0,
                    'competitor_traffic': int(row[3]) if row[3] else 0,
                    'competitor_url': row[4],
                    'keyword_difficulty': float(row[5]) if row[5] else 0.0,
                    'cpc': float(row[6]) if row[6] else 0.0,
                    'serp_features': row[7],
                    'informational': bool(row[8]),
                    'commercial': bool(row[9]),
                    'transactional': bool(row[10]),
                    'navigational': bool(row[11]),
                    'branded': bool(row[12]),
                    'local': bool(row[13]),
                    'tokyo_weekender_position': int(row[14]) if row[14] else 999,
                    'tokyo_weekender_traffic': int(row[15]) if row[15] else 0,
                    'tokyo_weekender_url': row[16],
                    'opportunity_score': opportunity_score,
                    'status': self._get_comparison_status(int(row[2]) if row[2] else 0, int(row[14]) if row[14] else 999)
                })
            
            return comparison_results
            
        except Exception as e:
            print(f"Competitor vs TW comparison error: {e}")
            return []
    
    def _get_comparison_status(self, competitor_pos: int, tw_pos: int) -> str:
        """Get comparison status between competitor and Tokyo Weekender"""
        if tw_pos == 999:
            return "not_ranking"  # Tokyo Weekender not ranking
        elif tw_pos < competitor_pos:
            return "better"  # Tokyo Weekender ranks better
        elif tw_pos > competitor_pos:
            return "worse"  # Tokyo Weekender ranks worse
        else:
            return "same"  # Same position
    
    def get_position_distribution(self) -> Dict[str, Dict]:
        """Get position distribution analysis"""
        try:
            position_ranges = {
                'top_3': (1, 3),
                'top_10': (4, 10),
                'top_20': (11, 20),
                'top_50': (21, 50),
                'not_ranking': (51, 999)
            }
            
            distribution = {}
            total_keywords = self.db.query(Keyword).count()
            
            for name, (min_pos, max_pos) in position_ranges.items():
                if name == 'not_ranking':
                    keywords_in_range = self.db.query(Keyword).filter(
                        Keyword.current_position >= min_pos
                    ).all()
                else:
                    keywords_in_range = self.db.query(Keyword).filter(
                        Keyword.current_position >= min_pos,
                        Keyword.current_position <= max_pos
                    ).all()
                
                total_volume = sum(k.volume for k in keywords_in_range)
                total_traffic = sum(k.organic_traffic for k in keywords_in_range)
                
                distribution[name] = {
                    'count': len(keywords_in_range),
                    'percentage': len(keywords_in_range) / total_keywords * 100 if total_keywords > 0 else 0,
                    'total_volume': total_volume,
                    'total_traffic': total_traffic
                }
            
            return distribution
            
        except Exception as e:
            raise e
    
    def get_high_performance_keywords(self, limit: int = 20) -> List[Dict]:
        """Get high performance keywords"""
        try:
            keywords = self.db.query(Keyword).filter(
                Keyword.current_position <= 10,
                Keyword.volume >= 100
            ).order_by(Keyword.organic_traffic.desc()).limit(limit).all()
            
            return [
                {
                    'Keyword': k.keyword,
                    'Volume': k.volume,
                    'Organic traffic': k.organic_traffic,
                    'Current position': k.current_position,
                    'Current URL': k.current_url,
                    'KD': k.keyword_difficulty
                }
                for k in keywords
            ]
            
        except Exception as e:
            raise e
    
    def get_improvement_opportunities(self, limit: int = 20) -> List[Dict]:
        """Get improvement opportunity keywords"""
        try:
            keywords = self.db.query(Keyword).filter(
                Keyword.current_position >= 11,
                Keyword.current_position <= 20,
                Keyword.volume >= 50
            ).order_by(Keyword.volume.desc()).limit(limit).all()
            
            return [
                {
                    'Keyword': k.keyword,
                    'Volume': k.volume,
                    'Organic traffic': k.organic_traffic,
                    'Current position': k.current_position,
                    'Current URL': k.current_url,
                    'KD': k.keyword_difficulty
                }
                for k in keywords
            ]
            
        except Exception as e:
            raise e
    
    def get_serp_features_analysis(self) -> Dict[str, Dict]:
        """Get SERP features analysis"""
        try:
            serp_features = [
                'Sitelinks', 'People also ask', 'Local pack', 'Thumbnail',
                'Video preview', 'Knowledge panel', 'AI Overview', 'Shopping'
            ]
            
            analysis = {}
            total_keywords = self.db.query(Keyword).count()
            
            for feature in serp_features:
                # Use SQL LIKE for pattern matching
                keywords_with_feature = self.db.execute(text(f"""
                    SELECT COUNT(*) as count, 
                           AVG(volume) as avg_volume,
                           AVG(current_position) as avg_position,
                           SUM(organic_traffic) as total_traffic
                    FROM keywords 
                    WHERE serp_features LIKE :feature_pattern
                """), {"feature_pattern": f"%{feature}%"}).fetchone()
                
                analysis[feature] = {
                    'count': keywords_with_feature.count if keywords_with_feature else 0,
                    'percentage': (keywords_with_feature.count / total_keywords * 100) if total_keywords > 0 and keywords_with_feature else 0,
                    'avg_volume': float(keywords_with_feature.avg_volume) if keywords_with_feature and keywords_with_feature.avg_volume else 0,
                    'avg_position': float(keywords_with_feature.avg_position) if keywords_with_feature and keywords_with_feature.avg_position else 0,
                    'total_traffic': keywords_with_feature.total_traffic if keywords_with_feature else 0
                }
            
            return analysis
            
        except Exception as e:
            raise e
    
    def save_analysis_result(self, analysis_type: str, result_data: Dict, summary_stats: Dict = None):
        """Save analysis results to database"""
        try:
            analysis = AnalysisResult(
                analysis_type=analysis_type,
                result_data=json.dumps(result_data, ensure_ascii=False),
                summary_stats=json.dumps(summary_stats, ensure_ascii=False) if summary_stats else None
            )
            
            self.db.add(analysis)
            self.db.commit()
            
            return analysis.id
            
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_keywords_with_filters(self, 
                                min_volume: Optional[int] = None,
                                max_position: Optional[int] = None,
                                intent: Optional[str] = None,
                                limit: int = 100,
                                offset: int = 0) -> Dict[str, Any]:
        """Get keywords with filters"""
        try:
            query = self.db.query(Keyword)
            
            if min_volume is not None:
                query = query.filter(Keyword.volume >= min_volume)
            
            if max_position is not None:
                query = query.filter(Keyword.current_position <= max_position)
            
            if intent is not None and hasattr(Keyword, intent.lower()):
                query = query.filter(getattr(Keyword, intent.lower()) == True)
            
            # Get total count
            total = query.count()
            
            # Apply pagination
            keywords = query.offset(offset).limit(limit).all()
            
            return {
                'keywords': [
                    {
                        'Keyword': k.keyword,
                        'Volume': k.volume,
                        'Organic traffic': k.organic_traffic,
                        'Current position': k.current_position,
                        'Current URL': k.current_url,
                        'KD': k.keyword_difficulty,
                        'Navigational': k.navigational,
                        'Informational': k.informational,
                        'Commercial': k.commercial,
                        'Transactional': k.transactional,
                        'Branded': k.branded,
                        'Local': k.local
                    }
                    for k in keywords
                ],
                'total': total,
                'limit': limit,
                'offset': offset
            }
            
        except Exception as e:
            raise e
