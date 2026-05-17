/**
 * Tác dụng của file: Điều phối quản lý State món ăn, đóng mở các modal thêm/sửa/xóa, và thực hiện duyệt/từ chối yêu cầu thực phẩm từ người dùng.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import React, { useState } from 'react';
import { Plus } from 'lucide-react';

import FoodFilter from './FoodFilter';
import FoodTable from './FoodTable';
import FoodFormModal from './FoodFormModal';
import FoodDeleteModal from './FoodDeleteModal';

const emptyForm = { name: '', calories: '', protein: '', carbs: '', fat: '', unit: 'g', amount: '100', image: '' };

const mockFoods = [
  { id: 1, name: 'Cơm trắng', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, unit: 'g', amount: 100, image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400', status: 'approved', createdAt: '2026-05-10', creator: 'Admin' },
  { id: 2, name: 'Ức gà luộc', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: 'g', amount: 100, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400', status: 'approved', createdAt: '2026-05-08', creator: 'Admin' },
  { id: 3, name: 'Trứng gà', calories: 78, protein: 6, carbs: 0.6, fat: 5, unit: 'g', amount: 100, image: '', status: 'approved', createdAt: '2026-05-05', creator: 'Admin' },
  { id: 4, name: 'Phở bò', calories: 350, protein: 20, carbs: 45, fat: 8, unit: 'g', amount: 400, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400', status: 'approved', createdAt: '2026-05-01', creator: 'Admin' },
  { id: 5, name: 'Bánh mì thịt nướng', calories: 420, protein: 18, carbs: 52, fat: 12, unit: 'g', amount: 250, image: '', status: 'pending', createdAt: '2026-05-14', creator: 'Nguyễn Văn A' },
  { id: 6, name: 'Chả cá Lã Vọng', calories: 290, protein: 22, carbs: 8, fat: 18, unit: 'g', amount: 150, image: '', status: 'pending', createdAt: '2026-05-13', creator: 'Trần Thị B' },
  { id: 7, name: 'Nem cuốn tôm', calories: 180, protein: 14, carbs: 22, fat: 4, unit: 'g', amount: 100, image: '', status: 'pending', createdAt: '2026-05-12', creator: 'Lê Văn C' },
  { id: 8, name: 'Bún bò Huế', calories: 380, protein: 25, carbs: 48, fat: 9, unit: 'g', amount: 450, image: '', status: 'rejected', createdAt: '2026-04-28', creator: 'Phạm Thị D' },
];

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
    setForm({
      ...item,
      calories: String(item.calories),
      protein: String(item.protein),
      carbs: String(item.carbs),
      fat: String(item.fat),
      amount: String(item.amount),
      image: item.image || ''
    });
    setEditItem(item);
    setShowForm(true);
  };
  const handleImageFile = (e) => { const f = e.target.files[0]; if (f) setForm(p => ({ ...p, image: URL.createObjectURL(f) })); };
  const handleSave = () => {
    if (!form.name.trim()) return;
    const entry = {
      ...form,
      id: editItem?.id ?? Date.now(),
      calories: +form.calories,
      protein: +form.protein,
      carbs: +form.carbs,
      fat: +form.fat,
      amount: +form.amount,
      status: 'approved',
      createdAt: new Date().toISOString().slice(0, 10),
      creator: 'Admin'
    };
    setFoods(prev => editItem ? prev.map(f => f.id === editItem.id ? entry : f) : [...prev, entry]);
    setShowForm(false);
  };
  const handleDelete = (id) => { setFoods(prev => prev.filter(f => f.id !== id)); setDeleteId(null); };
  const handleVerify = (id, status) => setFoods(prev => prev.map(f => f.id === id ? { ...f, status } : f));

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Quản lý Món ăn</h1>
          <p className="text-zinc-500 text-sm">
            {foods.filter(f => f.status === 'approved').length} món đã duyệt ·{' '}
            <span className="text-orange-400 font-semibold">{pendingCount} chờ duyệt</span>
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-3 bg-[#c8f31d] text-black font-black rounded-xl hover:scale-[1.02] transition-all text-sm">
          <Plus size={18} /> Thêm món ăn
        </button>
      </div>

      <FoodFilter
        tab={tab}
        setTab={setTab}
        search={search}
        setSearch={setSearch}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        pendingCount={pendingCount}
      />

      <FoodTable
        tab={tab}
        filtered={filtered}
        onEdit={openEdit}
        onDelete={setDeleteId}
        onVerify={handleVerify}
      />

      {showForm && (
        <FoodFormModal
          editItem={editItem}
          form={form}
          setForm={setForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          handleImageFile={handleImageFile}
        />
      )}

      {deleteId && (
        <FoodDeleteModal
          onClose={() => setDeleteId(null)}
          onDelete={() => handleDelete(deleteId)}
        />
      )}
    </div>
  );
};

export default AdminFoods;
