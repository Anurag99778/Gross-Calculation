
import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import UploadPage from './pages/UploadPage'
import DashboardPage from './pages/DashboardPage'
import AskAIPage from './pages/AskAIPage'

// TODO: Add authentication guards
// TODO: Add route-level error boundaries
// TODO: Add loading states for route transitions
// TODO: Add route metadata for SEO

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/upload" replace />
      },
      {
        path: 'upload',
        element: <UploadPage />,
        // TODO: Add route metadata
        // TODO: Add breadcrumb navigation
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
        // TODO: Add route metadata
        // TODO: Add breadcrumb navigation
      },
      {
        path: 'ask',
        element: <AskAIPage />,
        // TODO: Add route metadata
        // TODO: Add breadcrumb navigation
      },
      // TODO: Add more routes as needed
      // - Settings page
      // - User profile
      // - Help/documentation
      // - Admin panel
    ]
  },
  // TODO: Add error routes
  // - 404 Not Found
  // - 500 Server Error
  // - Authentication required
  // - Access denied
])

export default router 