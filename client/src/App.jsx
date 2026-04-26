import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'

// Components
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Chatbot from './components/Chatbot'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Passengers from './pages/Passengers'
import Trains from './pages/Trains'
import SearchTrains from './pages/SearchTrains'
import Reservations from './pages/Reservations'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Railway System...</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155'
        }
      }}/>
      
      {user && <Navbar />}
      {user && <Chatbot />}
      
      <main className={`main-content ${!user ? 'full-width' : ''}`}>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="passengers" element={<Passengers />} />
            <Route path="trains" element={<Trains />} />
            <Route path="search" element={<SearchTrains />} />
            <Route path="reservations" element={<Reservations />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
