import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import KeywordAnalysis from './pages/KeywordAnalysis'
import CompetitorAnalysis from './pages/CompetitorAnalysis'
import ContentRecommendations from './pages/ContentRecommendations'
import Settings from './pages/Settings'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/keywords" element={<KeywordAnalysis />} />
        <Route path="/competitors" element={<CompetitorAnalysis />} />
        <Route path="/content" element={<ContentRecommendations />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
