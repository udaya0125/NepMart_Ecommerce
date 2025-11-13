import React, { useState } from 'react';
import { Package, RotateCcw, DollarSign, Calendar, CheckCircle, XCircle, Truck, CreditCard, MessageSquare, ArrowRight } from 'lucide-react';
import Footer from '@/ContentWrapper/Footer';
import Navbar from '@/ContentWrapper/Navbar';

const ReturnAndRefund = () => {
  const [activeTab, setActiveTab] = useState('returns');

  const returnSteps = [
    {
      icon: Package,
      title: "Initiate Return",
      description: "Log into your account and select the item you want to return from your order history."
    },
    {
      icon: MessageSquare,
      title: "Select Reason",
      description: "Choose your return reason and provide any additional details to help us improve."
    },
    {
      icon: Truck,
      title: "Ship It Back",
      description: "Pack the item securely and ship it using the prepaid label we provide."
    },
    {
      icon: DollarSign,
      title: "Get Refunded",
      description: "Once we receive and inspect your return, we'll process your refund within 5-7 business days."
    }
  ];

  const eligibleItems = [
    { icon: CheckCircle, text: "Unused items in original packaging", eligible: true },
    { icon: CheckCircle, text: "Items with all tags and labels attached", eligible: true },
    { icon: CheckCircle, text: "Returns within 30 days of delivery", eligible: true },
    { icon: CheckCircle, text: "Items with proof of purchase", eligible: true },
    { icon: XCircle, text: "Final sale or clearance items", eligible: false },
    { icon: XCircle, text: "Personalized or custom-made products", eligible: false },
    { icon: XCircle, text: "Opened beauty or personal care items", eligible: false },
    { icon: XCircle, text: "Items without original packaging", eligible: false }
  ];

  const refundTimeline = [
    { day: "Day 1-2", event: "Return initiated and shipping label sent" },
    { day: "Day 3-7", event: "Item in transit to our warehouse" },
    { day: "Day 8-9", event: "Item received and inspection begins" },
    { day: "Day 10-12", event: "Refund processed to original payment method" },
    { day: "Day 13-17", event: "Refund appears in your account" }
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-[#EFE9E3]">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-[#EFE9E3] rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="w-10 h-10 text-gray-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Returns & Refunds
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We want you to love your purchase. If you're not completely satisfied, we're here to help.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-3xl font-light text-gray-900 mb-2">30 Days</h3>
            <p className="text-gray-600">Return Window</p>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center">
            <Truck className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-3xl font-light text-gray-900 mb-2">Free</h3>
            <p className="text-gray-600">Return Shipping</p>
          </div>
          <div className="bg-white rounded-2xl p-8 text-center">
            <CreditCard className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-3xl font-light text-gray-900 mb-2">5-7 Days</h3>
            <p className="text-gray-600">Refund Processing</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-8 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'returns'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Return Process
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-8 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'policy'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Return Policy
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-8 py-3 rounded-xl font-medium transition-colors ${
              activeTab === 'timeline'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Refund Timeline
          </button>
        </div>

        {/* Return Process Tab */}
        {activeTab === 'returns' && (
          <div className="bg-white rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-light text-gray-900 mb-8">How to Return Your Item</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {returnSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-[#EFE9E3] rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-gray-700" />
                      </div>
                      <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10 hidden lg:block" 
                           style={{ display: index === 3 ? 'none' : 'block' }} />
                      <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mx-auto mb-3">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-12 text-center">
              <button className="px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium inline-flex items-center gap-2">
                Start a Return
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Policy Tab */}
        {activeTab === 'policy' && (
          <div className="bg-white rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-light text-gray-900 mb-8">Return Policy Guidelines</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Eligible for Return
                </h3>
                <ul className="space-y-4">
                  {eligibleItems.filter(item => item.eligible).map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-6 flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-600" />
                  Not Eligible for Return
                </h3>
                <ul className="space-y-4">
                  {eligibleItems.filter(item => !item.eligible).map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <li key={index} className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="bg-[#EFE9E3] rounded-xl p-6">
              <h4 className="font-medium text-gray-900 mb-3">Important Notes</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Returns must be initiated within 30 days of delivery date</li>
                <li>• Original shipping costs are non-refundable</li>
                <li>• Sale items can be returned for store credit only</li>
                <li>• Exchanges are processed as returns and new orders</li>
                <li>• International returns may take longer to process</li>
              </ul>
            </div>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="bg-white rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-light text-gray-900 mb-8">Refund Processing Timeline</h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                
                {refundTimeline.map((step, index) => (
                  <div key={index} className="relative flex gap-6 mb-8 last:mb-0">
                    <div className="w-16 h-16 bg-[#EFE9E3] rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0 relative z-10">
                      {step.day}
                    </div>
                    <div className="flex-1 pt-3">
                      <p className="text-gray-900 font-medium">{step.event}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 bg-[#EFE9E3] rounded-xl p-6">
                <h4 className="font-medium text-gray-900 mb-3">Refund Methods</h4>
                <p className="text-gray-700 mb-4">
                  Refunds are processed based on your original payment method:
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>eSewa Payments:</strong> 24-48 hours (processed back to your eSewa wallet)</li>
                  <li>• <strong>Cash on Delivery (COD):</strong> 3-5 business days (processed via bank transfer to your registered account)</li>
                  <li>• <strong>Store Credit:</strong> Instant (available immediately for future purchases)</li>
                </ul>
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Note for COD Returns:</strong> For Cash on Delivery orders, please ensure your bank account details are verified in your profile for smooth refund processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Need Help with Your Return?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our customer support team is here to assist you with any questions about returns, 
            refunds, or exchanges. We're committed to making the process as smooth as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/help-support"
              className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
            >
              Contact Support
            </a>
            <a 
              href="/faq"
              className="px-8 py-3 bg-[#EFE9E3] text-gray-900 rounded-full hover:bg-gray-300 transition-colors font-medium"
            >
              View FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ReturnAndRefund;