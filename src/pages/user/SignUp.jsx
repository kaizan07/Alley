import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setIsError(true);
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsError(false);
        setMessage('Registration successful! Please log in.');
        setTimeout(() => {
          setMessage('');
          navigate('/login');
        }, 1500);
      } else {
        setIsError(true);
        setMessage(data.error || 'Registration failed.');
      }
    } catch (error) {
      console.error("Registration error:", error);
      setIsError(true);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter overflow-hidden relative">
      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(15px) rotate(5deg); }
          75% { transform: translateY(20px) translateX(-15px) rotate(-5deg); }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-border {
          0% { box-shadow: 0 0 0 0px rgba(251, 191, 36, 0.7); }
          50% { box-shadow: 0 0 0 4px rgba(251, 191, 36, 0); }
          100% { box-shadow: 0 0 0 0px rgba(251, 191, 36, 0.7); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.7s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.4s ease-out forwards; }
        .animate-float { animation: float 12s ease-in-out infinite; }
        .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
        .animate-pulse-border:focus { animation: pulse-border 1.5s infinite; }
        `}
      </style>

      {/* Floating shapes */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-amber-100 rounded-[40%_60%_70%_30%_/_60%_40%_60%_40%] transform -translate-x-1/2 -translate-y-1/2 opacity-80 shadow-xl animate-float"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 sm:w-60 sm:h-60 bg-stone-600 rounded-3xl rotate-45 opacity-80 shadow-xl animate-float animate-rotate-slow"></div>
      <div className="absolute top-1/2 left-0 w-32 h-16 bg-amber-800 rounded-full transform -translate-x-1/2 opacity-70 shadow-lg hidden md:block animate-float"></div>
      <div className="absolute bottom-0 right-1/2 w-24 h-24 bg-amber-100 rounded-full transform translate-x-1/2 translate-y-1/2 opacity-70 shadow-lg hidden md:block animate-float animate-rotate-slow"></div>
      <div className="absolute top-0 right-0 w-40 h-40 bg-stone-300 rounded-bl-full opacity-60 shadow-md hidden lg:block animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-36 h-36 bg-amber-200 rounded-br-[50px] rounded-tl-[50px] opacity-70 shadow-lg hidden lg:block animate-float animate-rotate-slow"></div>

      <div className="relative z-10 bg-white p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg transform transition-all duration-300 hover:scale-[1.02] animate-fade-in animate-slide-up">
        <p className="text-stone-600 text-lg sm:text-xl text-center mb-2 font-medium">Join Our Community!</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-8 text-center">Create Your Account</h2>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-stone-100 outline-none animate-pulse-border"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 bg-stone-100 outline-none animate-pulse-border"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-100 pr-10 focus:ring-2 focus:ring-amber-500 outline-none animate-pulse-border"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-600 hover:text-stone-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-stone-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-100 pr-10 focus:ring-2 focus:ring-amber-500 outline-none animate-pulse-border"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-600 hover:text-stone-800"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {message && (
            <div className={`text-sm text-center font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 transition transform hover:-translate-y-1"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-stone-600 text-sm">
          Already have an account?{' '}
          <span onClick={() => onNavigate('login')} className="text-amber-700 hover:text-amber-800 font-medium cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
