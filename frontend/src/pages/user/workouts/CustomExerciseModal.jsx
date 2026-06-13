import React, { useState, useRef } from 'react';
import { CATEGORIES, MUSCLES, muscleMapVE } from '../../../constants';
import { X, Plus, GripVertical, Check, ImagePlus, Star } from 'lucide-react';
import axiosClient from '../../../config/axiosClient';

const CustomExerciseModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    targetMuscles: [],
    description: '',
    instructions: [''],
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (file) setForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const addStep = () => setForm((prev) => ({ ...prev, instructions: [...prev.instructions, ''] }));
  const removeStep = (i) => setForm((prev) => ({ ...prev, instructions: prev.instructions.filter((_, idx) => idx !== i) }));
  const updateStep = (i, val) => setForm((prev) => ({ ...prev, instructions: prev.instructions.map((s, idx) => idx === i ? val : s) }));

  const toggleMuscle = (m) => {
    setForm((prev) => {
      const exists = prev.targetMuscles.some((x) => x.muscle === m);
      if (exists) {
        return { ...prev, targetMuscles: prev.targetMuscles.filter((x) => x.muscle !== m) };
      } else {
        return { ...prev, targetMuscles: [...prev.targetMuscles, { muscle: m, rating: 5 }] };
      }
    });
  };

  const updateMuscleRating = (m, rating) => {
    setForm((prev) => ({
      ...prev,
      targetMuscles: prev.targetMuscles.map((x) => (x.muscle === m ? { ...x, rating } : x))
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) return alert('Vui lòng nhập tên bài tập');
    setLoading(true);

    try {
      const instructionsMapped = form.instructions
        .filter((text) => text.trim() !== '')
        .map((text, i) => ({ stepNumber: i + 1, text }));

      const targetMusclesMapped = form.targetMuscles.map((m) => ({
        muscle: muscleMapVE[m.muscle] || 'Full Body',
        rating: m.rating || 5
      }));

      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        instructions: instructionsMapped,
        targetMuscles: targetMusclesMapped,
        imgURL: form.image,
      };

      await axiosClient.post('/exercises', payload);
      onSuccess(); // Close modal and refresh list
    } catch (err) {
      console.error('Error saving exercise:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài tập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide animate-in zoom-in-95 duration-200 text-left text-white">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white">Tạo bài tập cá nhân</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Image Section */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-2">Ảnh minh họa (Tùy chọn)</label>
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
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
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
                  className="w-full py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:border-[#c8f31d] hover:text-[#c8f31d] text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <ImagePlus size={16} /> Chọn ảnh từ máy
                </button>
              </div>
            </div>
          </div>

          {/* Basic Info Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Tên bài tập *</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="VD: Chạy bộ buổi sáng"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Danh mục</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors appearance-none"
              >
                {CATEGORIES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Muscles Section */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-2">Nhóm cơ tác động</label>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {MUSCLES.map((m) => {
                  const isSelected = form.targetMuscles.some((x) => x.muscle === m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => toggleMuscle(m)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-[#c8f31d] text-black border-[#c8f31d]'
                          : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>

              {form.targetMuscles.length > 0 && (
                <div className="mt-2 space-y-2 bg-zinc-800/50 p-3 rounded-xl border border-zinc-700/50">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">Đánh giá mức độ tác động</div>
                  {form.targetMuscles.map((tm) => (
                    <div key={tm.muscle} className="flex items-center justify-between">
                      <span className="text-sm text-zinc-300 font-medium">{tm.muscle}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateMuscleRating(tm.muscle, star)}
                            className={`p-1 transition-colors ${star <= tm.rating ? 'text-yellow-500' : 'text-zinc-600 hover:text-zinc-400'}`}
                          >
                            <Star size={16} className={star <= tm.rating ? 'fill-yellow-500' : ''} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Mô tả ngắn</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              placeholder="Mô tả tổng quan về bài tập..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors resize-none"
            />
          </div>

          {/* Instructions Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-zinc-500 font-semibold">Hướng dẫn thực hiện</label>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#c8f31d]/10 text-[#c8f31d] rounded-lg text-xs font-bold hover:bg-[#c8f31d]/20 transition-colors"
              >
                <Plus size={14} /> Thêm bước
              </button>
            </div>
            <div className="space-y-3">
              {form.instructions.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex items-center gap-1.5 mt-2.5 shrink-0">
                    <GripVertical size={16} className="text-zinc-600 cursor-grab" />
                    <span className="w-6 h-6 bg-[#c8f31d] text-black text-xs font-black rounded-full flex items-center justify-center shrink-0">
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
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold hover:bg-zinc-700 hover:text-white transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-3.5 rounded-2xl bg-[#c8f31d] text-black font-black hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(200,243,29,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang lưu...' : <><Check size={20} /> Tạo bài tập</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomExerciseModal;
