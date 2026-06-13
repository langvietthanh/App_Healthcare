/**
 * Tác dụng của file: Hộp thoại xác nhận yêu cầu xóa mềm món ăn khỏi cơ sở dữ liệu hệ thống.
 * File này dùng cho component cha nào là chính: AdminFoods (src/pages/admin/foods/index.jsx)
 */
import React from 'react';
import { Trash2 } from 'lucide-react';
import { useAdminFoods } from '../../../providers/admin';

const FoodDeleteModal = () => {
  const { state, setDeleteId, handleDelete } = useAdminFoods();
  
  const onClose = () => setDeleteId(null);
  const onDelete = () => handleDelete(state.deleteId);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
        <div className="w-14 h-14 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Trash2 size={26} className="text-red-400" />
        </div>
        <h2 className="text-lg font-black text-white mb-2">Xóa món ăn?</h2>
        <p className="text-zinc-500 text-sm mb-6">Hành động này sẽ xóa mềm món ăn khỏi hệ thống.</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onDelete}
            className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDeleteModal;
