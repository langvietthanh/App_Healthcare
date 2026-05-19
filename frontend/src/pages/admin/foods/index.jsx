/**
 * Tác dụng của file: Điều phối quản lý State món ăn, đóng mở các modal thêm/sửa/xóa, và thực hiện duyệt/từ chối yêu cầu thực phẩm từ người dùng thực tế qua các API từ Backend.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axiosClient from '../../../config/axiosClient';

import FoodFilter from './FoodFilter';
import FoodTable from './FoodTable';
import FoodFormModal from './FoodFormModal';
import FoodDeleteModal from './FoodDeleteModal';

const emptyForm = { name: '', calories: '', protein: '', carbs: '', fat: '', unit: 'g', amount: '100', image: '' };

const AdminFoods = () => {
  const [tab, setTab] = useState('all'); // 'all' | 'pending'
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch foods list from backend
  const fetchFoods = async () => {
    setLoading(true);
    try {
      const endpoint = tab === 'pending' ? '/foods/pending' : '/foods';
      const response = await axiosClient.get(endpoint);
      const data = response.data || response;
      
      if (Array.isArray(data)) {
        const mapped = data.map(e => ({
          id: e._id,
          name: e.name,
          calories: e.nutrients?.calories || 0,
          protein: e.nutrients?.protein || 0,
          carbs: e.nutrients?.carbs || 0,
          fat: e.nutrients?.fat || 0,
          unit: e.servingSize?.unit || 'g',
          amount: e.servingSize?.amount || 100,
          status: e.verifyStatus || 'approved',
          createdAt: e.createdAt ? e.createdAt.slice(0, 10) : '',
          creator: e.creatorId ? 'Người dùng' : 'Hệ thống',
          image: e.imgURL || ''
        }));
        setFoods(mapped);
      }
    } catch (err) {
      console.error('Error fetching foods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [tab]);

  // Filter logic
  const filtered = foods.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchFrom = !dateFrom || f.createdAt >= dateFrom;
    const matchTo = !dateTo || f.createdAt <= dateTo;
    return matchSearch && matchFrom && matchTo;
  });

  const pendingCount = tab === 'pending' ? foods.length : 0; // count pending length safely

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
  
  const handleSave = async () => {
    if (!form.name.trim()) return;
    
    const payload = {
      name: form.name,
      protein: +form.protein || 0,
      carbs: +form.carbs || 0,
      fat: +form.fat || 0,
      unit: form.unit || 'g',
      amount: +form.amount || 100,
      isPublic: true,
      image: form.image
    };

    try {
      if (editItem) {
        await axiosClient.patch(`/foods/${editItem.id}`, payload);
      } else {
        await axiosClient.post('/foods', payload);
      }
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      console.error('Error saving food:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu món ăn');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/foods/${id}`);
      setDeleteId(null);
      fetchFoods();
    } catch (err) {
      console.error('Error deleting food:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa món ăn');
    }
  };

  const handleVerify = async (id, status) => {
    const backendStatus = status === 'approved' ? 'approve' : 'reject';
    try {
      await axiosClient.patch(`/foods/${id}/verify`, { verifyStatus: backendStatus });
      fetchFoods();
    } catch (err) {
      console.error('Error verifying food:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi duyệt món ăn');
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Quản lý Món ăn</h1>
          <p className="text-zinc-500 text-sm">
            {loading ? 'Đang tải dữ liệu...' : `${foods.length} món ăn trong danh sách`}
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
