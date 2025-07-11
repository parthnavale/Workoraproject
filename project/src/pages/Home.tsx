import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Shield, Users, Star, CheckCircle, ArrowRight, Target, Award, MapPin, Zap, CreditCard, ChevronLeft, ChevronRight, User, Phone, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const Home: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [isSubmittingWaitlist, setIsSubmittingWaitlist] = useState(false)

  // Relevant store and shop images
  const heroImages = [
    {
      url: "https://indian-retailer.s3.ap-south-1.amazonaws.com/s3fs-public/2024-07/Top%20Grocery%20Brands%20in%20India_0.jpg",
      alt: "Busy retail store with customers and staff working together"
    },
    {
      url: "https://media.gettyimages.com/id/156259150/photo/a-shopkeeper-works-at-a-liquor-store-displaying-an-advertisement-for-united-spirits-ltd-s.jpg?s=612x612&w=0&k=20&c=SKFSzVXBlQEyhtQAYsQNKxf5FGJEgDR5Hsuhsmk0sDU=",
      alt: "Modern electronics store with organized displays"
    },
    {
      url: "https://restaurantindia.s3.ap-south-1.amazonaws.com/s3fs-public/content11354.jpg",
      alt: "Fashion retail store with clothing displays"
    },
    {
      url: "https://etimg.etb2bimg.com/photo/95662779.cms",
      alt: "Grocery store with fresh produce and customers"
    },
    {
      url: "https://arynews.tv/wp-content/uploads/2021/11/PSO.jpg",
      alt: "Pharmacy with organized shelves and professional staff"
    }
  ]

  // Auto-change images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  const nextImage = () => {
    setCurrentImageIndex(currentImageIndex === heroImages.length - 1 ? 0 : currentImageIndex + 1)
  }

  const prevImage = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!waitlistEmail) {
      toast.error('Please enter your email address')
      return
    }

    setIsSubmittingWaitlist(true)

    try {
      const { error } = await supabase
        .from('waitlist_signups')
        .insert([{
          email: waitlistEmail,
          signup_type: 'general',
          source: 'homepage_cta'
        }])

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('This email is already on our waitlist!')
        } else {
          throw error
        }
      } else {
        toast.success('🎉 You\'re on the waitlist! We\'ll notify you when we launch.')
        setWaitlistEmail('')
      }
    } catch (error: any) {
      console.error('Waitlist signup error:', error)
      if (error.message?.toLowerCase().includes('network')) {
        toast.error('Network error: Please check your internet connection or try again later.')
      } else if (error.message?.toLowerCase().includes('invalid api key')) {
        toast.error('Supabase credentials are invalid. Please contact support.')
      } else {
        toast.error('Failed to join waitlist. Please try again.')
      }
    } finally {
      setIsSubmittingWaitlist(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 text-white pt-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="z-10 relative">
              {/* Launching Soon Badge */}
              <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                🚀 Launching Soon in India
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Get Help
                <span className="text-yellow-500 block">in 10 Minutes</span>
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Transform your business with India's fastest on-demand workforce marketplace. Connect with verified employees instantly, or find flexible job opportunities near you.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-500">≤5 Min</div>
                  <div className="text-sm text-gray-400">Average Job Fill Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-500">24/7</div>
                  <div className="text-sm text-gray-400">Platform Availability</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-500">100%</div>
                  <div className="text-sm text-gray-400">Verified Employees</div>
                </div>
              </div>
            </div>
            
            {/* Interactive Hero Image Carousel */}
            <div className="relative">
              <div className="relative z-10 group">
                {/* Main Image Container */}
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <img 
                    src={heroImages[currentImageIndex].url}
                    alt={heroImages[currentImageIndex].alt}
                    className="w-full h-[500px] object-cover transition-all duration-500 ease-in-out"
                  />
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'bg-yellow-500 scale-110' 
                            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Employee Found!</p>
                      <p className="text-sm text-gray-600">2.3 km away</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-green-400/10 rounded-2xl transform -rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing India's stores and shops staffing with cutting-edge technology and unmatched reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Jobs filled in 5 minutes or less with our smart matching system
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trust & Safety</h3>
              <p className="text-gray-600">
                Aadhaar-KYC, background-checked & rated by peers
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                <MapPin className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Work From Your City</h3>
              <p className="text-gray-600">
                No long drives, no extra allowances. Find job opportunities near you
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                <CreditCard className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Payments</h3>
              <p className="text-gray-600">
                No more cash hassles—instant UPI payout after shift
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, fast, and reliable - get started in 3 easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Businesses */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Stores & Shops</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Post Your Requirement</h4>
                    <p className="text-gray-600">Describe your staffing need - store manager, sales assistant, store helper, or any other role for your store or shop.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Get Matched Instantly</h4>
                    <p className="text-gray-600">Our System finds the best employees with store and shop experience and sends you qualified candidates within minutes.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-500 text-slate-900 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Hire & Manage</h4>
                    <p className="text-gray-600">Select employees, track attendance, and make secure payments through our platform.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Employees */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">For Employees</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Create Your Profile</h4>
                    <p className="text-gray-600">Sign up for free, add your store and shop skills, experience, and preferences to get started.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Get Job Matches</h4>
                    <p className="text-gray-600">Receive notifications for store and shop jobs that match your skills and location preferences.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Work & Earn</h4>
                    <p className="text-gray-600">Accept jobs, complete work, and get paid directly to your account with full transparency.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trust & Safety First
            </h2>
            <p className="text-xl text-gray-600">
              Your security and peace of mind are our top priorities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Background Verified</h3>
              <p className="text-gray-600 text-sm">All employees undergo comprehensive background checks</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Insured Work</h3>
              <p className="text-gray-600 text-sm">All work is covered by comprehensive insurance</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rated & Reviewed</h3>
              <p className="text-gray-600 text-sm">Transparent rating system for quality assurance</p>
            </div>

            <div className="text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-slate-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600 text-sm">Digital payments with full transaction transparency</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About WÖRKORA
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're on a mission to revolutionize India's workforce marketplace by connecting businesses with required employees instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Vision</h3>
              <p className="text-gray-600 mb-6">
                WÖRKORA was born from a simple observation: businesses struggle to find reliable people quickly, 
                while people struggle to find consistent, well-paying opportunities. We saw an opportunity 
                to bridge this gap using technology.
              </p>
              <p className="text-gray-600 mb-6">
                Our platform leverages to connect the people with job in minutes, 
                not days. We focus on stores, shops, and retail businesses that need flexible staffing solutions.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">2025</div>
                  <div className="text-sm text-gray-600">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">India</div>
                  <div className="text-sm text-gray-600">Based in</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="/WorkBee (4).png"
                alt="WÖRKORA Logo"
                className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Our Mission</h4>
              <p className="text-gray-600">To make workforce management effortless for businesses and provide flexible earning opportunities for employees.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Our Values</h4>
              <p className="text-gray-600">Trust, transparency, and reliability form the foundation of every interaction on our platform.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Our Innovation</h4>
              <p className="text-gray-600">Cutting-edge technology meets human-centered design to create seamless experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Founders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Two passionate entrepreneurs committed to transforming India's workforce landscape through innovation and technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Founder */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src="/founder1.jpeg"
                  alt="Founder"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300 border-black"
                  style={{ borderWidth: '32px', borderStyle: 'solid' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold text-white">Ashupriya</p>
                  <p className="text-yellow-300">CEO</p>
                  <p className="text-yellow-300">Founder</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Strategy</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Product Vision</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Leadership</span>
                </div>
              </div>
            </div>

            {/* Co-Founder */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src="/founder2.jpeg"
                  alt="Co-Founder"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300 border-black"
                  style={{ borderWidth: '32px', borderStyle: 'solid' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-bold text-white">Parth</p>
                  <p className="text-yellow-300">CTO</p>
                  <p className="text-yellow-300">Co-Founder</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">Technology</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Innovation</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Engineering</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Shared Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Together, we're building more than just a platform – We believe Every shop owner deserves a lifeline in their moment of crisis – and every employee deserves dignity without leaving their hometown.
              </p>
              <div className="mt-6 flex justify-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">5+</div>
                  <div className="text-sm text-gray-600">Years Combined Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">100%</div>
                  <div className="text-sm text-gray-600">Committed to Success</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">24/7</div>
                  <div className="text-sm text-gray-600">Dedicated to Growth</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Waitlist */}
      <section id="contact" className="py-20 bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Workforce?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of businesses and employees already using WÖRKORA.
          </p>
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Get Early Access</h3>
              <p className="text-gray-300 mb-4">Be among the first to experience the future of workforce management.</p>
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <button 
                  type="submit"
                  disabled={isSubmittingWaitlist}
                  className="bg-yellow-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-orange-400 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmittingWaitlist ? 'Joining...' : 'Join Waitlist'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home