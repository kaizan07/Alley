import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsError(false);
        setMessage('Login successful!');
        
        // Check if user is admin and redirect accordingly
        if (data.user.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        setIsError(true);
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6 font-inter relative">
      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; } /* Increased slide distance */
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; } /* Slightly smaller initial scale */
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          25% { transform: translateY(-20px) translateX(15px) rotate(5deg); }
          50% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          75% { transform: translateY(20px) translateX(-15px) rotate(-5deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
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
        .animate-float { animation: float 12s ease-in-out infinite; } /* Slower, smoother float over larger distance */
        .animate-rotate-slow { animation: rotate-slow 20s linear infinite; } /* Slow continuous rotation */
        .animate-pulse-border:focus { animation: pulse-border 1.5s infinite; }
        `}
      </style>

      {/* Abstract 3D-like background shapes with floating and rotating animation */}
      {/* Large irregular blob in light tan */} 
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-amber-100 rounded-[40%_60%_70%_30%_/_60%_40%_60%_40%] transform -translate-x-1/2 -translate-y-1/2 opacity-80 shadow-xl animate-float" style={{ animationDelay: '0s', animationDuration: '11s' }}></div>
      {/* Medium rounded triangle in medium brown */}
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 sm:w-60 sm:h-60 bg-stone-600 rounded-3xl rotate-45 opacity-80 shadow-xl animate-float animate-rotate-slow" style={{ animationDelay: '2s', animationDuration: '13s' }}></div>
      {/* Small elongated oval in darker brown */}
      <div className="absolute top-1/2 left-0 w-32 h-16 bg-amber-800 rounded-full transform -translate-x-1/2 opacity-70 shadow-lg hidden md:block animate-float" style={{ animationDelay: '1s', animationDuration: '10s' }}></div>
      {/* Smaller circle in light tan */}
      <div className="absolute bottom-0 right-1/2 w-24 h-24 bg-amber-100 rounded-full transform translate-x-1/2 translate-y-1/2 opacity-70 shadow-lg hidden md:block animate-float animate-rotate-slow" style={{ animationDelay: '3s', animationDuration: '12s' }}></div>
      {/* Another medium rounded rectangle in stone-300 */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-stone-300 rounded-bl-full opacity-60 shadow-md hidden lg:block animate-float" style={{ animationDelay: '4s', animationDuration: '11.5s' }}></div>
      {/* A more distinct, sharper angled shape in amber-200 */}
      <div className="absolute bottom-1/4 left-1/4 w-36 h-36 bg-amber-200 rounded-br-[50px] rounded-tl-[50px] opacity-70 shadow-lg hidden lg:block animate-float animate-rotate-slow" style={{ animationDelay: '5s', animationDuration: '14s' }}></div>
      
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-stone-800 mb-6">Login to Your Account</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 rounded-lg border border-stone-300 bg-stone-100 focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-4 py-3 pr-12 rounded-lg border border-stone-300 bg-stone-100 focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-600 hover:text-stone-800 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {message && (
            <p className={`text-sm font-medium ${isError ? 'text-red-600' : 'text-green-600'} -mt-4`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-amber-800 text-white py-3 rounded-lg font-semibold text-lg hover:bg-amber-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Don't have an account?{' '}
          <span className="text-amber-700 hover:underline font-medium cursor-pointer" onClick={() => navigate('/signup')}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
