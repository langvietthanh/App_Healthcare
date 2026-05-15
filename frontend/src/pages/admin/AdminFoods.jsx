import React, { useState, useRef } from 'react';
import { Search, Plus, Pencil, Trash2, X, Check, ImagePlus, ChevronDown, CheckCircle2, Clock, XCircle } from 'lucide-react';

const UNITS = ['g', 'lb', 'oz', 'ml'];
const emptyForm = { name: '', calories: '', protein: '', carbs: '', fat: '', unit: 'g', amount: '100', image: '' };

const mockFoods = [
  { id: 1, name: 'Cơm trắng',  calories: 130, protein: 2.7, carbs: 28,  fat: 0.3, unit: 'g',   amount: 100, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400', status: 'approved', createdAt: '2026-05-10', creator: 'Admin' },
  { id: 2, name: 'Ức gà luộc', calories: 165, protein: 31,  carbs: 0,   fat: 3.6, unit: 'g',   amount: 100, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400', status: 'approved', createdAt: '2026-05-08', creator: 'Admin' },
  { id: 3, name: 'Trứng gà',   calories: 78,  protein: 6,   carbs: 0.6, fat: 5,   unit: 'g',   amount: 100, image: '', status: 'approved', createdAt: '2026-05-05', creator: 'Admin' },
  { id: 4, name: 'Phở bò',     calories: 350, protein: 20,  carbs: 45,  fat: 8,   unit: 'g',   amount: 400, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', status: 'approved', createdAt: '2026-05-01', creator: 'Admin' },
  { id: 5, name: 'Bánh mì thịt nướng', calories: 420, protein: 18, carbs: 52, fat: 12, unit: 'g', amount: 250, image: '', status: 'pending', createdAt: '2026-05-14', creator: 'Nguyễn Văn A' },
  { id: 6, name: 'Chả cá Lã Vọng',    calories: 290, protein: 22, carbs: 8,  fat: 18, unit: 'g', amount: 150, image: '', status: 'pending', createdAt: '2026-05-13', creator: 'Trần Thị B' },
  { id: 7, name: 'Nem cuốn tôm',       calories: 180, protein: 14, carbs: 22, fat: 4,  unit: 'g', amount: 100, image: '', status: 'pending', createdAt: '2026-05-12', creator: 'Lê Văn C' },
  { id: 8, name: 'Bún bò Huế',         calories: 380, protein: 25, carbs: 48, fat: 9,  unit: 'g', amount: 450, image: '', status: 'rejected', createdAt: '2026-04-28', creator: 'Phạm Thị D' },
];

const statusConfig = {
  approved: { label: 'Đã duyệt',   color: '#22c55e', bg: '#22c55e15', icon: CheckCircle2 },
  pending:  { label: 'Chờ duyệt',  color: '#f97316', bg: '#f9731615', icon: Clock },
  rejected: { label: 'Từ chối',    color: '#ef4444', bg: '#ef444415', icon: XCircle },
};

const AdminFoods = () => {
  const [tab, setTab] = useState('all'); // 'all' | 'pending'
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [foods, setFoods] = useState(mockFoods);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef(null);

  // Filter logic
  const filtered = foods.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'all' ? f.status !== 'pending' : f.status === 'pending';
    const matchFrom = !dateFrom || f.createdAt >= dateFrom;
    const matchTo = !dateTo || f.createdAt <= dateTo;
    return matchSearch && matchTab && matchFrom && matchTo;
  });

  const pendingCount = foods.filter(f => f.status === 'pending').length;

  const openAdd = () => { setForm(emptyForm); setEditItem(null); setShowForm(true); };
  const openEdit = (item) => {
    setForm({ ...item, calories: String(item.calories), protein: String(item.protein), carbs: String(item.carbs), fat: String(item.fat), amount: String(item.amount), image: item.image || '' });
    setEditItem(item); setShowForm(true);
  };
  const handleImageFile = (e) => { const f = e.target.files[0]; if (f) setForm(p => ({ ...p, image: URL.createObjectURL(f) })); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    const entry = { ...form, id: editItem?.id ?? Date.now(), calories: +form.calories, protein: +form.protein, carbs: +form.carbs, fat: +form.fat, amount: +form.amount, status: 'approved', createdAt: new Date().toISOString().slice(0, 10), creator: 'Admin' };
    setFoods(prev => editItem ? prev.map(f => f.id === editItem.id ? entry : f) : [...prev, entry]);
    setShowForm(false);
  };
  const handleDelete = (id) => { setFoods(prev => prev.filter(f => f.id !== id)); setDeleteId(null); };
  const handleVerify = (id, status) => setFoods(prev => prev.map(f => f.id === id ? { ...f, status } : f));

  const F = ({ label, name, type = 'text', placeholder }) => (
    <div>
      <label className="block text-xs text-zinc-500 font-semibold mb-1.5">{label}</label>
      <input type={type} placeholder={placeholder} value={form[name]} onChange={e => setForm(p => ({ ...p, [name]: e.target.value }))}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors" />
    </div>
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Quản lý Món ăn</h1>
          <p className="text-zinc-500 text-sm">{foods.filter(f => f.status === 'approved').length} món đã duyệt · <span className="text-orange-400 font-semibold">{pendingCount} chờ duyệt</span></p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-3 bg-[#c8f31d] text-black font-black rounded-xl hover:scale-[1.02] transition-all text-sm">
          <Plus size={18} /> Thêm món ăn
        </button>
      </div>

      {/* Tab */}
      <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 w-fit">
        <button onClick={() => setTab('all')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${tab === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}>
          Tất cả món ăn
        </button>
        <button onClick={() => setTab('pending')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${tab === 'pending' ? 'bg-orange-500/20 text-orange-400' : 'text-zinc-400 hover:text-white'}`}>
          Chờ duyệt
          {pendingCount > 0 && <span className="w-5 h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">{pendingCount}</span>}
        </button>
      </div>

      {/* Search & Filter bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm món ăn..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#c8f31d] transition-colors text-sm" />
        </div>
        <button onClick={() => setShowFilter(v => !v)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showFilter || dateFrom || dateTo ? 'border-[#c8f31d] text-[#c8f31d] bg-[#c8f31d]/10' : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'}`}>
          <ChevronDown size={16} className={`transition-transform ${showFilter ? 'rotate-180' : ''}`} />
          Lọc theo ngày
        </button>
      </div>

      {/* Date filter panel */}
      {showFilter && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Từ ngày</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Đến ngày</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors" />
          </div>
          <button onClick={() => { setDateFrom(''); setDateTo(''); }}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white text-sm font-medium transition-colors">
            Xóa lọc
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
              {tab === 'all'
                ? ['Ảnh', 'Tên món', 'Calo', 'Protein', 'Carbs', 'Fat', 'Ngày thêm', 'Hành động'].map(h => <th key={h} className="text-left px-5 py-4 font-semibold">{h}</th>)
                : ['Tên món', 'Calo', 'Người gửi', 'Ngày gửi', 'Trạng thái', 'Duyệt'].map(h => <th key={h} className="text-left px-5 py-4 font-semibold">{h}</th>)
              }
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-zinc-600 font-medium">Không có dữ liệu</td></tr>
            ) : filtered.map(f => (
              <tr key={f.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                {tab === 'all' ? (
                  <>
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center">
                        {f.image ? <img src={f.image} alt={f.name} className="w-full h-full object-cover" /> : <ImagePlus size={16} className="text-zinc-600" />}
                      </div>
                    </td>
                    <td className="px-5 py-3 font-semibold text-white">{f.name}</td>
                    <td className="px-5 py-3 text-[#c8f31d] font-bold">{f.calories}</td>
                    <td className="px-5 py-3 text-zinc-300">{f.protein}g</td>
                    <td className="px-5 py-3 text-zinc-300">{f.carbs}g</td>
                    <td className="px-5 py-3 text-zinc-300">{f.fat}g</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{f.createdAt}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(f)} className="text-zinc-400 hover:text-[#c8f31d] transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteId(f.id)} className="text-zinc-400 hover:text-red-400 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{f.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{f.calories} kcal · {f.protein}g P · {f.carbs}g C · {f.fat}g F</p>
                    </td>
                    <td className="px-5 py-4 text-[#c8f31d] font-bold">{f.calories}</td>
                    <td className="px-5 py-4 text-zinc-300 text-sm">{f.creator}</td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">{f.createdAt}</td>
                    <td className="px-5 py-4">
                      {(() => { const s = statusConfig[f.status]; const Icon = s.icon; return (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit" style={{ backgroundColor: s.bg, color: s.color }}>
                          <Icon size={12} />{s.label}
                        </span>
                      ); })()}
                    </td>
                    <td className="px-5 py-4">
                      {f.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button onClick={() => handleVerify(f.id, 'approved')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/15 text-green-400 hover:bg-green-500/25 rounded-lg text-xs font-bold transition-colors">
                            <Check size={13} /> Duyệt
                          </button>
                          <button onClick={() => handleVerify(f.id, 'rejected')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/25 rounded-lg text-xs font-bold transition-colors">
                            <X size={13} /> Từ chối
                          </button>
                        </div>
                      ) : <span className="text-zinc-600 text-xs">Đã xử lý</span>}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">{editItem ? 'Sửa món ăn' : 'Thêm món ăn mới'}</h2>
              <button onClick={() => setShowForm(false)} className="text-zinc-500 hover:text-white"><X size={22} /></button>
            </div>
            <div className="space-y-4">
              {/* Image */}
              <div>
                <label className="block text-xs text-zinc-500 font-semibold mb-2">Ảnh minh họa</label>
                <div className="flex items-start gap-4">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0 flex items-center justify-center">
                    {form.image ? <img src={form.image} alt="preview" className="w-full h-full object-cover" /> : <ImagePlus size={28} className="text-zinc-600" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input type="text" placeholder="Dán URL ảnh..." value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors" />
                    <div className="flex items-center gap-2 text-xs text-zinc-600"><div className="flex-1 h-px bg-zinc-700" />hoặc<div className="flex-1 h-px bg-zinc-700" /></div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageFile} className="hidden" />
                    <button type="button" onClick={() => fileRef.current?.click()}
                      className="w-full py-2 rounded-xl border border-zinc-700 text-zinc-400 hover:border-[#c8f31d] hover:text-[#c8f31d] text-xs font-semibold transition-colors flex items-center justify-center gap-2">
                      <ImagePlus size={14} /> Chọn ảnh từ máy
                    </button>
                  </div>
                </div>
              </div>
              <F label="Tên món ăn *" name="name" placeholder="VD: Cơm trắng" />
              <div className="grid grid-cols-2 gap-4">
                <F label="Calo (kcal)" name="calories" type="number" placeholder="130" />
                <F label="Protein (g)"  name="protein"  type="number" placeholder="2.7" />
                <F label="Carbs (g)"    name="carbs"    type="number" placeholder="28" />
                <F label="Fat (g)"      name="fat"      type="number" placeholder="0.3" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Số lượng" name="amount" type="number" placeholder="100" />
                <div>
                  <label className="block text-xs text-zinc-500 font-semibold mb-1.5">Đơn vị</label>
                  <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#c8f31d] transition-colors">
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors">Hủy</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-2xl bg-[#c8f31d] text-black font-black hover:scale-[1.01] transition-all flex items-center justify-center gap-2">
                <Check size={18} /> {editItem ? 'Lưu thay đổi' : 'Thêm món ăn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm text-center">
            <div className="w-14 h-14 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-5"><Trash2 size={26} className="text-red-400" /></div>
            <h2 className="text-lg font-black text-white mb-2">Xóa món ăn?</h2>
            <p className="text-zinc-500 text-sm mb-6">Hành động này sẽ xóa mềm món ăn khỏi hệ thống.</p>
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

export default AdminFoods;
