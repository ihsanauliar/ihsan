import React, { useState, useRef, useEffect } from 'react';
import { AtSign, User as UserIcon, Edit2, X, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Account: React.FC = () => {
  const { user, updateProfile, updateAvatar, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state whenever user profile data updates or loads
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
    }
  }, [user]);

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const displayName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Pengguna SIMS';

  const avatarSrc =
    user?.profile_image && user.profile_image !== 'null' && !user.profile_image.includes('null')
      ? user.profile_image
      : '/assets/Profile Photo.png';

  const hasChanges =
    firstName !== (user?.first_name || '') || lastName !== (user?.last_name || '');

  const showEditButtons = isEditing || hasChanges;

  const handleEditClick = () => {
    setIsEditing(true);
    setNotification(null);
    setTimeout(() => {
      firstNameInputRef.current?.focus();
    }, 50);
  };

  const handleCancelClick = () => {
    setFirstName(user?.first_name || '');
    setLastName(user?.last_name || '');
    setIsEditing(false);
    setNotification(null);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setNotification({ type: 'error', message: 'Nama depan dan belakang tidak boleh kosong' });
      return;
    }

    setIsSubmitting(true);
    const res = await updateProfile(firstName.trim(), lastName.trim());
    setIsSubmitting(false);

    if (res.success) {
      setNotification({ type: 'success', message: 'Profil berhasil diperbarui' });
      setIsEditing(false);
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setNotification({ type: 'error', message: 'Format gambar harus JPEG atau PNG' });
      return;
    }

    if (file.size > 100 * 1024) {
      setNotification({ type: 'error', message: 'Ukuran file gambar maksimal 100 KB' });
      return;
    }

    setIsSubmitting(true);
    const res = await updateAvatar(file);
    setIsSubmitting(false);

    if (res.success) {
      setNotification({ type: 'success', message: 'Foto profil berhasil diperbarui' });
    } else {
      setNotification({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-6 sm:py-10">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Avatar Section with edit pencil badge */}
        <div className="relative mb-3 sm:mb-4">
          <div className="w-22 h-22 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm bg-gray-50">
            <img
              src={avatarSrc}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/Profile Photo.png';
              }}
            />
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png"
            className="hidden"
          />

          {/* Edit Avatar Pencil Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow-xs focus:outline-none transition-colors cursor-pointer active:scale-95"
            title="Ubah Foto Profil (Max 100KB)"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* User Name Header */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight text-center mb-5 sm:mb-6">
          {displayName}
        </h2>

        {/* Notifications Toast */}
        {notification && (
          <div
            className={`w-full mb-5 sm:mb-6 p-3 rounded-sm flex items-center justify-between text-xs sm:text-sm animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-[#f6ffed] border border-[#b7eb8f] text-[#52c41a]'
                : 'bg-[#fff1f0] border border-[#ffccc7] text-[#f13b2c]'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="hover:opacity-70 focus:outline-none ml-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSaveProfile} className="w-full space-y-4 sm:space-y-5">
          {/* Email Field (Always Disabled) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="email"
                readOnly
                disabled
                value={user?.email || 'wallet@nutech.com'}
                className="w-full pl-10 pr-4 py-3 sm:py-2.5 text-base sm:text-sm border border-gray-300 rounded-sm bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          {/* Nama Depan Field (Clickable and directly editable) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nama Depan
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                ref={firstNameInputRef}
                type="text"
                required
                value={firstName}
                onFocus={() => setIsEditing(true)}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setIsEditing(true);
                }}
                placeholder="Nama Depan"
                className={`w-full pl-10 pr-4 py-3 sm:py-2.5 text-base sm:text-sm border rounded-sm transition-colors focus:outline-none shadow-xs ${
                  showEditButtons
                    ? 'border-[#f13b2c] ring-1 ring-[#f13b2c]/20 bg-white text-gray-900'
                    : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Nama Belakang Field (Clickable and directly editable) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Nama Belakang
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={lastName}
                onFocus={() => setIsEditing(true)}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setIsEditing(true);
                }}
                placeholder="Nama Belakang"
                className={`w-full pl-10 pr-4 py-3 sm:py-2.5 text-base sm:text-sm border rounded-sm transition-colors focus:outline-none shadow-xs ${
                  showEditButtons
                    ? 'border-[#f13b2c] ring-1 ring-[#f13b2c]/20 bg-white text-gray-900'
                    : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 sm:pt-4 space-y-3">
            {showEditButtons ? (
              <>
                {/* Simpan Button (matching Page 18) */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-2.5 min-h-[44px] bg-[#f13b2c] hover:bg-[#d3281a] active:bg-[#ba2216] text-white font-semibold text-sm rounded-sm transition-colors shadow-sm focus:outline-none disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                {/* Batalkan Button */}
                <button
                  type="button"
                  onClick={handleCancelClick}
                  className="w-full py-3 sm:py-2.5 min-h-[44px] bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm rounded-sm transition-colors focus:outline-none cursor-pointer"
                >
                  Batalkan
                </button>
              </>
            ) : (
              <>
                {/* Edit Profil Button (matching Page 19) */}
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="w-full py-3 sm:py-2.5 min-h-[44px] bg-[#f13b2c] hover:bg-[#d3281a] active:bg-[#ba2216] text-white font-semibold text-sm rounded-sm transition-colors shadow-sm focus:outline-none cursor-pointer"
                >
                  Edit Profil
                </button>
                {/* Logout Button (matching Page 19) */}
                <button
                  type="button"
                  onClick={logout}
                  className="w-full py-3 sm:py-2.5 min-h-[44px] bg-white border border-[#f13b2c] text-[#f13b2c] hover:bg-[#fff1f0] font-semibold text-sm rounded-sm transition-colors focus:outline-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
