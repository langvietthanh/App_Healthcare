import React, { useState, useRef } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, ImagePlus, GripVertical, ChevronDown, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['Cardio', 'Strength', 'Flexibility', 'Balance', 'HIIT', 'Yoga'];
const MUSCLES = ['Ngực', 'Lưng', 'Vai', 'Tay trước', 'Tay sau', 'Bụng', 'Mông', 'Đùi trước', 'Đùi sau', 'Bắp chân', 'Toàn thân'];
const levelColor = { 'Dễ': '#22c55e', 'Trung bình': '#f97316', 'Khó': '#ef4444' };
const emptyForm = { name: '', category: 'Strength', muscles: [], level: 'Trung bình', description: '', instructions: [''], image: '' };

const mockExercises = [
  { id: 1, name: 'Bench Press', category: 'Strength',    muscles: ['Ngực', 'Tay trước'], level: 'Trung bình', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400' },
  { id: 2, name: 'Squat',       category: 'Strength',    muscles: ['Đùi trước', 'Mông'], level: 'Trung bình', image: 'https://images.unsplash.com/photo-1434608519344-49d77a124f48?w=400' },
  { id: 3, name: 'Plank',       category: 'Flexibility', muscles: ['Bụng', 'Lưng'],       level: 'Dễ',         image: '' },
  { id: 4, name: 'Burpees',     category: 'HIIT',        muscles: ['Toàn thân'],           level: 'Khó',        image: '' },
  { id: 5, name: 'Deadlift',    category: 'Strength',    muscles: ['Lưng', 'Đùi sau'],    level: 'Khó',        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
];

const AdminExercises = () => {
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState(mockExercises);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const fileInputRef = useRef(null);

  const filtered = exercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCategory || e.category === filterCategory;
    const matchMuscle = !filterMuscle || e.muscles.includes(filterMuscle);
    const matchLevel = !filterLevel || e.level === filterLevel;
    return matchSearch && matchCat && matchMuscle && matchLevel;
  });
  const activeFilters = [filterCategory, filterMuscle, filterLevel].filter(Boolean).length;

  const openAdd = () => { setForm(emptyForm); setEditItem(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({
      ...item,
      description: item.description || '',
      instructions: item.instructions?.length ? item.instructions : [''],
      image: item.image || ''
    });
    setEditItem(item);
    setShowForm(true);
  };
  const addStep = () => setForm(f => ({ ...f, instructions: [...f.instructions, ''] }));
  const removeStep = (i) => setForm(f => ({ ...f, instructions: f.instructions.filter((_, idx) => idx !== i) }));
  const updateStep = (i, val) => setForm(f => ({ ...f, instructions: f.instructions.map((s, idx) => idx === i ? val : s) }));
  const toggleMuscle = (m) => setForm(f => ({ ...f, muscles: f.muscles.includes(m) ? f.muscles.filter(x => x !== m) : [...f.muscles, m] }));
  const handleImageFile = (e) => { const file = e.target.files[0]; if (file) setForm(f => ({ ...f, image: URL.createObjectURL(file) })); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    const entry = { ...form, id: editItem?.id ?? Date.now() };
    setExercises(prev => editItem ? prev.map(e => e.id === editItem.id ? entry : e) : [...prev, entry]);
    setShowForm(false);
  };
  const handleDelete = (id) => { setExercises(prev => prev.filter(e => e.id !== id)); setDeleteId(null); };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Quản lý Bài tập</h1>
          <p className="text-zinc-500 text-sm">{exercises.length} bài tập trong hệ thống</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-3 bg-[#c8f31d] text-black font-black rounded-xl hover:scale-[1.02] transition-all text-sm">
          <Plus size={18} /> Thêm bài tập
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm bài tập..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#c8f31d] transition-colors text-sm" />
        </div>
        <button onClick={() => setShowFilter(v => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
            showFilter || activeFilters > 0 ? 'border-[#c8f31d] text-[#c8f31d] bg-[#c8f31d]/10' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
          }`}>
          <SlidersHorizontal size={16} />
          Bộ lọc{activeFilters > 0 && <span className="w-5 h-5 bg-[#c8f31d] text-black text-[10px] font-black rounded-full flex items-center justify-center">{activeFilters}</span>}
        </button>
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Danh mục</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors">
              <option value="">Tất cả</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Nhóm cơ</label>
            <select value={filterMuscle} onChange={e => setFilterMuscle(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors">
              <option value="">Tất cả</option>
              {MUSCLES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Độ khó</label>
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors">
              <option value="">Tất cả</option>
              {['Dễ', 'Trung bình', 'Khó'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="col-span-3 flex justify-end">
            <button onClick={() => { setFilterCategory(''); setFilterMuscle(''); setFilterLevel(''); }}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition-colors">
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
              {['Ảnh', 'Tên bài tập', 'Danh mục', 'Nhóm cơ', 'Độ khó', 'Hành động'].map(h => (
                <th key={h} className="text-left px-5 py-4 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr key={e.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center">
                    {e.image ? <img src={e.image} alt={e.name} className="w-full h-full object-cover" />
                      : <ImagePlus size={16} className="text-zinc-600" />}
                  </div>
                </td>
                <td className="px-5 py-3 font-semibold text-white">{e.name}</td>
                <td className="px-5 py-3"><span className="px-3 py-1 bg-[#c8f31d]/10 text-[#c8f31d] rounded-lg text-xs font-bold">{e.category}</span></td>
                <td className="px-5 py-3"><div className="flex flex-wrap gap-1">{e.muscles.map(m => <span key={m} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">{m}</span>)}</div></td>
                <td className="px-5 py-3"><span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: `${levelColor[e.level]}20`, color: levelColor[e.level] }}>{e.level}</span></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(e)} className="text-zinc-400 hover:text-[#c8f31d] transition-colors"><Pencil size={15} /></button>
                    <button onClick={() => setDeleteId(e.id)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">{editItem ? 'Sửa bài tập' : 'Thêm bài tập mới'}</h2>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              {/* Ảnh */}
              <div>
                <label className="block text-xs text-zinc-500 font-semibold mb-2">Ảnh minh họa</label>
                <div className="flex items-start gap-4">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center">
                    {form.image ? <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                      : <ImagePlus size={28} className="text-zinc-600" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="text" placeholder="Dán URL ảnh..." value={form.image}
                      onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors" />
                    <div className="flex items-center gap-2 text-xs text-zinc-600"><div className="flex-1 h-px bg-zinc-700" />hoặc<div className="flex-1 h-px bg-zinc-700" /></div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:border-[#c8f31d] hover:text-[#c8f31d] text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                      <ImagePlus size={14} /> Chọn ảnh từ máy
                    </button>
                  </div>
                </div>
              </div>
              {/* Name */}
              <div>
                <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Tên bài tập *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="VD: Bench Press"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors" />
              </div>
              {/* Category + Level */}
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Danh mục', key: 'category', options: CATEGORIES }, { label: 'Độ khó', key: 'level', options: ['Dễ', 'Trung bình', 'Khó'] }].map(sel => (
                  <div key={sel.key}>
                    <label className="block text-xs text-zinc-500 font-semibold mb-1.5">{sel.label}</label>
                    <select value={form[sel.key]} onChange={e => setForm(f => ({ ...f, [sel.key]: e.target.value }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors">
                      {sel.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              {/* Muscles */}
              <div>
                <label className="block text-xs text-zinc-500 font-semibold mb-2">Nhóm cơ</label>
                <div className="flex flex-wrap gap-2">
                  {MUSCLES.map(m => (
                    <button key={m} type="button" onClick={() => toggleMuscle(m)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${form.muscles.includes(m) ? 'bg-[#c8f31d] text-black border-[#c8f31d]' : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {/* Mô tả ngắn */}
              <div>
                <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Mô tả ngắn</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2} placeholder="Mô tả tổng quan về bài tập..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors resize-none" />
              </div>
              {/* Hướng dẫn từng bước */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-zinc-500 font-semibold">Hướng dẫn thực hiện</label>
                  <button type="button" onClick={addStep}
                    className="flex items-center gap-1 px-3 py-1 bg-[#c8f31d]/10 text-[#c8f31d] rounded-lg text-xs font-bold hover:bg-[#c8f31d]/20 transition-colors">
                    <Plus size={12} /> Thêm bước
                  </button>
                </div>
                <div className="space-y-2">
                  {form.instructions.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex items-center gap-1.5 mt-2.5 shrink-0">
                        <GripVertical size={14} className="text-zinc-600 cursor-grab" />
                        <span className="w-5 h-5 bg-[#c8f31d] text-black text-[10px] font-black rounded-full flex items-center justify-center shrink-0">{i + 1}</span>
                      </div>
                      <textarea
                        value={step}
                        onChange={e => updateStep(i, e.target.value)}
                        rows={2}
                        placeholder={`Bước ${i + 1}: Nội dung hướng dẫn...`}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors resize-none"
                      />
                      {form.instructions.length > 1 && (
                        <button type="button" onClick={() => removeStep(i)}
                          className="mt-2 text-zinc-600 hover:text-red-400 transition-colors shrink-0">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors">Hủy</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-2xl bg-[#c8f31d] text-black font-black hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                <Check size={18} /> {editItem ? 'Lưu thay đổi' : 'Thêm bài tập'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 size={26} className="text-red-400" /></div>
            <h2 className="text-lg font-black text-white mb-2">Xóa bài tập?</h2>
            <p className="text-zinc-500 text-sm mb-6">Hành động này sẽ xóa mềm bài tập khỏi hệ thống.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold">Hủy</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-colors">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExercises;
