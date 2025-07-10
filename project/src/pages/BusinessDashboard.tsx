import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, Clock, DollarSign, Users, Plus, Search, Filter, Bell, Star, CheckCircle, X, User, ShoppingCart, Store, Shirt, Smartphone, Book, Gift, Wrench, Gamepad2, Heart, Home, Car, Calendar, Navigation, Phone, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface JobRequest {
  id: string
  title: string
  description: string
  location: string
  duration: string
  pay: number
  payType: 'hourly' | 'daily' | 'fixed'
  skillsRequired: string[]
  urgency: 'immediate' | 'today' | 'tomorrow' | 'scheduled'
  scheduledDate?: string
  status: 'searching' | 'matched' | 'confirmed' | 'completed'
  createdAt: string
  matchedWorker?: Worker
}

interface Worker {
  id: string
  name: string
  rating: number
  completedJobs: number
  skills: string[]
  distance: string
  estimatedArrival: string
  profileImage?: string
  phone: string
  feedback: string[]
  confirmationCode: string
}

const BusinessDashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'book' | 'active' | 'history'>('book')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [jobRequests, setJobRequests] = useState<JobRequest[]>([])
  const [searchingJob, setSearchingJob] = useState<JobRequest | null>(null)
  const [showWorkerConfirmation, setShowWorkerConfirmation] = useState<JobRequest | null>(null)
  const [bookingsUsed, setBookingsUsed] = useState(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockJobs: JobRequest[] = [
      {
        id: '1',
        title: 'Cashier for Evening Shift',
        description: 'Need experienced cashier for busy evening hours',
        location: 'MG Road, Bangalore',
        duration: '4 hours',
        pay: 200,
        payType: 'hourly',
        skillsRequired: ['Cashier', 'Customer Service'],
        urgency: 'today',
        status: 'confirmed',
        createdAt: '2025-01-21T10:00:00Z',
        matchedWorker: {
          id: '1',
          name: 'Rajesh Kumar',
          rating: 4.8,
          completedJobs: 156,
          skills: ['Cashier', 'Customer Service'],
          distance: '2.3 km away',
          estimatedArrival: '15 mins',
          phone: '+91 98765 43210',
          feedback: ['Excellent service', 'Very punctual', 'Great with customers'],
          confirmationCode: 'WB2025'
        }
      }
    ]
    setJobRequests(mockJobs)
    setBookingsUsed(1) // Mock that 1 booking has been used
  }, [])

  const [bookingForm, setBookingForm] = useState({
    duration: '',
    pay: '',
    payType: 'hourly' as 'hourly' | 'daily' | 'fixed',
    urgency: 'today' as 'immediate' | 'today' | 'tomorrow' | 'scheduled',
    scheduledDate: ''
  })

  const workerTypes = [
    { id: 'cashier', name: 'Cashier', icon: DollarSign, description: 'Handle payments and customer transactions' },
    { id: 'sales', name: 'Sales Assistant', icon: ShoppingCart, description: 'Help customers and boost sales' },
    { id: 'store-helper', name: 'Store Helper', icon: Store, description: 'General store assistance and organization' },
    { id: 'inventory', name: 'Inventory Manager', icon: Users, description: 'Manage stock and inventory' },
    { id: 'fashion', name: 'Fashion Consultant', icon: Shirt, description: 'Fashion and clothing expertise' },
    { id: 'electronics', name: 'Electronics Expert', icon: Smartphone, description: 'Electronics and tech products' },
    { id: 'books', name: 'Book Store Assistant', icon: Book, description: 'Books and stationery knowledge' },
    { id: 'gifts', name: 'Gift Shop Helper', icon: Gift, description: 'Gift wrapping and customer service' },
    { id: 'hardware', name: 'Hardware Assistant', icon: Wrench, description: 'Hardware and tools expertise' },
    { id: 'toys', name: 'Toy Store Helper', icon: Gamepad2, description: 'Toys and games knowledge' },
    { id: 'pharmacy', name: 'Pharmacy Assistant', icon: Heart, description: 'Pharmacy and health products' },
    { id: 'home-decor', name: 'Home Decor Expert', icon: Home, description: 'Home decoration and furniture' }
  ]

  const [selectedWorkerType, setSelectedWorkerType] = useState<string | null>(null)

  const handleWorkerTypeSelect = (workerType: any) => {
    setSelectedWorkerType(workerType.id)
    setShowBookingModal(true)
  }

  const handleBookWorker = () => {
    // Check if user has exceeded free bookings
    if (bookingsUsed >= 3) {
      setShowUpgradeModal(true)
      return
    }

    if (!bookingForm.duration || !bookingForm.pay) {
      toast.error('Please fill in all required fields')
      return
    }

    if (bookingForm.urgency === 'scheduled' && !bookingForm.scheduledDate) {
      toast.error('Please select a date for scheduled booking')
      return
    }

    const selectedType = workerTypes.find(type => type.id === selectedWorkerType)
    
    const newJob: JobRequest = {
      id: Date.now().toString(),
      title: `${selectedType?.name} Needed`,
      description: selectedType?.description || '',
      location: 'Your Store Location', // This would come from business profile
      duration: bookingForm.duration,
      pay: parseFloat(bookingForm.pay),
      payType: bookingForm.payType,
      skillsRequired: [selectedType?.name || ''],
      urgency: bookingForm.urgency,
      scheduledDate: bookingForm.urgency === 'scheduled' ? bookingForm.scheduledDate : undefined,
      status: 'searching',
      createdAt: new Date().toISOString()
    }

    setJobRequests(prev => [newJob, ...prev])
    setSearchingJob(newJob)
    setShowBookingModal(false)
    setSelectedWorkerType(null)
    
    // Reset form
    setBookingForm({
      duration: '',
      pay: '',
      payType: 'hourly',
      urgency: 'today',
      scheduledDate: ''
    })

    toast.success('Searching for workers...')
    
    // Simulate finding a worker after 3 seconds
    setTimeout(() => {
      const mockWorker: Worker = {
        id: '2',
        name: 'Priya Sharma',
        rating: 4.9,
        completedJobs: 203,
        skills: ['Sales Assistant', 'Product Display'],
        distance: '1.8 km away',
        estimatedArrival: '12 mins',
        phone: '+91 98765 43211',
        feedback: ['Outstanding performance', 'Very reliable', 'Excellent customer skills'],
        confirmationCode: 'WB2026'
      }

      setJobRequests(prev => 
        prev.map(job => 
          job.id === newJob.id 
            ? { ...job, status: 'matched', matchedWorker: mockWorker }
            : job
        )
      )
      setSearchingJob(null)
      setShowWorkerConfirmation(prev => 
        prev?.id === newJob.id ? { ...newJob, status: 'matched', matchedWorker: mockWorker } : 
        { ...newJob, status: 'matched', matchedWorker: mockWorker }
      )
      toast.success('Perfect worker found!')
    }, 3000)
  }

  const confirmWorker = (jobId: string) => {
    setJobRequests(prev =>
      prev.map(job =>
        job.id === jobId
          ? { ...job, status: 'confirmed' }
          : job
      )
    )
    setShowWorkerConfirmation(null)
    setBookingsUsed(prev => prev + 1)
    toast.success('Worker confirmed! They will arrive soon.')
  }

  const handleUpgrade = () => {
    // Simulate upgrade process
    toast.success('Redirecting to payment...')
    setShowUpgradeModal(false)
    // In real app, redirect to payment page
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
              <p className="text-gray-600">Welcome back! Ready to find workers?</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Free Bookings</p>
                <p className="text-lg font-bold text-gray-900">{3 - bookingsUsed}/3 remaining</p>
              </div>
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobRequests.filter(j => j.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobRequests.filter(j => j.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Search className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Searching</p>
                <p className="text-2xl font-bold text-gray-900">
                  {jobRequests.filter(j => j.status === 'searching' || j.status === 'matched').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹12,450</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'book', label: 'Book Worker', icon: Plus },
                { key: 'active', label: 'Active Jobs', icon: Clock },
                { key: 'history', label: 'History', icon: CheckCircle }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'book' && (
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">What type of worker do you need?</h3>
                  <p className="text-gray-600">Select the type of worker that best fits your store's needs</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {workerTypes.map((workerType) => {
                    const IconComponent = workerType.icon
                    return (
                      <div
                        key={workerType.id}
                        onClick={() => handleWorkerTypeSelect(workerType)}
                        className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="text-center">
                          <div className="bg-yellow-100 group-hover:bg-yellow-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                            <IconComponent className="h-8 w-8 text-yellow-600" />
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{workerType.name}</h4>
                          <p className="text-sm text-gray-600">{workerType.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'active' && (
              <div className="space-y-6">
                {jobRequests.filter(job => job.status !== 'completed').map(job => (
                  <div key={job.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.description}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.status === 'searching' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'matched' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.status === 'searching' ? 'Searching...' :
                         job.status === 'matched' ? 'Worker Found' :
                         'Confirmed'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{job.duration}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-sm">₹{job.pay}/{job.payType}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{job.skillsRequired.join(', ')}</span>
                      </div>
                    </div>

                    {job.status === 'confirmed' && job.matchedWorker && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg">
                        <p className="text-green-800 font-medium mb-2">Worker confirmed! Confirmation Code: {job.matchedWorker.confirmationCode}</p>
                        <p className="text-green-700">Contact: {job.matchedWorker.phone}</p>
                      </div>
                    )}
                  </div>
                ))}

                {jobRequests.filter(job => job.status !== 'completed').length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Jobs</h3>
                    <p className="text-gray-600">Your active job requests will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                {jobRequests.filter(job => job.status === 'completed').map(job => (
                  <div key={job.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{job.location}</span>
                          <span>₹{job.pay}/{job.payType}</span>
                          <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}

                {jobRequests.filter(job => job.status === 'completed').length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Jobs</h3>
                    <p className="text-gray-600">Your completed jobs will appear here.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedWorkerType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Book Worker</h2>
              <button
                onClick={() => {
                  setShowBookingModal(false)
                  setSelectedWorkerType(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.createElement(workerTypes.find(type => type.id === selectedWorkerType)?.icon || Users, {
                    className: "h-8 w-8 text-yellow-600"
                  })}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {workerTypes.find(type => type.id === selectedWorkerType)?.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {workerTypes.find(type => type.id === selectedWorkerType)?.description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  value={bookingForm.duration}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 4 hours, 1 day, 2 weeks"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pay Amount *
                  </label>
                  <input
                    type="number"
                    value={bookingForm.pay}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, pay: e.target.value }))}
                    placeholder="Amount"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pay Type
                  </label>
                  <select
                    value={bookingForm.payType}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, payType: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="hourly">Per Hour</option>
                    <option value="daily">Per Day</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  When do you need them?
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { key: 'immediate', label: 'Right Now' },
                    { key: 'today', label: 'Today' },
                    { key: 'tomorrow', label: 'Tomorrow' },
                    { key: 'scheduled', label: 'Schedule' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBookingForm(prev => ({ ...prev, urgency: key as any }))}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        bookingForm.urgency === key
                          ? 'bg-yellow-500 text-slate-900'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {bookingForm.urgency === 'scheduled' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.scheduledDate}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowBookingModal(false)
                    setSelectedWorkerType(null)
                  }}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookWorker}
                  className="flex-1 py-3 px-6 bg-yellow-500 text-slate-900 rounded-lg font-medium hover:bg-orange-400 transition-colors"
                >
                  Find Workers
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Worker Confirmation Modal */}
      {showWorkerConfirmation && showWorkerConfirmation.matchedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Perfect Worker Found!</h2>
              <button
                onClick={() => setShowWorkerConfirmation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{showWorkerConfirmation.matchedWorker.name}</h3>
                <div className="flex items-center justify-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="font-medium">{showWorkerConfirmation.matchedWorker.rating}</span>
                  </div>
                  <span className="text-gray-600">{showWorkerConfirmation.matchedWorker.completedJobs} jobs completed</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Distance</p>
                      <p className="text-gray-600">{showWorkerConfirmation.matchedWorker.distance}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">ETA</p>
                      <p className="text-gray-600">{showWorkerConfirmation.matchedWorker.estimatedArrival}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Contact</p>
                      <p className="text-gray-600">{showWorkerConfirmation.matchedWorker.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {showWorkerConfirmation.matchedWorker.skills.map(skill => (
                        <span key={skill} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-2">Confirmation Code</p>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <p className="text-green-800 font-bold text-lg">{showWorkerConfirmation.matchedWorker.confirmationCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-2">Recent Feedback</p>
                <div className="space-y-2">
                  {showWorkerConfirmation.matchedWorker.feedback.map((feedback, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-700 text-sm">"{feedback}"</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="mb-6">
                <p className="font-medium text-gray-900 mb-2">Location & Route</p>
                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive map showing worker's location and route</p>
                    <p className="text-sm text-gray-500">ETA: {showWorkerConfirmation.matchedWorker.estimatedArrival}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowWorkerConfirmation(null)}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Find Another Worker
                </button>
                <button
                  onClick={() => confirmWorker(showWorkerConfirmation.id)}
                  className="flex-1 py-3 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm Worker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upgrade to Continue</h2>
              <p className="text-gray-600 mb-6">
                You've used all 3 free bookings! Upgrade to our premium plan for unlimited access.
              </p>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-gray-900 mb-2">Premium Plan - ₹149/month</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Unlimited worker bookings</li>
                  <li>✓ Priority matching</li>
                  <li>✓ 24/7 support</li>
                  <li>✓ Advanced analytics</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={handleUpgrade}
                  className="flex-1 py-3 px-6 bg-yellow-500 text-slate-900 rounded-lg font-medium hover:bg-orange-400 transition-colors"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Searching Modal */}
      {searchingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Finding the Perfect Worker...</h3>
            <p className="text-gray-600 mb-4">We're matching you with the best worker for your job.</p>
            <div className="text-sm text-gray-500">
              <p>Job: {searchingJob.title}</p>
              <p>Duration: {searchingJob.duration}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BusinessDashboard