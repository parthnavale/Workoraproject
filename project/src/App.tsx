import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Payment from './pages/Payment'
import BusinessDashboard from './pages/BusinessDashboard'
import WorkerDashboard from './pages/WorkerDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/payment" element={<Payment />} />
            <Route 
              path="/business-dashboard" 
              element={
                <ProtectedRoute userType="business">
                  <BusinessDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/worker-dashboard" 
              element={
                <ProtectedRoute userType="worker">
                  <WorkerDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App