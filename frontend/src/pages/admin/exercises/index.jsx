/**
 * Tác dụng của file: Quản lý State tìm kiếm bài tập, bộ lọc, đóng/mở form modal thêm/sửa, modal xóa và gọi API quản lý bài tập thực tế từ Backend.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axiosClient from '../../../config/axiosClient';

import ExerciseSearch from './ExerciseSearch';
import ExerciseTable from './ExerciseTable';
import ExerciseFormModal from './ExerciseFormModal';
import ExerciseDeleteModal from './ExerciseDeleteModal';

const emptyForm = { name: '', category: 'Strength', muscles: [], level: 'Trung bình', description: '', instructions: [''], image: '' };

const muscleMapVE = {
  'Ngực': 'Chest',
  'Lưng': 'Back',
  'Đùi trước': 'Legs',
  'Đùi sau': 'Legs',
  'Mông': 'Legs',
  'Bắp chân': 'Legs',
  'Vai': 'Shoulders',
  'Tay trước': 'Arms',
  'Tay sau': 'Arms',
  'Bụng': 'Core',
  'Toàn thân': 'Full Body'
};

const muscleMapEV = {
  'Chest': 'Ngực',
  'Back': 'Lưng',
  'Legs': 'Đùi trước',
  'Shoulders': 'Vai',
  'Arms': 'Tay trước',
  'Core': 'Bụng',
  'Full Body': 'Toàn thân'
};

const AdminExercises = () => {
  const [search, setSearch] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch exercises from backend
  const fetchExercises = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get('/exercises');
      const data = response.data || response;
      if (Array.isArray(data)) {
        const mapped = data.map(e => ({
          id: e._id,
          name: e.name,
          category: e.category || 'Strength',
          muscles: e.targetMuscles ? e.targetMuscles.map(m => muscleMapEV[m.muscle] || m.muscle) : [],
          level: 'Trung bình', // Fallback level UI
          description: e.description || '',
          instructions: e.instructions ? e.instructions.map(ins => ins.text) : [''],
          image: e.imgURL || '',
        }));
        setExercises(mapped);
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

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
  
  const handleSave = async () => {
    if (!form.name.trim()) return;

    // Map instructions and target muscles for Backend
    const instructionsMapped = form.instructions
      .filter(text => text.trim() !== '')
      .map((text, i) => ({ stepNumber: i + 1, text }));
    
    const targetMusclesMapped = form.muscles.map(m => ({
      muscle: muscleMapVE[m] || 'Full Body',
      rating: 5
    }));

    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      instructions: instructionsMapped,
      targetMuscles: targetMusclesMapped,
      imgURL: form.image,
    };

    try {
      if (editItem) {
        await axiosClient.put(`/exercises/${editItem.id}`, payload);
      } else {
        await axiosClient.post('/exercises', payload);
      }
      setShowForm(false);
      fetchExercises(); // reload
    } catch (err) {
      console.error('Error saving exercise:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài tập');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/exercises/${id}`);
      setDeleteId(null);
      fetchExercises(); // reload
    } catch (err) {
      console.error('Error deleting exercise:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa bài tập');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Quản lý Bài tập</h1>
          <p className="text-zinc-500 text-sm">
            {loading ? 'Đang tải bài tập...' : `${exercises.length} bài tập trong hệ thống`}
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-3 bg-[#c8f31d] text-black font-black rounded-xl hover:scale-[1.02] transition-all text-sm">
          <Plus size={18} /> Thêm bài tập
        </button>
      </div>

      <ExerciseSearch
        search={search}
        setSearch={setSearch}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterMuscle={filterMuscle}
        setFilterMuscle={setFilterMuscle}
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        activeFilters={activeFilters}
      />

      <ExerciseTable
        filtered={filtered}
        onEdit={openEdit}
        onDelete={setDeleteId}
      />

      {showForm && (
        <ExerciseFormModal
          editItem={editItem}
          form={form}
          setForm={setForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          addStep={addStep}
          removeStep={removeStep}
          updateStep={updateStep}
          toggleMuscle={toggleMuscle}
          handleImageFile={handleImageFile}
        />
      )}

      {deleteId && (
        <ExerciseDeleteModal
          onClose={() => setDeleteId(null)}
          onDelete={() => handleDelete(deleteId)}
        />
      )}
    </div>
  );
};

export default AdminExercises;
