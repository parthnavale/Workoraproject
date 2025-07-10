import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { WorkerRegistration } from '../types'
import { User, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import SuccessModal from '../components/SuccessModal'

const RegisterWorker: React.FC = () => {
  const { signUp } = useAuth()
  
  const [formData, setFormData] = useState<Omit<WorkerRegistration, 'id' | 'created_at' | 'availability'>>({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    skills: [],
    experience_years: 0,
    education_level: '',
    languages: [],
    has_vehicle: false,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    aadhar_number: '',
    work_description: ''
  })

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Skills focused on stores and shops work
  const skillOptions = [
    'Cashier', 'Customer Service', 'Sales Assistant', 'Store Associate',
    'Inventory Management', 'Stock Management', 'Product Display', 'Billing/POS Operation',
    'Cleaning & Maintenance', 'Reception/Front Desk', 'Order Taking', 'Product Delivery',
    'Store Security', 'Visual Merchandising', 'Product Packaging', 'Quality Check',
    'Store Helper', 'Floor Manager', 'Customer Support', 'Returns & Exchange'
  ]

  const educationLevels = [
    'Below 10th', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Professional Course'
  ]

  const languageOptions = [
    'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Punjabi', 'Malayalam'
  ]

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (name === 'has_vehicle') {
        setFormData(prev => ({ ...prev, [name]: checked }))
      }
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleMultiSelect = (name: keyof Pick<WorkerRegistration, 'skills' | 'languages'>, value: string) => {
    setFormData(prev => {
      const currentArray = prev[name] as string[]
      const isSelected = currentArray.includes(value)
      
      return {
        ...prev,
        [name]: isSelected 
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      }
    })
  }

  const validatePassword = (password: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long'
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number'
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate required fields
    if (!formData.full_name || !formData.email || !formData.phone || !formData.date_of_birth || 
        !formData.gender || !formData.address || !formData.city || !formData.state || 
        !formData.pincode || !formData.education_level || !formData.emergency_contact_name || 
        !formData.emergency_contact_phone || !formData.aadhar_number) {
      setError('Please fill in all required fields')
      setIsLoading(false)
      return
    }

    if (formData.skills.length === 0) {
      setError('Please select at least one skill')
      setIsLoading(false)
      return
    }

    if (formData.languages.length === 0) {
      setError('Please select at least one language')
      setIsLoading(false)
      return
    }

    // Validate password
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      // Create user account
      const user = await signUp(formData.email, password, 'worker')
      
      if (!user) {
        throw new Error('Failed to create user account')
      }

      // Add a default availability since it's required in the database
      const submissionData = {
        id: user.id, // Include user ID for RLS policy
        ...formData,
        availability: 'Immediate' // Default value since we removed the field
      }

      const { error: supabaseError } = await supabase
        .from('worker_registrations')
        .insert([submissionData])

      if (supabaseError) throw supabaseError

      setSuccess(true)
      toast.success('Registration successful! Welcome to WorkBee!')
      
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        skills: [],
        experience_years: 0,
        education_level: '',
        languages: [],
        has_vehicle: false,
        emergency_contact_name: '',
        emergency_contact_phone: '',
        aadhar_number: '',
        work_description: ''
      })
      setPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      console.error('Registration error:', err)
      
      // Handle specific error cases
      if (err.message?.includes('User already registered') || err.message?.includes('user_already_exists')) {
        setError('An account with this email already exists. Please sign in instead or use a different email address.')
      } else if (err.message?.includes('row-level security policy')) {
        setError('There was a security issue with your registration. Please try again or contact support.')
      } else {
        setError(err.message || 'Registration failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-orange-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Employee Registration</h1>
                <p className="text-orange-100">Join WorkBee - Work with stores & shops</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    required
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="aadhar_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Number *
                  </label>
                  <input
                    type="text"
                    id="aadhar_number"
                    name="aadhar_number"
                    required
                    pattern="[0-9]{12}"
                    value={formData.aadhar_number}
                    onChange={handleChange}
                    placeholder="Enter your 12-digit Aadhar number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                      placeholder="Enter strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Must contain 8+ characters, uppercase, lowercase, number & special character
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-12"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      id="state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      required
                      pattern="[0-9]{6}"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Experience */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Experience</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills * (Select all that apply - Store & Shop focused)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {skillOptions.map(skill => (
                      <label key={skill} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={() => handleMultiSelect('skills', skill)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span>{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="experience_years" className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience *
                    </label>
                    <input
                      type="number"
                      id="experience_years"
                      name="experience_years"
                      required
                      min="0"
                      max="50"
                      value={formData.experience_years}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="education_level" className="block text-sm font-medium text-gray-700 mb-2">
                      Education Level *
                    </label>
                    <select
                      id="education_level"
                      name="education_level"
                      required
                      value={formData.education_level}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select Education Level</option>
                      {educationLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="work_description" className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Work Experience
                  </label>
                  <textarea
                    id="work_description"
                    name="work_description"
                    rows={4}
                    value={formData.work_description}
                    onChange={handleChange}
                    placeholder="Describe your previous work experience in stores or shops. Include specific roles, responsibilities, and achievements..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Languages & Transportation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages & Transportation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Known * (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {languageOptions.map(language => (
                      <label key={language} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={() => handleMultiSelect('languages', language)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span>{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="has_vehicle"
                      checked={formData.has_vehicle}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">I have my own vehicle for transportation</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    required
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    required
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Note:</strong> Your information is secure and will be used only for job matching with stores and shops. All employees undergo background verification before activation.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating Account...' : 'Register as Employee'}
            </button>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={success}
        onClose={() => setSuccess(false)}
        title="Thank You! 🙏"
        message="Thank you for joining WÖRKORA!"
        subMessage="Your employee registration has been saved. We'll keep you updated on our progress!"
      />
    </div>
  )
}

export default RegisterWorker