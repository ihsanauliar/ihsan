import React, { useState } from 'react';
import { AtSign, User as UserIcon, Lock, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  onNavigateLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onNavigateLogin }) => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Format email tidak valid');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('password tidak sama');
      return;
    }

    setIsSubmitting(true);
    const res = await register({
      email,
      first_name: firstName,
      last_name: lastName,
      password,
    });
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('Registrasi berhasil! Mengalihkan ke halaman login...');
      setTimeout(() => {
        onNavigateLogin();
      }, 1500);
    } else {
      setErrorMessage(res.message);
    }
  };

  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white relative">
      {/* Left Column: Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-5 sm:px-10 lg:px-12 py-8 md:py-12">
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 mb-4">
            <img src="/assets/Logo.png" alt="Logo" className="w-7 h-7 object-contain" />
            <span className="font-bold text-gray-800 text-lg tracking-tight">SIMS PPOB</span>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-snug mb-5 sm:mb-6">
            Lengkapi data untuk<br />membuat akun
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-3.5">
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
                className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-sm placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-500 transition-colors shadow-xs"
              />
            </div>

            {/* First Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="nama depan"
                className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-sm placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-500 transition-colors shadow-xs"
              />
            </div>

            {/* Last Name Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="nama belakang"
                className="w-full pl-10 pr-3.5 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-sm placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-500 transition-colors shadow-xs"
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
                placeholder="buat password"
                className="w-full pl-10 pr-11 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-sm placeholder:text-gray-400 text-gray-800 focus:outline-none focus:border-gray-500 transition-colors shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="konfirmasi password"
                className={`w-full pl-10 pr-11 py-3 sm:py-2.5 text-base sm:text-sm border rounded-sm placeholder:text-gray-400 text-gray-800 focus:outline-none transition-colors shadow-xs ${
                  isPasswordMismatch ? 'border-[#f13b2c]' : 'border-gray-300 focus:border-gray-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Password Mismatch Hint (matching Page 5) */}
              {isPasswordMismatch && (
                <span className="text-[11px] text-[#f13b2c] mt-1 block text-right font-normal">
                  password tidak sama
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-2.5 min-h-[44px] bg-[#f13b2c] hover:bg-[#d3281a] active:bg-[#ba2216] text-white font-semibold text-sm rounded-sm transition-colors shadow-sm focus:outline-none disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? 'Mendaftarkan...' : 'Registrasi'}
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-xs sm:text-sm text-gray-500 pt-2">
              sudah punya akun? login{' '}
              <button
                type="button"
                onClick={onNavigateLogin}
                className="text-[#f13b2c] hover:underline font-bold focus:outline-none cursor-pointer"
              >
                di sini
              </button>
            </p>
          </form>
        </div>

        {/* Error / Success Toast */}
        {errorMessage && (
          <div className="w-full max-w-sm mt-4 p-2.5 bg-[#fff1f0] border border-[#ffccc7] rounded-sm flex items-center justify-between text-xs text-[#f13b2c] animate-fadeIn">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[#f13b2c] hover:opacity-75 focus:outline-none ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="w-full max-w-sm mt-4 p-2.5 bg-[#f6ffed] border border-[#b7eb8f] rounded-sm text-xs text-[#52c41a] animate-fadeIn text-center font-medium">
            {successMessage}
          </div>
        )}
      </div>

      {/* Right Column: Illustration */}
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
