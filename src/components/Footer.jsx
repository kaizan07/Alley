import React, { useState } from 'react';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaTiktok,
  FaTwitter,
  FaLinkedinIn 
} from 'react-icons/fa';
import { 
  MdEmail, 
  MdPhone, 
  MdLocationOn 
} from 'react-icons/md';
import { IoMdCheckbox } from 'react-icons/io';

function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', { email, isSubscribed });
  };

  return (
    <footer className="bg-[#dec0a0] text-stone-800 p-8 md:p-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        
        {/* Left Section*/}
        <div className="md:w-1/2 space-y-4">
          <h3 className="text-3xl md:text-4xl font-light text-stone-900 mb-6">
            Alley
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 hover:text-stone-600 transition-colors cursor-pointer">
              <MdPhone className="w-4 h-4 text-stone-600" />
              <p>123-456-7890</p>
            </div>
            <div className="flex items-center gap-3 hover:text-stone-600 transition-colors cursor-pointer">
              <MdEmail className="w-4 h-4 text-stone-600" />
              <p>info@alley.com</p>
            </div>
            <div className="flex items-center gap-3 text-stone-700">
              <MdLocationOn className="w-4 h-4 text-stone-600" />
              <p>India</p>
            </div>
          </div>

          {/*Icons */}
          <div className="flex space-x-4 pt-6">
            <a 
              href="#" 
              className="w-10 h-10 bg-stone-700 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-stone-700 hover:bg-pink-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105"
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-stone-700 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105"
              aria-label="YouTube"
            >
              <FaYoutube className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-stone-700 hover:bg-blue-400 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105"
              aria-label="Twitter"
            >
              <FaTwitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right Section*/}
        <div className="md:w-1/2 space-y-4">
          <h4 className="text-lg font-medium text-stone-900 mb-4">
            Explore More with Alley
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 pl-10 border border-stone-400 bg-white/90 rounded-md text-sm focus:outline-none focus:border-stone-600 focus:ring-2 focus:ring-stone-200 transition-all"
                  placeholder="Enter your email address"
                />
                <MdEmail className="absolute left-3 top-3.5 w-4 h-4 text-stone-500" />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={isSubscribed}
                  onChange={(e) => setIsSubscribed(e.target.checked)}
                  className="sr-only"
                />
                <label 
                  htmlFor="newsletter" 
                  className="flex items-center cursor-pointer"
                >
                  <div className={`w-5 h-5 border-2 border-stone-400 rounded flex items-center justify-center transition-all ${
                    isSubscribed ? 'bg-stone-700 border-stone-700' : 'bg-white'
                  }`}>
                    {isSubscribed && (
                      <IoMdCheckbox className="w-3 h-3 text-white" />
                    )}
                  </div>
                </label>
              </div>
              <label htmlFor="newsletter" className="text-sm text-stone-700 leading-relaxed cursor-pointer">
                Yes, subscribe me to your newsletter. *
              </label>
            </div>

            <button
              type="submit"
              className="bg-transparent border border-stone-800 px-6 py-2 text-stone-800 hover:bg-stone-800 hover:text-white transition-all duration-300 text-sm font-medium rounded-md transform hover:scale-105"
            >
              Subscribe
            </button>
          </form>

          {/* Footer*/}
          <div className="pt-6 space-y-1">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
              <a href="#" className="hover:text-stone-800 transition-colors underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-stone-800 transition-colors underline">
                Accessibility Statement
              </a>
              <a href="#" className="hover:text-stone-800 transition-colors underline">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-stone-800 transition-colors underline">
                Refund Policy
              </a>
              <a href="#" className="hover:text-stone-800 transition-colors underline">
                Shipping Policy
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-4 border-t border-stone-300">
            <p className="text-xs text-stone-600">
              © 2025 by Alley. Powered and secured by Wix
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
