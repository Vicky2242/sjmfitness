import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import MembersPage from '../pages/MembersPage'
import PaymentsPage from '../pages/PaymentsPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProtectedRoute from '../components/auth/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'members', element: <MembersPage /> },
          { path: 'payments', element: <PaymentsPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
