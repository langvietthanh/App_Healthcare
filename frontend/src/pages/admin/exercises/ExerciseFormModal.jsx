/**
 * Tác dụng của file: Form biểu mẫu pop-up cho phép thêm bài tập mới hoặc chỉnh sửa chi tiết (nhập tên, danh mục, độ khó, nhóm cơ, mô tả ngắn, hướng dẫn từng bước).
 * File này dùng cho component cha nào là chính: AdminExercises (src/pages/admin/exercises/index.jsx)
 */
import React, { useRef } from 'react';
import { X, Plus, GripVertical, Check, ImagePlus } from 'lucide-react';

const CATEGORIES = ['Cardio', 'Strength', 'Flexibility', 'Balance', 'HIIT', 'Yoga'];
const MUSCLES = ['Ngực', 'Lưng', 'Vai', 'Tay trước', 'Tay sau', 'Bụng', 'Mông', 'Đùi trước', 'Đùi sau', 'Bắp chân', 'Toàn thân'];

const ExerciseFormModal = ({
  editItem,
  form,
  setForm,
  onClose,
  onSave,
  addStep,
  removeStep,
  updateStep,
  toggleMuscle,
  handleImageFile,
}) => {
  const fileInputRef = useRef(null);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white">{editItem ? 'Sửa bài tập' : 'Thêm bài tập mới'}</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={22} />
          </button>
        </div>
        <div className="space-y-4">
          {/* Ảnh */}
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
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
                />
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <div className="flex-1 h-px bg-zinc-700" />
                  hoặc
                  <div className="flex-1 h-px bg-zinc-700" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:border-[#c8f31d] hover:text-[#c8f31d] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <ImagePlus size={14} /> Chọn ảnh từ máy
                </button>
              </div>
            </div>
          </div>
          {/* Name */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Tên bài tập *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="VD: Bench Press"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
            />
          </div>
          {/* Category + Level */}
          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'Danh mục', key: 'category', options: CATEGORIES }, { label: 'Độ khó', key: 'level', options: ['Dễ', 'Trung bình', 'Khó'] }].map((sel) => (
              <div key={sel.key}>
                <label className="block text-xs text-zinc-500 font-semibold mb-1.5">{sel.label}</label>
                <select
                  value={form[sel.key]}
                  onChange={(e) => setForm((f) => ({ ...f, [sel.key]: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
                >
                  {sel.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {/* Muscles */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-2">Nhóm cơ</label>
            <div className="flex flex-wrap gap-2">
              {MUSCLES.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMuscle(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                    form.muscles.includes(m)
                      ? 'bg-[#c8f31d] text-black border-[#c8f31d]'
                      : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {/* Mô tả ngắn */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Mô tả ngắn</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Mô tả tổng quan về bài tập..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors resize-none"
            />
          </div>
          {/* Hướng dẫn từng bước */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-500 font-semibold">Hướng dẫn thực hiện</label>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1 px-3 py-1 bg-[#c8f31d]/10 text-[#c8f31d] rounded-lg text-xs font-bold hover:bg-[#c8f31d]/20 transition-colors"
              >
                <Plus size={12} /> Thêm bước
              </button>
            </div>
            <div className="space-y-2">
              {form.instructions.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex items-center gap-1.5 mt-2.5 shrink-0">
                    <GripVertical size={14} className="text-zinc-600 cursor-grab" />
                    <span className="w-5 h-5 bg-[#c8f31d] text-black text-[10px] font-black rounded-full flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                  </div>
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(i, e.target.value)}
                    rows={2}
                    placeholder={`Bước ${i + 1}: Nội dung hướng dẫn...`}
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors resize-none"
                  />
                  {form.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(i)}
                      className="mt-2 text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
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
            <Check size={18} /> {editItem ? 'Lưu thay đổi' : 'Thêm bài tập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseFormModal;
