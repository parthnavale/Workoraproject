import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import StrongBeeIcon from './BeeIcon'
import SuccessModal from './SuccessModal'

const Footer: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    interest: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const interestOptions = [
    'Hiring Employee',
    'Finding Job',
    'Partnership Opportunities',
    'Investment Opportunities',
    'General Inquiry',
    'Technical Support',
    'Other'
  ]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([{
          full_name: contactForm.fullName,
          email: contactForm.email,
          phone: contactForm.phone || null,
          location: contactForm.location || null,
          interest: contactForm.interest,
          message: contactForm.message
        }])

      if (error) throw error

      setShowSuccessModal(true)
      setContactForm({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        interest: '',
        message: ''
      })
    } catch (error: any) {
      console.error('Contact form error:', error)
      if (error.message?.toLowerCase().includes('network')) {
        toast.error('Network error: Please check your internet connection or try again later.')
      } else if (error.message?.toLowerCase().includes('invalid api key')) {
        toast.error('Supabase credentials are invalid. Please contact support.')
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-yellow-500 p-2.5 rounded-xl relative shadow-lg">
                <StrongBeeIcon />
              </div>
              <span className="text-2xl font-bold">WÖRKORA</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Transforming India's on-demand workforce market by connecting businesses with employees in minutes.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>contact@workora.in</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <p>+91 9511779007</p>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">For Businesses</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Find Employee</li>
                  <li>Pricing</li>
                  <li>Safety & Trust</li>
                  <li>Support</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">For Employeement</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Find Jobs</li>
                  <li>How it Works</li>
                  <li>Safety</li>
                  <li>Earnings</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={contactForm.fullName}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter the Phone Number"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={contactForm.location}
                    onChange={handleContactChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-gray-300 mb-2">
                  I'm interested in... *
                </label>
                <select
                  id="interest"
                  name="interest"
                  required
                  value={contactForm.interest}
                  onChange={handleContactChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                >
                  <option value="">Select an option</option>
                  {interestOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Tell us about your interest, questions, or how you'd like to get involved..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-yellow-500 text-slate-900 py-3 px-6 rounded-lg font-semibold hover:bg-orange-400 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 WÖRKORA. All rights reserved. Made in India 🇮🇳</p>
        </div>
      </div>

      {/* Success Modal for Contact Form */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Thank You! 🙏"
        message="Your message helps us build a stronger community for businesses and employees. We appreciate your interest in WÖRKORA!"
        subMessage="Your response record has been saved. We'll keep you updated on our progress!"
      />
    </footer>
  )
}

export default Footer