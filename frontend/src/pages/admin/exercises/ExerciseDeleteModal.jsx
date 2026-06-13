import { Trash2 } from 'lucide-react';
import { useAdminExercises } from '../../../providers/admin/exercises';

const ExerciseDeleteModal = () => {
  const { state: { deleteId }, setDeleteId, handleDelete } = useAdminExercises();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
        <div className="w-14 h-14 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Trash2 size={26} className="text-red-400" />
        </div>
        <h2 className="text-lg font-black text-white mb-2">Xóa bài tập?</h2>
        <p className="text-zinc-500 text-sm mb-6">Hành động này sẽ xóa mềm bài tập khỏi hệ thống.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="flex-1 py-3 rounded-2xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={() => handleDelete(deleteId)}
            className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDeleteModal;
