
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  // TODO: Add layout features
  // - Sidebar navigation
  // - Breadcrumb navigation
  // - Footer
  // - Loading states
  // - Error boundaries

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* TODO: Add breadcrumb navigation */}
        {/* TODO: Add page header */}
        {/* TODO: Add loading indicators */}
        
        <Outlet />
        
        {/* TODO: Add footer */}
        {/* TODO: Add feedback widget */}
      </main>
    </div>
  )
} 