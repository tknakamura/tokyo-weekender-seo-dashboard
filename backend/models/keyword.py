"""
Keyword data models for Tokyo Weekender SEO analysis
"""
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, Index
from sqlalchemy.sql import func
from .database import Base

class Keyword(Base):
    """Keyword data model"""
    __tablename__ = "keywords"
    
    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String(255), nullable=False, index=True)
    country_code = Column(String(2), nullable=False)
    location = Column(String(100))
    entities = Column(Text)
    serp_features = Column(Text)
    volume = Column(Integer, default=0)
    keyword_difficulty = Column(Float, default=0.0)
    cpc = Column(Float, default=0.0)
    organic_traffic = Column(Integer, default=0)
    paid_traffic = Column(Integer, default=0)
    current_position = Column(Integer)
    current_url = Column(Text)
    current_url_inside = Column(Boolean, default=False)
    updated = Column(DateTime, default=func.now())
    
    # Intent classifications
    navigational = Column(Boolean, default=False)
    informational = Column(Boolean, default=False)
    commercial = Column(Boolean, default=False)
    transactional = Column(Boolean, default=False)
    branded = Column(Boolean, default=False)
    local = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Indexes for better query performance
    __table_args__ = (
        Index('ix_keywords_volume_position', 'volume', 'current_position'),
        Index('ix_keywords_intent', 'informational', 'commercial', 'transactional'),
        Index('ix_keywords_position_range', 'current_position'),
        Index('ix_keywords_updated', 'updated'),
    )
    
    def __repr__(self):
        return f"<Keyword(id={self.id}, keyword='{self.keyword}', position={self.current_position})>"

class CompetitorKeyword(Base):
    """Competitor keyword data model"""
    __tablename__ = "competitor_keywords"
    
    id = Column(Integer, primary_key=True, index=True)
    competitor_domain = Column(String(255), nullable=False, index=True)
    keyword = Column(String(255), nullable=False, index=True)
    country_code = Column(String(2), nullable=False)
    location = Column(String(100))
    entities = Column(Text)
    serp_features = Column(Text)
    volume = Column(Integer, default=0)
    keyword_difficulty = Column(Float, default=0.0)
    cpc = Column(Float, default=0.0)
    organic_traffic = Column(Integer, default=0)
    paid_traffic = Column(Integer, default=0)
    current_position = Column(Integer)
    current_url = Column(Text)
    current_url_inside = Column(Boolean, default=False)
    updated = Column(DateTime, default=func.now())
    
    # Intent classifications
    navigational = Column(Boolean, default=False)
    informational = Column(Boolean, default=False)
    commercial = Column(Boolean, default=False)
    transactional = Column(Boolean, default=False)
    branded = Column(Boolean, default=False)
    local = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Indexes
    __table_args__ = (
        Index('ix_competitor_domain_keyword', 'competitor_domain', 'keyword'),
        Index('ix_competitor_volume_position', 'competitor_domain', 'volume', 'current_position'),
    )
    
    def __repr__(self):
        return f"<CompetitorKeyword(id={self.id}, domain='{self.competitor_domain}', keyword='{self.keyword}')>"

class AnalysisResult(Base):
    """Analysis results storage"""
    __tablename__ = "analysis_results"
    
    id = Column(Integer, primary_key=True, index=True)
    analysis_type = Column(String(50), nullable=False, index=True)  # 'performance', 'content_gaps', 'serp_features'
    analysis_date = Column(DateTime, default=func.now(), index=True)
    result_data = Column(Text, nullable=False)  # JSON string
    summary_stats = Column(Text)  # JSON string
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    
    def __repr__(self):
        return f"<AnalysisResult(id={self.id}, type='{self.analysis_type}', date={self.analysis_date})>"

class ContentRecommendation(Base):
    """Content recommendations storage"""
    __tablename__ = "content_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    recommendation_type = Column(String(50), nullable=False, index=True)  # 'new_content', 'improvement', 'gap'
    keyword = Column(String(255), nullable=False, index=True)
    volume = Column(Integer, default=0)
    current_position = Column(Integer)
    priority_score = Column(Float, default=0.0)
    recommendation_data = Column(Text, nullable=False)  # JSON string
    status = Column(String(20), default='pending')  # 'pending', 'in_progress', 'completed', 'rejected'
    
    # Timestamps
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Indexes
    __table_args__ = (
        Index('ix_recommendation_type_status', 'recommendation_type', 'status'),
        Index('ix_recommendation_priority', 'priority_score'),
    )
    
    def __repr__(self):
        return f"<ContentRecommendation(id={self.id}, type='{self.recommendation_type}', keyword='{self.keyword}')>"
