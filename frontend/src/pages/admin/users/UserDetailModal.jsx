/**
 * Tác dụng của file: Hộp thoại pop-up hiển thị chi tiết đầy đủ hồ sơ chỉ số cơ thể và mục tiêu tập luyện của người dùng được chọn.
 * File này dùng cho component cha nào là chính: AdminUsers (src/pages/admin/users/index.jsx)
 */
import React from 'react';

const UserDetailModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl font-black text-[#c8f31d]">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{user.name}</h2>
            <p className="text-zinc-500 text-sm">{user.email}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Mục tiêu', value: user.goal },
            { label: 'Cân nặng', value: `${user.weight} kg` },
            { label: 'Chiều cao', value: `${user.height} cm` },
            { label: 'Ngày tham gia', value: user.joined },
            { label: 'Trạng thái', value: user.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động' },
          ].map((item, i) => (
            <div key={i} className="flex justify-between py-3 border-b border-zinc-800 last:border-0">
              <span className="text-zinc-500 text-sm">{item.label}</span>
              <span className="text-white font-semibold text-sm">{item.value}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default UserDetailModal;
