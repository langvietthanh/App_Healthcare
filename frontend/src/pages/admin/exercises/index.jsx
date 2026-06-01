/**
 * Tác dụng của file: Quản lý State tìm kiếm bài tập, bộ lọc, đóng/mở form modal thêm/sửa, modal xóa và gọi API quản lý bài tập thực tế từ Backend.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import axiosClient from '../../../config/axiosClient';

import { muscleMapEV, muscleMapVE } from '../../../constants';
import ExerciseSearch from './ExerciseSearch';
import ExerciseTable from './ExerciseTable';
import ExerciseFormModal from './ExerciseFormModal';
import ExerciseDeleteModal from './ExerciseDeleteModal';
import { useAdminExercises, ExerciseProvider } from '../../../context/admin/exercises';

const AdminExercisesContent = () => {
  const { state, dispatch } = useAdminExercises();
  const {
    search, exercises, loading, filterCategory, filterMuscle, filterLevel,
    showFilter, showForm, editItem, form, deleteId
  } = state;

  // Fetch exercises from backend
  const fetchExercises = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
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
          isPublic: e.isPublic || false,
        }));
        dispatch({ type: 'SET_EXERCISES', payload: mapped });
      }
    } catch (err) {
      console.error('Error fetching exercises:', err);
      dispatch({ type: 'SET_LOADING', payload: false });
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

  const openAdd = () => dispatch({ type: 'OPEN_ADD_FORM' });
  const openEdit = (item) => dispatch({ type: 'OPEN_EDIT_FORM', payload: item });
  const addStep = () => dispatch({ type: 'SET_FORM', payload: { ...form, instructions: [...form.instructions, ''] } });
  const removeStep = (i) => dispatch({ type: 'SET_FORM', payload: { ...form, instructions: form.instructions.filter((_, idx) => idx !== i) } });
  const updateStep = (i, val) => dispatch({ type: 'SET_FORM', payload: { ...form, instructions: form.instructions.map((s, idx) => idx === i ? val : s) } });
  const toggleMuscle = (m) => dispatch({ type: 'SET_FORM', payload: { ...form, muscles: form.muscles.includes(m) ? form.muscles.filter(x => x !== m) : [...form.muscles, m] } });
  const handleImageFile = (e) => { const file = e.target.files[0]; if (file) dispatch({ type: 'SET_FORM', payload: { ...form, image: URL.createObjectURL(file) } }); };

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
      dispatch({ type: 'CLOSE_FORM' });
      fetchExercises(); // reload
    } catch (err) {
      console.error('Error saving exercise:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài tập');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/exercises/${id}`);
      dispatch({ type: 'SET_DELETE_ID', payload: null });
      fetchExercises(); // reload
    } catch (err) {
      console.error('Error deleting exercise:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa bài tập');
    }
  };

  const handleTogglePublic = async (id, currentStatus) => {
    try {
      await axiosClient.put(`/exercises/${id}`, { isPublic: !currentStatus });
      fetchExercises(); // reload
    } catch (err) {
      console.error('Error toggling public status:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
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
        setSearch={(val) => dispatch({ type: 'SET_SEARCH', payload: val })}
        showFilter={showFilter}
        setShowFilter={() => dispatch({ type: 'TOGGLE_FILTER' })}
        filterCategory={filterCategory}
        setFilterCategory={(val) => dispatch({ type: 'SET_FILTER_CATEGORY', payload: val })}
        filterMuscle={filterMuscle}
        setFilterMuscle={(val) => dispatch({ type: 'SET_FILTER_MUSCLE', payload: val })}
        filterLevel={filterLevel}
        setFilterLevel={(val) => dispatch({ type: 'SET_FILTER_LEVEL', payload: val })}
        activeFilters={activeFilters}
      />

      <ExerciseTable
        filtered={filtered}
        onEdit={openEdit}
        onDelete={(id) => dispatch({ type: 'SET_DELETE_ID', payload: id })}
        onTogglePublic={handleTogglePublic}
      />

      {showForm && (
        <ExerciseFormModal
          editItem={editItem}
          form={form}
          setForm={(val) => dispatch({ type: 'SET_FORM', payload: typeof val === 'function' ? val(form) : val })}
          onClose={() => dispatch({ type: 'CLOSE_FORM' })}
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
          onClose={() => dispatch({ type: 'SET_DELETE_ID', payload: null })}
          onDelete={() => handleDelete(deleteId)}
        />
      )}
    </div>
  );
};

const AdminExercises = () => {
  return (
    <ExerciseProvider>
      <AdminExercisesContent />
    </ExerciseProvider>
  );
};

export default AdminExercises;
