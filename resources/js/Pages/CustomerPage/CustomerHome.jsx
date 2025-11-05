import React, { useState, useEffect } from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from '@inertiajs/react';
import CustomerWrapper from '@/CustomerComponents/CustomerWrapper';

const CustomerHome = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 105,
    hours: 2,
    minutes: 23,
    seconds: 50
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const { days, hours, minutes, seconds } = prev;
        
        // If already reached zero, don't decrement further
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          return prev;
        }
        
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        let newHours = hours;
        let newDays = days;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes = minutes - 1;
        }
        
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours = hours - 1;
        }
        
        if (newHours < 0) {
          newHours = 23;
          newDays = days - 1;
        }
        
        if (newDays < 0) {
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { 
          days: newDays, 
          hours: newHours, 
          minutes: newMinutes, 
          seconds: newSeconds 
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format numbers with leading zeros
  const formatNumber = (num, length = 2) => {
    return String(num).padStart(length, '0');
  };

  return (
    <CustomerWrapper>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center rounded-2xl bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(239, 146, 146, 0.4), rgba(137, 157, 186, 0.5)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070')`,
          }}
          role="img"
          aria-label="Mountain landscape background"
        />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto w-full">
          {/* Main Heading */}
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold mb-8 md:mb-12 tracking-wide">
            WE ARE LAUNCHING IN
          </h1>
          
          {/* Countdown Timer */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-12 mb-8 md:mb-12">
            <div className="text-white min-w-[80px]">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2">
                {formatNumber(timeLeft.days, 3)}
              </div>
              <div className="text-base md:text-lg lg:text-xl font-light">Days</div>
            </div>
            
            <div className="text-white min-w-[80px]">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2">
                {formatNumber(timeLeft.hours)}
              </div>
              <div className="text-base md:text-lg lg:text-xl font-light">Hours</div>
            </div>
            
            <div className="text-white min-w-[80px]">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2">
                {formatNumber(timeLeft.minutes)}
              </div>
              <div className="text-base md:text-lg lg:text-xl font-light">Minutes</div>
            </div>
            
            <div className="text-white min-w-[80px]">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2">
                {formatNumber(timeLeft.seconds)}
              </div>
              <div className="text-base md:text-lg lg:text-xl font-light">Seconds</div>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 md:mb-12">
            <button 
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 sm:px-10 py-3 rounded transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              onClick={() => console.log('Notify me clicked')}
            >
              NOTIFY ME
            </button>
            <Link
              href={'/'}
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-800 text-white font-semibold px-8 sm:px-10 py-3 rounded transition-colors duration-300 text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
            >
              Home
            </Link>
          </div>
          
          {/* Social Icons */}
          <div className="flex justify-center gap-6">
            <a 
              href="#" 
              className="text-white hover:text-pink-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full p-1"
              aria-label="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a 
              href="#" 
              className="text-white hover:text-pink-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full p-1"
              aria-label="Twitter"
            >
              <Twitter size={24} />
            </a>
            <a 
              href="#" 
              className="text-white hover:text-pink-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full p-1"
              aria-label="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a 
              href="#" 
              className="text-white hover:text-pink-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 rounded-full p-1"
              aria-label="Google Plus"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8h-5v5h5v-5z"/>
                <path d="M21 13h-2"/>
                <circle cx="9" cy="12" r="4"/>
                <path d="M9 8v8"/>
                <path d="M5 12h8"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </CustomerWrapper>
  );
};

export default CustomerHome;