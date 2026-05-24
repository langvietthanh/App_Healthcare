/**
 * Tác dụng của file: Modal chỉnh sửa thông tin cá nhân với 3 tab (Thông tin, Thể chất, Mật khẩu)
 * File này dùng cho component cha nào là chính: Profile (src/pages/user/profile/index.jsx)
 */
import React, { useState, useEffect } from 'react';
import { X, User, Activity, Lock, Save, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

const TABS = [
  { id: 'info', label: 'Thông tin', icon: User },
  { id: 'physical', label: 'Thể chất', icon: Activity },
  { id: 'password', label: 'Mật khẩu', icon: Lock },
];

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Ít vận động (Sedentary)' },
  { value: 'light', label: 'Nhẹ nhàng (Light)' },
  { value: 'moderate', label: 'Trung bình (Moderate)' },
  { value: 'active', label: 'Năng động (Active)' },
  { value: 'veryActive', label: 'Rất năng động (Very Active)' },
];

const EditProfileModal = ({ user, onClose, onUpdateInfo, onUpdatePhysical, onChangePassword }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  // ===== Tab 1: Thông tin cơ bản =====
  const [infoForm, setInfoForm] = useState({
    username: '',
    email: '',
    birthDate: '',
  });

  // ===== Tab 2: Chỉ số thể chất =====
  const [physicalForm, setPhysicalForm] = useState({
    weight: '',
    height: '',
    gender: 'male',
    activityLevel: 'moderate',
  });

  // ===== Tab 3: Đổi mật khẩu =====
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Pre-fill dữ liệu từ user
  useEffect(() => {
    if (user) {
      setInfoForm({
        username: user.username || '',
        email: user.email || '',
        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : '',
      });
      setPhysicalForm({
        weight: user.physicalDetail?.weight || '',
        height: user.physicalDetail?.height || '',
        gender: user.physicalDetail?.gender || 'male',
        activityLevel: user.physicalDetail?.activityLevel || 'moderate',
      });
    }
  }, [user]);

  // Auto-hide toast sau 3 giây
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Validation helpers
  const validateInfoForm = () => {
    if (!infoForm.username.trim() || infoForm.username.trim().length < 2) {
      return 'Tên phải có ít nhất 2 ký tự';
    }
    if (!infoForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(infoForm.email)) {
      return 'Email không hợp lệ';
    }
    if (!infoForm.birthDate) {
      return 'Vui lòng chọn ngày sinh';
    }
    if (new Date(infoForm.birthDate) >= new Date()) {
      return 'Ngày sinh phải là ngày trong quá khứ';
    }
    return null;
  };

  const validatePhysicalForm = () => {
    const w = Number(physicalForm.weight);
    const h = Number(physicalForm.height);
    if (!w || w < 20 || w > 300) return 'Cân nặng phải từ 20 - 300 kg';
    if (!h || h < 50 || h > 300) return 'Chiều cao phải từ 50 - 300 cm';
    return null;
  };

  const validatePasswordForm = () => {
    if (!passwordForm.oldPassword || passwordForm.oldPassword.length < 6) {
      return 'Mật khẩu cũ phải có ít nhất 6 ký tự';
    }
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      return 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return null;
  };

  // Submit handler
  const handleSave = async () => {
    let error = null;

    if (activeTab === 'info') {
      error = validateInfoForm();
      if (error) return setToast({ type: 'error', message: error });
      setLoading(true);
      try {
        await onUpdateInfo(infoForm);
        setToast({ type: 'success', message: 'Cập nhật thông tin thành công!' });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data?.msg || 'Có lỗi xảy ra khi cập nhật';
        setToast({ type: 'error', message: msg });
      }
    }

    if (activeTab === 'physical') {
      error = validatePhysicalForm();
      if (error) return setToast({ type: 'error', message: error });
      setLoading(true);
      try {
        await onUpdatePhysical({
          weight: Number(physicalForm.weight),
          height: Number(physicalForm.height),
          gender: physicalForm.gender,
          activityLevel: physicalForm.activityLevel,
        });
        setToast({ type: 'success', message: 'Cập nhật chỉ số thể chất thành công!' });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data?.msg || 'Có lỗi xảy ra khi cập nhật';
        setToast({ type: 'error', message: msg });
      }
    }

    if (activeTab === 'password') {
      error = validatePasswordForm();
      if (error) return setToast({ type: 'error', message: error });
      setLoading(true);
      try {
        await onChangePassword({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        });
        setToast({ type: 'success', message: 'Đổi mật khẩu thành công!' });
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } catch (err) {
        const msg = err?.response?.data?.message || err?.response?.data?.msg || 'Sai mật khẩu cũ hoặc có lỗi xảy ra';
        setToast({ type: 'error', message: msg });
      }
    }

    setLoading(false);
  };

  // ===== RENDER =====
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#1a1a2e] rounded-t-3xl shadow-2xl animate-slideUp max-h-[92vh] flex flex-col">

        {/* Toast Notification */}
        {toast && (
          <div className={`absolute top-4 left-4 right-4 z-10 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-fadeIn ${
            toast.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-bold text-white">Chỉnh sửa hồ sơ</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex mx-6 mb-5 bg-zinc-900/80 rounded-xl p-1 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#c8f31d] text-[#1a1a2e] shadow-[0_0_20px_rgba(200,243,29,0.2)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>

          {/* === Tab 1: Thông tin cá nhân === */}
          {activeTab === 'info' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  value={infoForm.username}
                  onChange={(e) => setInfoForm({ ...infoForm, username: e.target.value })}
                  className="w-full bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d]/30 outline-none transition-all"
                  placeholder="Nhập tên của bạn"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={infoForm.email}
                  onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                  className="w-full bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d]/30 outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={infoForm.birthDate}
                  onChange={(e) => setInfoForm({ ...infoForm, birthDate: e.target.value })}
                  className="w-full bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d]/30 outline-none transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          )}

          {/* === Tab 2: Chỉ số thể chất === */}
          {activeTab === 'physical' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Weight & Height side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Cân nặng (kg)
                  </label>
                  <input
                    type="number"
                    value={physicalForm.weight}
                    onChange={(e) => setPhysicalForm({ ...physicalForm, weight: e.target.value })}
                    className="w-full bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d]/30 outline-none transition-all"
                    placeholder="65"
                    min="20"
                    max="300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Chiều cao (cm)
                  </label>
                  <input
                    type="number"
                    value={physicalForm.height}
                    onChange={(e) => setPhysicalForm({ ...physicalForm, height: e.target.value })}
                    className="w-full bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-500 focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d]/30 outline-none transition-all"
                    placeholder="170"
                    min="50"
                    max="300"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Giới tính
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[{ value: 'male', label: 'Nam 🧑' }, { value: 'female', label: 'Nữ 👩' }].map((g) => (
                    <button
                      key={g.value}
                      type="button"
                      onClick={() => setPhysicalForm({ ...physicalForm, gender: g.value })}
                      className={`py-3 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                        physicalForm.gender === g.value
                          ? 'bg-[#c8f31d]/10 border-[#c8f31d] text-[#c8f31d] shadow-[0_0_15px_rgba(200,243,29,0.1)]'
                          : 'bg-zinc-900/70 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Mức độ vận động
                </label>
                <div className="space-y-2">
                  {ACTIVITY_LEVELS.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setPhysicalForm({ ...physicalForm, activityLevel: level.value })}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                        physicalForm.activityLevel === level.value
                          ? 'bg-[#c8f31d]/10 border-[#c8f31d] text-[#c8f31d]'
                          : 'bg-zinc-900/70 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* === Tab 3: Đổi mật khẩu === */}
          {activeTab === 'password' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Old Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-zinc-500 focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d]/30 outline-none transition-all"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-zinc-500 focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d]/30 outline-none transition-all"
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-zinc-500 focus:border-[#c8f31d] focus:ring-1 focus:ring-[#c8f31d]/30 outline-none transition-all"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {passwordForm.newPassword && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          passwordForm.newPassword.length >= level * 3
                            ? level <= 1 ? 'bg-red-500' : level <= 2 ? 'bg-amber-500' : level <= 3 ? 'bg-[#c8f31d]' : 'bg-emerald-500'
                            : 'bg-zinc-800'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    {passwordForm.newPassword.length < 6 ? 'Quá ngắn' : passwordForm.newPassword.length < 9 ? 'Trung bình' : 'Mạnh'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Button (Fixed at bottom) */}
        <div className="px-6 pb-6 pt-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-[#1a1a2e] text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: loading ? '#555' : 'linear-gradient(135deg, #c8f31d 0%, #aee018 100%)',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(200, 243, 29, 0.3)',
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} strokeWidth={2.5} />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default EditProfileModal;
