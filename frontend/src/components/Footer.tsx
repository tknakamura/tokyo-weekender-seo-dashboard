import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-600 font-medium">
            Tokyo Weekender SEO Dashboard
          </div>
          <div className="text-sm text-gray-700 font-semibold mt-2 sm:mt-0 flex items-center">
            <span className="mr-2">👨‍💻</span>
            Developed by Takeshi Nakamura
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
