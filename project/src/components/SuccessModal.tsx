import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Home } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  subMessage?: string
  redirectPath?: string
  redirectLabel?: string
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  subMessage,
  redirectPath = "/",
  redirectLabel = "Back to Home"
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center relative">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        
        {subMessage && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm font-medium">{subMessage}</p>
          </div>
        )}
        
        <Link
          to={redirectPath}
          onClick={onClose}
          className="w-full bg-slate-800 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-700 transition-colors inline-flex items-center justify-center"
        >
          <Home className="h-4 w-4 mr-2" />
          {redirectLabel}
        </Link>
      </div>
    </div>
  )
}

export default SuccessModal