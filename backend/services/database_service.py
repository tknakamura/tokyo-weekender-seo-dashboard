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
    
    def get_new_content_recommendations(self, limit: int = 8) -> List[Dict]:
        """新規コンテンツ提案の生成"""
        try:
            # 高ボリューム + 中難易度 + 未ランキングまたは低ポジションのキーワードを分析
            recommendations = self.db.execute(text("""
                WITH competitor_keywords AS (
                    SELECT DISTINCT keyword, volume, keyword_difficulty
                    FROM keywords 
                    WHERE competitor_site IS NOT NULL
                    AND volume > 1000
                    AND keyword_difficulty < 40
                ),
                tokyo_weekender_keywords AS (
                    SELECT keyword, current_position, organic_traffic, current_url
                    FROM keywords 
                    WHERE competitor_site IS NULL
                )
                SELECT 
                    c.keyword,
                    c.volume,
                    c.keyword_difficulty,
                    COALESCE(t.current_position, 999) as current_position,
                    COALESCE(t.organic_traffic, 0) as organic_traffic,
                    t.current_url
                FROM competitor_keywords c
                LEFT JOIN tokyo_weekender_keywords t ON c.keyword = t.keyword
                WHERE COALESCE(t.current_position, 999) > 20  -- 未ランキングまたは低ポジション
                ORDER BY c.volume DESC, c.keyword_difficulty ASC
                LIMIT :limit
            """), {"limit": limit}).fetchall()
            
            content_recommendations = []
            for row in recommendations:
                # コンテンツタイプの決定
                content_type = self._determine_content_type(row[0])
                priority = self._calculate_priority(row[1], row[2], row[3])
                effort = self._estimate_effort(row[2], content_type)
                target_audience = self._determine_target_audience(row[0])
                content_angle = self._generate_content_angle(row[0], content_type)
                
                content_recommendations.append({
                    'title': self._generate_title(row[0], content_type),
                    'keyword': row[0],
                    'volume': int(row[1]) if row[1] else 0,
                    'difficulty': float(row[2]) if row[2] else 0.0,
                    'potential_traffic': int(row[1] * 0.3) if row[1] else 0,  # 推定トラフィック
                    'content_type': content_type,
                    'priority': priority,
                    'estimated_effort': effort,
                    'target_audience': target_audience,
                    'content_angle': content_angle
                })
            
            return content_recommendations
            
        except Exception as e:
            print(f"New content recommendations error: {e}")
            return []
    
    def get_content_improvement_recommendations(self, limit: int = 12) -> List[Dict]:
        """既存コンテンツ改善提案の生成"""
        try:
            # 現在ランキングしているが改善余地のあるキーワードを分析
            improvements = self.db.execute(text("""
                SELECT 
                    keyword,
                    volume,
                    current_position,
                    organic_traffic,
                    current_url,
                    keyword_difficulty
                FROM keywords 
                WHERE competitor_site IS NULL
                AND current_position BETWEEN 5 AND 20  -- 改善余地のあるポジション
                AND volume > 500
                AND organic_traffic > 0
                ORDER BY volume * (1.0 / current_position) DESC
                LIMIT :limit
            """), {"limit": limit}).fetchall()
            
            improvement_recommendations = []
            for row in improvements:
                target_position = max(1, row[2] - 3)  # 3ポジション向上を目標
                potential_traffic_gain = int(row[1] * 0.2) if row[1] else 0  # 推定トラフィック増加
                improvement_type = self._determine_improvement_type(row[2], row[5])
                priority = self._calculate_improvement_priority(row[1], row[2], row[3])
                recommendations = self._generate_improvement_recommendations(row[0], improvement_type)
                
                improvement_recommendations.append({
                    'title': self._generate_page_title(row[0]),
                    'current_url': row[4],
                    'keyword': row[0],
                    'current_position': int(row[2]) if row[2] else 0,
                    'target_position': target_position,
                    'potential_traffic_gain': potential_traffic_gain,
                    'improvement_type': improvement_type,
                    'priority': priority,
                    'recommendations': recommendations
                })
            
            return improvement_recommendations
            
        except Exception as e:
            print(f"Content improvement recommendations error: {e}")
            return []
    
    def get_topic_cluster_recommendations(self, limit: int = 3) -> List[Dict]:
        """トピッククラスター提案の生成"""
        try:
            # 関連キーワードのグループ化とクラスター分析
            clusters = self.db.execute(text("""
                WITH keyword_groups AS (
                    SELECT 
                        CASE 
                            WHEN keyword ILIKE '%tokyo%' AND keyword ILIKE '%food%' THEN 'Tokyo Food & Dining'
                            WHEN keyword ILIKE '%tokyo%' AND keyword ILIKE '%transport%' THEN 'Tokyo Transportation'
                            WHEN keyword ILIKE '%tokyo%' AND keyword ILIKE '%hotel%' THEN 'Tokyo Accommodation'
                            WHEN keyword ILIKE '%tokyo%' AND keyword ILIKE '%shopping%' THEN 'Tokyo Shopping'
                            WHEN keyword ILIKE '%tokyo%' AND keyword ILIKE '%nightlife%' THEN 'Tokyo Nightlife'
                            ELSE 'Other'
                        END as cluster_name,
                        keyword,
                        volume,
                        current_position,
                        organic_traffic
                    FROM keywords 
                    WHERE competitor_site IS NULL
                    AND volume > 100
                )
                SELECT 
                    cluster_name,
                    COUNT(*) as keyword_count,
                    SUM(volume) as total_volume,
                    AVG(current_position) as avg_position,
                    SUM(organic_traffic) as total_traffic
                FROM keyword_groups
                WHERE cluster_name != 'Other'
                GROUP BY cluster_name
                HAVING COUNT(*) >= 5  -- 最低5つのキーワード
                ORDER BY total_volume DESC
                LIMIT :limit
            """), {"limit": limit}).fetchall()
            
            topic_clusters = []
            for row in clusters:
                cluster_name = row[0]
                supporting_keywords = self._get_supporting_keywords(cluster_name)
                content_pieces = min(8, max(4, row[1] // 2))  # キーワード数に基づくコンテンツ数
                potential_traffic = int(row[4] * 1.5) if row[4] else 0  # 推定トラフィック増加
                priority = self._calculate_cluster_priority(row[2], row[3])
                
                topic_clusters.append({
                    'cluster_name': cluster_name,
                    'primary_keyword': self._get_primary_keyword(cluster_name),
                    'supporting_keywords': supporting_keywords,
                    'content_pieces': content_pieces,
                    'potential_traffic': potential_traffic,
                    'priority': priority
                })
            
            return topic_clusters
            
        except Exception as e:
            print(f"Topic cluster recommendations error: {e}")
            return []
    
    # Helper methods for content recommendations
    def _determine_content_type(self, keyword: str) -> str:
        """Determine content type based on keyword"""
        keyword_lower = keyword.lower()
        if any(word in keyword_lower for word in ['guide', 'how to', 'tips', 'best']):
            return 'Guide'
        elif any(word in keyword_lower for word in ['best', 'top', 'list']):
            return 'Listicle'
        elif any(word in keyword_lower for word in ['review', 'comparison']):
            return 'Review'
        else:
            return 'Article'
    
    def _calculate_priority(self, volume: int, difficulty: float, position: int) -> str:
        """Calculate priority based on volume, difficulty, and position"""
        if volume > 2000 and difficulty < 30 and position > 20:
            return 'High'
        elif volume > 1000 and difficulty < 40:
            return 'Medium'
        else:
            return 'Low'
    
    def _estimate_effort(self, difficulty: float, content_type: str) -> str:
        """Estimate effort based on difficulty and content type"""
        if content_type == 'Guide' and difficulty > 30:
            return 'High'
        elif content_type == 'Listicle' or difficulty < 20:
            return 'Low'
        else:
            return 'Medium'
    
    def _determine_target_audience(self, keyword: str) -> str:
        """Determine target audience based on keyword"""
        keyword_lower = keyword.lower()
        if any(word in keyword_lower for word in ['tourist', 'visit', 'travel']):
            return 'Tourists'
        elif any(word in keyword_lower for word in ['food', 'restaurant', 'dining']):
            return 'Food enthusiasts'
        elif any(word in keyword_lower for word in ['nightlife', 'bar', 'club']):
            return 'Young adults'
        else:
            return 'General audience'
    
    def _generate_content_angle(self, keyword: str, content_type: str) -> str:
        """Generate content angle based on keyword and type"""
        if content_type == 'Guide':
            return f'Comprehensive guide covering all aspects of {keyword}'
        elif content_type == 'Listicle':
            return f'Curated list of the best {keyword} options'
        else:
            return f'In-depth analysis and insights about {keyword}'
    
    def _generate_title(self, keyword: str, content_type: str) -> str:
        """Generate title based on keyword and content type"""
        if content_type == 'Guide':
            return f'Complete Guide to {keyword.title()}'
        elif content_type == 'Listicle':
            return f'Best {keyword.title()} in Tokyo'
        else:
            return f'{keyword.title()}: Everything You Need to Know'
    
    def _determine_improvement_type(self, position: int, difficulty: float) -> str:
        """Determine improvement type based on position and difficulty"""
        if position > 15:
            return 'Content Enhancement'
        elif difficulty > 30:
            return 'SEO Optimization'
        else:
            return 'Content Expansion'
    
    def _calculate_improvement_priority(self, volume: int, position: int, traffic: int) -> str:
        """Calculate improvement priority"""
        if volume > 1000 and position > 10 and traffic < 100:
            return 'High'
        elif volume > 500 and position > 5:
            return 'Medium'
        else:
            return 'Low'
    
    def _generate_improvement_recommendations(self, keyword: str, improvement_type: str) -> List[str]:
        """Generate specific improvement recommendations"""
        if improvement_type == 'Content Enhancement':
            return [
                'Add more detailed information and examples',
                'Include high-quality images and videos',
                'Add user reviews and testimonials',
                'Implement interactive elements'
            ]
        elif improvement_type == 'SEO Optimization':
            return [
                'Optimize meta descriptions and titles',
                'Add structured data markup',
                'Improve page loading speed',
                'Enhance internal linking structure'
            ]
        else:
            return [
                'Expand content with additional sections',
                'Add related topic coverage',
                'Include FAQ section',
                'Create supporting content pieces'
            ]
    
    def _generate_page_title(self, keyword: str) -> str:
        """Generate page title from keyword"""
        return f'{keyword.title()} - Tokyo Weekender'
    
    def _get_supporting_keywords(self, cluster_name: str) -> List[str]:
        """Get supporting keywords for a cluster"""
        cluster_keywords = {
            'Tokyo Food & Dining': ['tokyo ramen', 'tokyo sushi', 'tokyo street food', 'tokyo izakaya', 'tokyo dessert'],
            'Tokyo Transportation': ['tokyo metro', 'tokyo train', 'tokyo bus', 'tokyo taxi', 'tokyo airport transfer'],
            'Tokyo Accommodation': ['tokyo ryokan', 'tokyo capsule hotel', 'tokyo budget accommodation', 'tokyo luxury hotels', 'tokyo business hotels'],
            'Tokyo Shopping': ['tokyo shopping districts', 'tokyo department stores', 'tokyo markets', 'tokyo souvenirs', 'tokyo fashion'],
            'Tokyo Nightlife': ['tokyo bars', 'tokyo clubs', 'tokyo izakaya', 'tokyo karaoke', 'tokyo entertainment']
        }
        return cluster_keywords.get(cluster_name, [])
    
    def _calculate_cluster_priority(self, total_volume: int, avg_position: float) -> str:
        """Calculate cluster priority"""
        if total_volume > 10000 and avg_position > 15:
            return 'High'
        elif total_volume > 5000:
            return 'Medium'
        else:
            return 'Low'
    
    def _get_primary_keyword(self, cluster_name: str) -> str:
        """Get primary keyword for a cluster"""
        primary_keywords = {
            'Tokyo Food & Dining': 'tokyo food',
            'Tokyo Transportation': 'tokyo transportation',
            'Tokyo Accommodation': 'tokyo hotels',
            'Tokyo Shopping': 'tokyo shopping',
            'Tokyo Nightlife': 'tokyo nightlife'
        }
        return primary_keywords.get(cluster_name, 'tokyo guide')
