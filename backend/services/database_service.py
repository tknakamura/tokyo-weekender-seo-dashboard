"""
Database service for keyword data operations
"""
import json
import pandas as pd
from typing import List, Dict, Optional, Any
from sqlalchemy.orm import Session
from sqlalchemy import text
from backend.models.database import get_db
from backend.models.keyword import Keyword, CompetitorKeyword, AnalysisResult, ContentRecommendation

class DatabaseService:
    """Service class for database operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def bulk_insert_keywords(self, keywords_data: List[Dict]) -> int:
        """Bulk insert keywords data"""
        try:
            # Clear existing data
            self.db.query(Keyword).delete()
            
            # Prepare data for bulk insert
            keywords = []
            for data in keywords_data:
                keyword = Keyword(
                    keyword=data.get('Keyword', ''),
                    country_code=data.get('Country code', ''),
                    location=data.get('Location', ''),
                    entities=data.get('Entities', ''),
                    serp_features=data.get('SERP features', ''),
                    volume=data.get('Volume', 0) or 0,
                    keyword_difficulty=data.get('KD', 0) or 0,
                    cpc=data.get('CPC', 0) or 0,
                    organic_traffic=data.get('Organic traffic', 0) or 0,
                    paid_traffic=data.get('Paid traffic', 0) or 0,
                    current_position=data.get('Current position'),
                    current_url=data.get('Current URL', ''),
                    current_url_inside=data.get('Current URL inside', False),
                    navigational=data.get('Navigational', False),
                    informational=data.get('Informational', False),
                    commercial=data.get('Commercial', False),
                    transactional=data.get('Transactional', False),
                    branded=data.get('Branded', False),
                    local=data.get('Local', False)
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
            raise e
    
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
