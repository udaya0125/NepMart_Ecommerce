import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Package, CreditCard, Truck, RotateCcw, Shield, User, HelpCircle, MessageCircle } from 'lucide-react';
import Footer from '@/ContentWrapper/Footer';
import Navbar from '@/ContentWrapper/Navbar';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestion, setOpenQuestion] = useState(null);

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'returns', name: 'Returns', icon: RotateCcw },
    { id: 'account', name: 'Account', icon: User },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const faqs = [
    {
      category: 'orders',
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'My Orders' section. Click on the order you want to track, and you'll see real-time updates on your shipment's location and estimated delivery date."
    },
    {
      category: 'orders',
      question: "Can I modify or cancel my order?",
      answer: "You can modify or cancel your order within 1 hour of placing it. After this window, orders enter our fulfillment process and cannot be changed. If you need to make changes after 1 hour, please contact our customer support team immediately. We'll do our best to help, but once the order ships, you'll need to use our return process."
    },
    {
      category: 'orders',
      question: "What should I do if I receive the wrong item?",
      answer: "We apologize for any mix-up! Please contact our customer support within 7 days of receiving your order. Include your order number and photos of the item received. We'll arrange for a return of the incorrect item at no cost to you and send you the correct item immediately with expedited shipping."
    },
    {
      category: 'shipping',
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days, Express shipping delivers in 2-3 business days, and Overnight shipping arrives the next business day. International orders typically take 10-15 business days. All timeframes start from the date your order ships, not the date it's placed. You'll receive a shipping confirmation email once your order leaves our warehouse."
    },
    {
      category: 'shipping',
      question: "Do you ship internationally?",
      answer: "Yes! We ship to over 100 countries worldwide. International shipping costs and delivery times vary by destination. You can view available shipping options and costs for your country during checkout. Please note that international orders may be subject to customs duties and taxes, which are the responsibility of the recipient."
    },
    {
      category: 'shipping',
      question: "What if my package is lost or stolen?",
      answer: "If your tracking shows the package was delivered but you didn't receive it, first check with neighbors and your building's management. If you still can't locate it, contact us within 7 days. We'll work with the shipping carrier to investigate. For lost packages, we'll either send a replacement or provide a full refund once the carrier confirms the loss."
    },
    {
      category: 'payment',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are secured with 256-bit SSL encryption. We also offer buy now, pay later options through Affirm and Klarna for orders over $50."
    },
    {
      category: 'payment',
      question: "Is it safe to use my credit card on your site?",
      answer: "Absolutely! We use industry-standard SSL encryption to protect all transactions. We're PCI-DSS Level 1 compliant, the highest level of payment security certification. We never store your complete credit card information on our servers. All payment processing is handled through secure, encrypted connections with our payment partners."
    },
    {
      category: 'payment',
      question: "When will I be charged for my order?",
      answer: "Your payment method is authorized when you place your order, but you're not charged until your order ships. For pre-orders, you'll be charged when the item becomes available and is ready to ship. If an order contains multiple items that ship separately, you'll be charged for each item as it ships."
    },
    {
      category: 'returns',
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Products must be unused, in original packaging, and with all tags attached. To initiate a return, log into your account, go to 'My Orders', and select the item you want to return. We provide free return shipping labels for US orders. Once we receive and inspect your return, refunds are processed within 5-7 business days."
    },
    {
      category: 'returns',
      question: "How long does it take to get a refund?",
      answer: "Once we receive your return, we inspect it within 2-3 business days. After approval, refunds are processed within 5-7 business days. The time it takes for the refund to appear in your account depends on your payment method: credit/debit cards take 5-10 business days, PayPal takes 3-5 business days, and store credit is instant."
    },
    {
      category: 'returns',
      question: "Can I exchange an item instead of returning it?",
      answer: "We currently process exchanges as returns and new orders to ensure you get your replacement item as quickly as possible. Simply return the original item and place a new order for the item you want. If you're concerned about price changes, contact our support team before processing the exchange."
    },
    {
      category: 'account',
      question: "How do I create an account?",
      answer: "Click 'Sign Up' at the top of any page and provide your email address and create a password. You can also sign up using your Google, Facebook, or Apple account for faster registration. Having an account allows you to track orders, save shipping addresses, view order history, and access exclusive member benefits."
    },
    {
      category: 'account',
      question: "I forgot my password. How do I reset it?",
      answer: "Click 'Sign In' and then 'Forgot Password'. Enter your email address, and we'll send you a password reset link. The link expires after 24 hours for security. If you don't receive the email within 10 minutes, check your spam folder or try requesting another reset link."
    },
    {
      category: 'account',
      question: "How do I update my account information?",
      answer: "Log into your account and click on 'Account Settings' or your profile icon. From there, you can update your name, email address, password, shipping addresses, and payment methods. You can also manage your communication preferences and view your order history."
    },
    {
      category: 'security',
      question: "How do you protect my personal information?",
      answer: "We take your privacy seriously. All data is encrypted using SSL technology, we're GDPR and CCPA compliant, and we never sell your personal information to third parties. Our servers are regularly audited for security vulnerabilities. You can read our full Privacy Policy for detailed information about how we collect, use, and protect your data."
    },
    {
      category: 'security',
      question: "Do you use cookies on your website?",
      answer: "Yes, we use cookies to enhance your browsing experience, remember your preferences, and analyze site traffic. Essential cookies are necessary for the site to function, while analytics and marketing cookies help us improve our services. You can manage your cookie preferences through your browser settings or our cookie consent banner."
    },
    {
      category: 'security',
      question: "What should I do if I suspect unauthorized account activity?",
      answer: "If you notice any suspicious activity on your account, immediately change your password and contact our security team at security@store.com. We'll investigate the issue, secure your account, and help you review any unauthorized orders. We recommend enabling two-factor authentication for added account security."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <>
    <Navbar/>
    <div className="">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-[#EFE9E3] rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-10 h-10 text-gray-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Find quick answers to common questions about shopping with us
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="flex overflow-x-auto gap-3 mb-12 pb-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                  activeCategory === category.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl p-8 md:p-12 mb-12">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 last:border-0">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full py-6 flex items-center justify-between text-left hover:text-gray-600 transition-colors group"
                  >
                    <span className="text-lg font-medium text-gray-900 pr-4 group-hover:text-gray-700">
                      {faq.question}
                    </span>
                    {openQuestion === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openQuestion === index && (
                    <div className="pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No results found</p>
              <p className="text-gray-400">Try adjusting your search or filter</p>
            </div>
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <MessageCircle className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Can't find the answer you're looking for? Our customer support team is here to help. 
              We typically respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/help-support"
                className="px-8 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                Contact Support
              </a>
              <a 
                href="mailto:support@store.com"
                className="px-8 py-3 bg-[#EFE9E3] text-gray-900 rounded-full hover:bg-gray-300 transition-colors font-medium"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <a 
            href="/returns-refunds"
            className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow group"
          >
            <RotateCcw className="w-8 h-8 text-gray-700 mb-3 group-hover:rotate-180 transition-transform duration-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Returns & Refunds</h3>
            <p className="text-sm text-gray-600">Learn about our return policy and process</p>
          </a>
          
          <a 
            href="/privacy-security"
            className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow group"
          >
            <Shield className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy & Security</h3>
            <p className="text-sm text-gray-600">How we protect your information</p>
          </a>
          
          <a 
            href="/shipping-info"
            className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow group"
          >
            <Truck className="w-8 h-8 text-gray-700 mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Information</h3>
            <p className="text-sm text-gray-600">View shipping options and rates</p>
          </a>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default FAQPage;