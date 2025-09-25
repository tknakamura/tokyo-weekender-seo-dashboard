"""
Tokyo Weekender キーワードデータ処理スクリプト
"""
import pandas as pd
import numpy as np
import json
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import logging

# ログ設定
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class KeywordDataProcessor:
    """キーワードデータの処理・分析クラス"""
    
    def __init__(self, data_path: str):
        self.data_path = Path(data_path)
        self.df = None
        self.processed_data = {}
        
    def load_data(self) -> pd.DataFrame:
        """CSVデータを読み込み"""
        try:
            self.df = pd.read_csv(self.data_path)
            logger.info(f"データを読み込みました: {len(self.df)} 行")
            return self.df
        except Exception as e:
            logger.error(f"データ読み込みエラー: {e}")
            raise
    
    def clean_data(self) -> pd.DataFrame:
        """データクリーニング"""
        if self.df is None:
            raise ValueError("データが読み込まれていません")
        
        # 数値列の変換
        numeric_columns = ['Volume', 'KD', 'CPC', 'Organic traffic', 'Paid traffic', 'Current position']
        for col in numeric_columns:
            if col in self.df.columns:
                self.df[col] = pd.to_numeric(self.df[col], errors='coerce')
        
        # 欠損値の処理
        self.df['Volume'] = self.df['Volume'].fillna(0)
        self.df['KD'] = self.df['KD'].fillna(0)
        self.df['Current position'] = self.df['Current position'].fillna(999)
        
        # ブール値列の変換
        boolean_columns = ['Navigational', 'Informational', 'Commercial', 'Transactional', 'Branded', 'Local']
        for col in boolean_columns:
            if col in self.df.columns:
                self.df[col] = self.df[col].astype(bool)
        
        logger.info("データクリーニング完了")
        return self.df
    
    def analyze_performance(self) -> Dict:
        """パフォーマンス分析"""
        if self.df is None:
            raise ValueError("データが処理されていません")
        
        analysis = {}
        
        # 基本統計
        analysis['total_keywords'] = len(self.df)
        analysis['total_volume'] = self.df['Volume'].sum()
        analysis['total_traffic'] = self.df['Organic traffic'].sum()
        analysis['avg_position'] = self.df['Current position'].mean()
        
        # 順位別分析
        position_ranges = {
            'top_3': (1, 3),
            'top_10': (4, 10),
            'top_20': (11, 20),
            'top_50': (21, 50),
            'not_ranking': (51, 999)
        }
        
        position_analysis = {}
        for name, (min_pos, max_pos) in position_ranges.items():
            mask = (self.df['Current position'] >= min_pos) & (self.df['Current position'] <= max_pos)
            keywords_in_range = self.df[mask]
            position_analysis[name] = {
                'count': len(keywords_in_range),
                'percentage': len(keywords_in_range) / len(self.df) * 100,
                'total_volume': keywords_in_range['Volume'].sum(),
                'total_traffic': keywords_in_range['Organic traffic'].sum()
            }
        
        analysis['position_distribution'] = position_analysis
        
        # 意図別分析
        intent_analysis = {}
        intent_columns = ['Navigational', 'Informational', 'Commercial', 'Transactional', 'Branded', 'Local']
        
        for intent in intent_columns:
            if intent in self.df.columns:
                intent_keywords = self.df[self.df[intent] == True]
                intent_analysis[intent.lower()] = {
                    'count': len(intent_keywords),
                    'percentage': len(intent_keywords) / len(self.df) * 100,
                    'total_volume': intent_keywords['Volume'].sum(),
                    'avg_position': intent_keywords['Current position'].mean()
                }
        
        analysis['intent_distribution'] = intent_analysis
        
        # 高パフォーマンスキーワード
        high_performance = self.df[
            (self.df['Current position'] <= 10) & 
            (self.df['Volume'] >= 100)
        ].sort_values('Organic traffic', ascending=False)
        
        analysis['high_performance_keywords'] = high_performance.head(20).to_dict('records')
        
        # 改善機会キーワード
        improvement_opportunities = self.df[
            (self.df['Current position'] >= 11) & 
            (self.df['Current position'] <= 20) & 
            (self.df['Volume'] >= 50)
        ].sort_values('Volume', ascending=False)
        
        analysis['improvement_opportunities'] = improvement_opportunities.head(20).to_dict('records')
        
        return analysis
    
    def find_content_gaps(self) -> Dict:
        """コンテンツギャップ分析"""
        if self.df is None:
            raise ValueError("データが処理されていません")
        
        # 高ボリュームだが順位が低いキーワード
        high_volume_low_rank = self.df[
            (self.df['Volume'] >= 500) & 
            (self.df['Current position'] >= 21)
        ].sort_values('Volume', ascending=False)
        
        # 中ボリュームで順位改善の余地があるキーワード
        medium_volume_opportunity = self.df[
            (self.df['Volume'] >= 100) & 
            (self.df['Volume'] < 500) & 
            (self.df['Current position'] >= 11) & 
            (self.df['Current position'] <= 30)
        ].sort_values('Volume', ascending=False)
        
        return {
            'high_volume_gaps': high_volume_low_rank.head(15).to_dict('records'),
            'medium_volume_opportunities': medium_volume_opportunity.head(15).to_dict('records')
        }
    
    def analyze_serp_features(self) -> Dict:
        """SERP機能分析"""
        if self.df is None:
            raise ValueError("データが処理されていません")
        
        # SERP機能の分析
        serp_analysis = {}
        
        # SERP機能を持つキーワードの抽出
        serp_features = ['Sitelinks', 'People also ask', 'Local pack', 'Thumbnail', 'Video preview', 'Knowledge panel', 'AI Overview', 'Shopping']
        
        for feature in serp_features:
            mask = self.df['SERP features'].str.contains(feature, na=False)
            feature_keywords = self.df[mask]
            
            serp_analysis[feature] = {
                'count': len(feature_keywords),
                'percentage': len(feature_keywords) / len(self.df) * 100,
                'avg_volume': feature_keywords['Volume'].mean(),
                'avg_position': feature_keywords['Current position'].mean(),
                'total_traffic': feature_keywords['Organic traffic'].sum()
            }
        
        return serp_analysis
    
    def process_all(self) -> Dict:
        """全処理の実行"""
        logger.info("データ処理を開始します")
        
        # データ読み込み・クリーニング
        self.load_data()
        self.clean_data()
        
        # 各種分析の実行
        self.processed_data = {
            'performance_analysis': self.analyze_performance(),
            'content_gaps': self.find_content_gaps(),
            'serp_analysis': self.analyze_serp_features(),
            'summary_stats': {
                'total_keywords': len(self.df),
                'total_volume': self.df['Volume'].sum(),
                'total_traffic': self.df['Organic traffic'].sum(),
                'avg_position': self.df['Current position'].mean(),
                'top_performing_keywords': len(self.df[self.df['Current position'] <= 3])
            }
        }
        
        logger.info("データ処理完了")
        return self.processed_data
    
    def save_processed_data(self, output_path: str):
        """処理済みデータの保存"""
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # NumPy型をPython型に変換
        def convert_numpy_types(obj):
            if isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            elif isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, dict):
                return {key: convert_numpy_types(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_numpy_types(item) for item in obj]
            else:
                return obj
        
        converted_data = convert_numpy_types(self.processed_data)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(converted_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"処理済みデータを保存しました: {output_path}")

def main():
    """メイン処理"""
    # データファイルのパス
    data_file = "data/raw/www.tokyoweekender.com-organic-keywords-sub_2025-09-26_06-05-37.csv"
    output_file = "data/processed/tokyo_weekender_analysis.json"
    
    # データ処理の実行
    processor = KeywordDataProcessor(data_file)
    result = processor.process_all()
    
    # 結果の保存
    processor.save_processed_data(output_file)
    
    # サマリー表示
    print("\n=== Tokyo Weekender 分析結果サマリー ===")
    print(f"総キーワード数: {result['summary_stats']['total_keywords']:,}")
    print(f"総検索ボリューム: {result['summary_stats']['total_volume']:,}")
    print(f"総オーガニックトラフィック: {result['summary_stats']['total_traffic']:,}")
    print(f"平均順位: {result['summary_stats']['avg_position']:.1f}")
    print(f"トップ3キーワード数: {result['summary_stats']['top_performing_keywords']:,}")

if __name__ == "__main__":
    main()
