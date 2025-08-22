
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/upload', label: 'Upload', icon: '📁' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/ask', label: 'Ask AI', icon: '🤖' }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl">🧮</div>
              <span className="text-xl font-bold text-gray-900">Gross Calculator</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* TODO: Add user profile dropdown */}
            {/* TODO: Add notifications */}
            {/* TODO: Add help/documentation link */}
            
            <div className="text-sm text-gray-500">
              {/* TODO: Show current user info */}
              User: Admin
            </div>
          </div>
        </div>
      </div>

      {/* TODO: Add mobile navigation menu */}
      {/* TODO: Add breadcrumb navigation */}
      {/* TODO: Add search functionality */}
    </nav>
  )
} 