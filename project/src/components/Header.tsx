import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X } from 'lucide-react'
import StrongBeeIcon from './BeeIcon'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const location = useLocation()
  const { user, userType } = useAuth()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-slate-800 shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-yellow-500 p-2.5 rounded-xl relative shadow-lg transform hover:scale-105 transition-transform">
              <StrongBeeIcon />
            </div>
            <span className="text-2xl font-bold text-white">WÖRKORA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {!user ? (
              <>
                <Link
                  to="/#about"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-gray-300 hover:text-yellow-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to="/#contact"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-gray-300 hover:text-yellow-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
                <Link
                  to="/#team"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-gray-300 hover:text-yellow-500 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Team
                </Link>
              </>
            ) : (
              <Link
                to={userType === 'business' ? '/business-dashboard' : '/worker-dashboard'}
                className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-medium hover:bg-orange-400 transition-colors"
              >
                
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-yellow-500 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 border-t border-slate-700">
              {!user ? (
                <>
                  <Link
                    to="/#about"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                      setIsMenuOpen(false)
                    }}
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-yellow-500"
                  >
                    About Us
                  </Link>
                  <Link
                    to="/#contact"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                      setIsMenuOpen(false)
                    }}
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-yellow-500"
                  >
                    Contact
                  </Link>
                  <Link
                    to="/#team"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })
                      setIsMenuOpen(false)
                    }}
                    className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-yellow-500"
                  >
                    Team
                  </Link>
                </>
              ) : (
                <Link
                  to={userType === 'business' ? '/business-dashboard' : '/worker-dashboard'}
                  className="block px-3 py-2 text-base font-medium text-yellow-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header