import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MapPin, Clock, DollarSign, Star, Bell, CheckCircle, X, User, Calendar, TrendingUp, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

interface JobNotification {
  id: string
  title: string
  businessName: string
  location: string
  distance: string
  duration: string
  pay: number
  payType: 'hourly' | 'daily' | 'fixed'
  skillsRequired: string[]
  urgency: string
  description: string
  estimatedEarnings: number
  createdAt: string
  status: 'pending' | 'accepted' | 'declined' | 'completed'
}

const WorkerDashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<'jobs' | 'active' | 'earnings' | 'profile'>('jobs')
  const [jobNotifications, setJobNotifications] = useState<JobNotification[]>([])
  const [showJobModal, setShowJobModal] = useState<JobNotification | null>(null)
  const [hasActiveJob, setHasActiveJob] = useState(false)

  // Mock data for demonstration
  useEffect(() => {
    const mockJobs: JobNotification[] = [
      {
        id: '1',
        title: 'Cashier Needed - Evening Shift',
        businessName: 'City Electronics Store',
        location: 'MG Road, Bangalore',
        distance: '2.3 km away',
        duration: '4 hours',
        pay: 200,
        payType: 'hourly',
        skillsRequired: ['Cashier', 'Customer Service'],
        urgency: 'Immediate',
        description: 'We need an experienced cashier for our busy evening hours. Must be able to handle POS systems and provide excellent customer service.',
        estimatedEarnings: 800,
        createdAt: '2025-01-21T18:00:00Z',
        status: 'pending'
      },
      {
        id: '2',
        title: 'Sales Assistant - Weekend Shift',
        businessName: 'Fashion Hub Store',
        location: 'Brigade Road, Bangalore',
        distance: '1.8 km away',
        duration: '8 hours',
        pay: 1500,
        payType: 'daily',
        skillsRequired: ['Sales Assistant', 'Customer Service'],
        urgency: 'Tomorrow',
        description: 'Looking for a reliable sales assistant for weekend operations. Experience with fashion retail preferred.',
        estimatedEarnings: 1500,
        createdAt: '2025-01-21T16:30:00Z',
        status: 'pending'
      },
      {
        id: '3',
        title: 'Store Helper - Morning Shift',
        businessName: 'Grocery Mart',
        location: 'Koramangala, Bangalore',
        distance: '3.1 km away',
        duration: '6 hours',
        pay: 150,
        payType: 'hourly',
        skillsRequired: ['Store Helper', 'Inventory Management'],
        urgency: 'Today',
        description: 'Help with morning stock arrangement and customer assistance. Early morning shift starting 6 AM.',
        estimatedEarnings: 900,
        createdAt: '2025-01-21T15:00:00Z',
        status: 'accepted'
      }
    ]
    setJobNotifications(mockJobs)
    
    // Check if there's an active job
    const activeJob = mockJobs.find(job => job.status === 'accepted')
    setHasActiveJob(!!activeJob)
  }, [])

  const acceptJob = (jobId: string) => {
    // Check if worker already has an active job
    if (hasActiveJob) {
      toast.error('You must complete your current job before accepting a new one.')
      return
    }

    setJobNotifications(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, status: 'accepted' } : job
      )
    )
    setHasActiveJob(true)
    setShowJobModal(null)
    toast.success('Job accepted! Check your active jobs.')
  }

  const declineJob = (jobId: string) => {
    setJobNotifications(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, status: 'declined' } : job
      )
    )
    setShowJobModal(null)
    toast.success('Job declined.')
  }

  const completeJob = (jobId: string) => {
    setJobNotifications(prev =>
      prev.map(job =>
        job.id === jobId ? { ...job, status: 'completed' } : job
      )
    )
    setHasActiveJob(false)
    toast.success('Job completed! Payment will be processed shortly.')
  }

  const pendingJobs = jobNotifications.filter(job => job.status === 'pending')
  const activeJobs = jobNotifications.filter(job => job.status === 'accepted')
  const completedJobs = jobNotifications.filter(job => job.status === 'completed')

  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.estimatedEarnings, 0)
  const thisWeekEarnings = 3450 // Mock data
  const completedJobsCount = completedJobs.length + 23 // Mock additional completed jobs

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Worker Dashboard</h1>
              <p className="text-gray-600">Find flexible work opportunities near you</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {pendingJobs.length}
                </span>
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

        {/* Active Job Alert */}
        {hasActiveJob && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">You have an active job in progress</p>
                <p className="text-sm text-orange-700">Complete your current job before accepting new ones</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Bell className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">New Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{pendingJobs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{activeJobs.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{completedJobsCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">₹{thisWeekEarnings}</p>
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
                { key: 'jobs', label: 'Available Jobs', icon: Bell },
                { key: 'active', label: 'Active Jobs', icon: Clock },
                { key: 'earnings', label: 'Earnings', icon: TrendingUp },
                { key: 'profile', label: 'Profile', icon: User }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  {key === 'jobs' && pendingJobs.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingJobs.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                {pendingJobs.length > 0 ? (
                  pendingJobs.map(job => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-gray-600">{job.businessName}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">₹{job.estimatedEarnings}</div>
                          <div className="text-sm text-gray-500">Estimated earnings</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-medium">{job.location}</div>
                            <div className="text-xs">{job.distance}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-medium">{job.duration}</div>
                            <div className="text-xs">{job.urgency}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-medium">₹{job.pay}/{job.payType}</div>
                            <div className="text-xs">Pay rate</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Star className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-medium">{job.skillsRequired.join(', ')}</div>
                            <div className="text-xs">Skills needed</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={() => setShowJobModal(job)}
                          className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => acceptJob(job.id)}
                          disabled={hasActiveJob}
                          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                            hasActiveJob 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                        >
                          {hasActiveJob ? 'Complete Current Job First' : 'Accept Job'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No New Jobs</h3>
                    <p className="text-gray-600">New job opportunities will appear here when available.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'active' && (
              <div className="space-y-6">
                {activeJobs.length > 0 ? (
                  activeJobs.map(job => (
                    <div key={job.id} className="border border-green-200 bg-green-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-gray-600">{job.businessName}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Active
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
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Today</span>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg mb-4">
                        <p className="text-green-800 font-medium mb-2">Job in progress! Please arrive on time and contact the business if needed.</p>
                        <p className="text-sm text-gray-600">Remember to maintain professional conduct and provide excellent service.</p>
                      </div>

                      <button
                        onClick={() => completeJob(job.id)}
                        className="w-full py-3 px-6 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        Mark as Completed
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Active Jobs</h3>
                    <p className="text-gray-600">Your accepted jobs will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
                    <p className="text-3xl font-bold">₹{totalEarnings + 45670}</p>
                    <p className="text-green-100 text-sm">All time</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">This Month</h3>
                    <p className="text-3xl font-bold">₹12,450</p>
                    <p className="text-blue-100 text-sm">+23% from last month</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2">This Week</h3>
                    <p className="text-3xl font-bold">₹{thisWeekEarnings}</p>
                    <p className="text-orange-100 text-sm">5 jobs completed</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Earnings</h3>
                  <div className="space-y-4">
                    {[
                      { date: '2025-01-21', job: 'Cashier - Evening Shift', business: 'City Electronics', amount: 800 },
                      { date: '2025-01-20', job: 'Sales Assistant - Weekend', business: 'Fashion Hub', amount: 1500 },
                      { date: '2025-01-19', job: 'Store Helper', business: 'Grocery Mart', amount: 900 },
                      { date: '2025-01-18', job: 'Store Associate', business: 'Mobile Store', amount: 1250 }
                    ].map((earning, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                        <div>
                          <p className="font-medium text-gray-900">{earning.job}</p>
                          <p className="text-sm text-gray-600">{earning.business} • {earning.date}</p>
                        </div>
                        <p className="font-semibold text-green-600">+₹{earning.amount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <div className="text-center mb-8">
                  <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Rajesh Kumar</h2>
                  <p className="text-gray-600">Experienced Store & Shop Worker</p>
                  <div className="flex items-center justify-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">4.8 Rating</span>
                    </div>
                    <div className="text-sm text-gray-600">{completedJobsCount} Jobs Completed</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Cashier', 'Sales Assistant', 'Customer Service', 'Store Helper', 'POS Operation'].map(skill => (
                        <span key={skill} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Hindi', 'English', 'Kannada'].map(language => (
                        <span key={language} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Experience</h3>
                    <p className="text-gray-600">3 years of experience in stores and shops. Specialized in customer service and retail operations.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Job Details</h2>
              <button
                onClick={() => setShowJobModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{showJobModal.title}</h3>
                <p className="text-gray-600 mb-4">{showJobModal.businessName}</p>
                <p className="text-gray-700">{showJobModal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{showJobModal.location}</p>
                      <p className="text-sm text-gray-500">{showJobModal.distance}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Duration</p>
                      <p className="text-gray-600">{showJobModal.duration}</p>
                      <p className="text-sm text-gray-500">Urgency: {showJobModal.urgency}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Payment</p>
                      <p className="text-gray-600">₹{showJobModal.pay}/{showJobModal.payType}</p>
                      <p className="text-sm text-green-600 font-medium">Est. ₹{showJobModal.estimatedEarnings}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Skills Required</p>
                      <p className="text-gray-600">{showJobModal.skillsRequired.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => declineJob(showJobModal.id)}
                  className="flex-1 py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={() => acceptJob(showJobModal.id)}
                  disabled={hasActiveJob}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    hasActiveJob 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {hasActiveJob ? 'Complete Current Job First' : 'Accept Job'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkerDashboard