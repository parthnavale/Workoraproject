import React, { useState } from 'react'
import { CreditCard, Check, Star, Shield, Clock, Users } from 'lucide-react'

const Payment: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise'>('basic')
  const [isProcessing, setIsProcessing] = useState(false)

  const plans = {
    basic: {
      name: 'Basic Plan',
      price: '₹999',
      period: '/month',
      description: 'Perfect for small restaurants and stores',
      features: [
        'Up to 10 worker bookings per month',
        'Basic worker matching',
        'Email support',
        'Standard background verification',
        'Digital payment processing'
      ],
      popular: false
    },
    premium: {
      name: 'Premium Plan',
      price: '₹1,999',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 50 worker bookings per month',
        'AI-powered smart matching',
        'Priority phone & email support',
        'Enhanced background verification',
        'Digital payment processing',
        'Worker performance analytics',
        'Bulk booking discounts'
      ],
      popular: true
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: '₹4,999',
      period: '/month',
      description: 'For large chains and businesses',
      features: [
        'Unlimited worker bookings',
        'Advanced AI matching with preferences',
        '24/7 dedicated support manager',
        'Premium background verification',
        'Digital payment processing',
        'Advanced analytics & reporting',
        'Custom integrations',
        'Multi-location management'
      ],
      popular: false
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      alert('Payment successful! Welcome to WorkBee Premium. You can now start posting jobs.')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start hiring skilled workers for your restaurant or store. All plans include our core features with different booking limits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all ${
                selectedPlan === key 
                  ? 'ring-2 ring-yellow-500 transform scale-105' 
                  : 'hover:shadow-xl'
              } ${plan.popular ? 'border-2 border-yellow-500' : ''}`}
              onClick={() => setSelectedPlan(key as 'basic' | 'premium' | 'enterprise')}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-500 text-slate-900 px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-1">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                  selectedPlan === key 
                    ? 'bg-yellow-500 border-yellow-500' 
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === key && (
                    <Check className="h-4 w-4 text-slate-900 m-0.5" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-3 mb-6">
              <CreditCard className="h-8 w-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            </div>

            {/* Selected Plan Summary */}
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{plans[selectedPlan].name}</h3>
                  <p className="text-gray-600">{plans[selectedPlan].description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {plans[selectedPlan].price}
                    <span className="text-sm font-normal text-gray-600">/month</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>PCI Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Instant Activation</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full bg-yellow-500 text-slate-900 py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-400 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing Payment...' : `Pay ${plans[selectedPlan].price} & Start Hiring`}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>By proceeding, you agree to our Terms of Service and Privacy Policy.</p>
              <p className="mt-2">Cancel anytime. No hidden fees.</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What You Get With WÖRKORA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Hiring</h3>
              <p className="text-gray-600">Get matched with qualified workers in under 5 minutes</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Workers</h3>
              <p className="text-gray-600">All workers are background checked and verified</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Get help whenever you need it with our support team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment