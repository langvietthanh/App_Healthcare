/**
 * Tác dụng của file: Form biểu mẫu pop-up cho phép Admin chỉnh sửa thông tin món ăn cũ hoặc nhập món ăn mới (Tên, Calo, Macros, định lượng phần ăn).
 * File này dùng cho component cha nào là chính: AdminFoods (src/pages/admin/foods/index.jsx)
 */
import React, { useRef } from 'react';
import { X, Check, ImagePlus } from 'lucide-react';

const UNITS = ['g', 'lb', 'oz', 'ml'];

const FoodFormModal = ({
  editItem,
  form,
  setForm,
  onClose,
  onSave,
  handleImageFile,
}) => {
  const fileRef = useRef(null);

  const handleInputChange = (name, val) => {
    setForm((p) => ({ ...p, [name]: val }));
  };

  const F = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="block text-xs text-zinc-500 font-semibold mb-1.5">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={(e) => handleInputChange(name, e.target.value)}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white">{editItem ? 'Sửa món ăn' : 'Thêm món ăn mới'}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={22} />
          </button>
        </div>
        <div className="space-y-4">
          {/* Image */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-2">Ảnh minh họa</label>
            <div className="flex items-start gap-4">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center">
                {form.image ? (
                  <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus size={28} className="text-zinc-600" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Dán URL ảnh..."
                  value={form.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
                />
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <div className="flex-1 h-px bg-zinc-700" />
                  hoặc
                  <div className="flex-1 h-px bg-zinc-700" />
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:border-[#c8f31d] hover:text-[#c8f31d] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ImagePlus size={14} /> Chọn ảnh từ máy
                </button>
              </div>
            </div>
          </div>
          <F label="Tên món ăn *" name="name" placeholder="VD: Cơm trắng" />
          <div className="grid grid-cols-2 gap-4">
            <F label="Calo (kcal)" name="calories" type="number" placeholder="130" />
            <F label="Protein (g)" name="protein" type="number" placeholder="2.7" />
            <F label="Carbs (g)" name="carbs" type="number" placeholder="28" />
            <F label="Fat (g)" name="fat" type="number" placeholder="0.3" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <F label="Số lượng" name="amount" type="number" placeholder="100" />
            <div>
              <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Đơn vị</label>
              <select
                value={form.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors cursor-pointer"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            className="flex-1 py-3 rounded-2xl bg-[#c8f31d] text-black font-black hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <Check size={18} /> {editItem ? 'Lưu thay đổi' : 'Thêm món ăn'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodFormModal;
