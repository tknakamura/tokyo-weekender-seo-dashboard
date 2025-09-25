from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from sqlalchemy.sql import func
from backend.models.database import Base

class CompetitorKeyword(Base):
    __tablename__ = "competitor_keywords"

    id = Column(Integer, primary_key=True, index=True)
    competitor_site = Column(String, index=True, nullable=False)  # e.g., "tokyocheapo.com"
    keyword = Column(String, index=True, nullable=False)
    country_code = Column(String, default="JP")
    location = Column(String, nullable=True)
    entities = Column(Text, nullable=True)
    serp_features = Column(Text, nullable=True)
    volume = Column(Integer, default=0)
    keyword_difficulty = Column(Float, default=0.0)
    cpc = Column(Float, default=0.0)
    organic_traffic = Column(Integer, default=0)
    paid_traffic = Column(Integer, default=0)
    current_position = Column(Integer, default=999)
    current_url = Column(Text, nullable=True)
    current_url_inside = Column(Boolean, default=False)
    updated = Column(DateTime, nullable=True)  # Original 'Updated' column from Ahrefs
    navigational = Column(Boolean, default=False)
    informational = Column(Boolean, default=False)
    commercial = Column(Boolean, default=False)
    transactional = Column(Boolean, default=False)
    branded = Column(Boolean, default=False)
    local = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class CompetitorSite(Base):
    __tablename__ = "competitor_sites"

    id = Column(Integer, primary_key=True, index=True)
    site_name = Column(String, unique=True, nullable=False)  # e.g., "tokyocheapo.com"
    display_name = Column(String, nullable=False)  # e.g., "Tokyo Cheapo"
    total_keywords = Column(Integer, default=0)
    total_traffic = Column(Integer, default=0)
    avg_position = Column(Float, default=0.0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
