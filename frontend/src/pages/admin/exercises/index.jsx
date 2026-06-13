/**
 * Tác dụng của file: Quản lý State tìm kiếm bài tập, bộ lọc, đóng/mở form modal thêm/sửa, modal xóa và gọi API quản lý bài tập thực tế từ Backend.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import { useEffect } from 'react';
import { Plus } from 'lucide-react';

import ExerciseSearch from './ExerciseSearch';
import ExerciseTable from './ExerciseTable';
import ExerciseFormModal from './ExerciseFormModal';
import ExerciseDeleteModal from './ExerciseDeleteModal';
import { useAdminExercises, ExerciseProvider } from '../../../providers/admin/exercises';

const AdminExercisesContent = () => {
  const {
    state: { loading, exercises, showForm, deleteId },
    openAdd,
    fetchExercises
  } = useAdminExercises();

  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <ExerciseSearch />

      <ExerciseTable />

      {showForm && <ExerciseFormModal />}

      {deleteId && <ExerciseDeleteModal />}
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
