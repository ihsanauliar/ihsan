import React, { useState } from 'react';
import { AtSign, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginProps {
  onNavigateRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onNavigateRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('wallet@nutech.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Format email tidak valid');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password minimal 8 karakter');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white relative">
      {/* Left Column: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-5 sm:px-10 lg:px-12 py-8 md:py-12 lg:py-16">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 mb-5 sm:mb-6">
            <img src="/assets/Logo.png" alt="Logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-gray-800 text-lg tracking-tight">SIMS PPOB</span>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-snug mb-6 sm:mb-8">
            Masuk atau buat akun<br />untuk memulai
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="masukan email anda"
                className={`w-full pl-10 pr-3.5 py-3 sm:py-2.5 text-base sm:text-sm border rounded-sm placeholder:text-gray-400 text-gray-800 focus:outline-none transition-colors shadow-xs ${
                  errorMessage && !email ? 'border-[#f13b2c]' : 'border-gray-300 focus:border-gray-500'
                }`}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="masukan password anda"
                className={`w-full pl-10 pr-11 py-3 sm:py-2.5 text-base sm:text-sm border rounded-sm placeholder:text-gray-400 text-gray-800 focus:outline-none transition-colors shadow-xs ${
                  errorMessage ? 'border-[#f13b2c]' : 'border-gray-300 focus:border-gray-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2 sm:pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-2.5 min-h-[44px] bg-[#f13b2c] hover:bg-[#d3281a] active:bg-[#ba2216] text-white font-semibold text-sm rounded-sm transition-colors shadow-sm focus:outline-none disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? 'Memproses...' : 'Masuk'}
              </button>
            </div>

            {/* Register Link */}
            <p className="text-center text-xs sm:text-sm text-gray-500 pt-2 sm:pt-3">
              belum punya akun? registrasi{' '}
              <button
                type="button"
                onClick={onNavigateRegister}
                className="text-[#f13b2c] hover:underline font-bold focus:outline-none cursor-pointer"
              >
                di sini
              </button>
            </p>
          </form>
        </div>

        {/* Error Toast / Alert (matching page 3) */}
        {errorMessage && (
          <div className="w-full max-w-sm mt-5 sm:mt-6 p-2.5 bg-[#fff1f0] border border-[#ffccc7] rounded-sm flex items-center justify-between text-xs text-[#f13b2c] animate-fadeIn">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[#f13b2c] hover:opacity-75 focus:outline-none ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Right Column: Illustration (matching page 1-3) */}
      <div className="hidden md:flex md:w-1/2 bg-[#fff1f0] items-center justify-center p-6 lg:p-8 overflow-hidden">
        <img
          src="/assets/Illustrasi Login.png"
          alt="SIMS Illustration"
          className="max-h-[85vh] w-auto object-contain select-none"
        />
      </div>
    </div>
  );
};
