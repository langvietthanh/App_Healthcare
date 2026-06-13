import { Pencil, Trash2, ImagePlus, Eye, EyeOff, Star } from 'lucide-react';
import { titleTable, muscleMapEV } from '../../../constants';
import { useAdminExercises } from '../../../providers/admin/exercises';

const TableHeader = () => (
  <thead>
    <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
      {titleTable.map((h) => (
        <th key={h} className="text-left px-5 py-4 font-semibold text-zinc-500">
          {h}
        </th>
      ))}
    </tr>
  </thead>
);

const TableEmpty = () => (
  <tr>
    <td colSpan={6} className="px-5 py-12 text-center text-zinc-600 font-medium">
      Không có dữ liệu
    </td>
  </tr>
);

const TableRow = ({ e, handleTogglePublic, openEdit, setDeleteId }) => (
  <tr className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
    <td className="px-5 py-3">
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 shrink-0 flex items-center justify-center border border-zinc-800">
        {e.image ? (
          <img src={e.image} alt={e.name} className="w-full h-full object-cover" />
        ) : (
          <ImagePlus size={16} className="text-zinc-600" />
        )}
      </div>
    </td>
    <td className="px-5 py-3 font-semibold text-white">{e.name}</td>
    <td className="px-5 py-3">
      <span className="px-3 py-1 bg-[#c8f31d]/10 text-[#c8f31d] rounded-lg text-xs font-bold">
        {e.category}
      </span>
    </td>
    <td className="px-5 py-3">
      <div className="flex flex-wrap gap-2">
        {e.targetMuscles && e.targetMuscles.map((m) => (
          <span key={m.muscle} className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-zinc-700/50">
            {muscleMapEV[m.muscle] || m.muscle}
            <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded text-[10px] font-black">
              {m.rating}<Star size={10} className="fill-yellow-500 ml-0.5" />
            </div>
          </span>
        ))}
      </div>
    </td>
    <td className="px-5 py-3">
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${e.isPublic
          ? 'bg-[#c8f31d]/20 text-[#c8f31d]'
          : 'bg-zinc-800 text-zinc-400'
          }`}
      >
        {e.isPublic ? 'Công khai' : 'Ẩn'}
      </span>
    </td>
    <td className="px-5 py-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleTogglePublic(e.id, e.isPublic)}
          className={`transition-colors ${e.isPublic ? 'text-[#c8f31d] hover:text-[#a0c517]' : 'text-zinc-500 hover:text-zinc-300'}`}
          title={e.isPublic ? 'Đang công khai - Bấm để ẩn' : 'Đang ẩn - Bấm để công khai'}
        >
          {e.isPublic ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button
          onClick={() => openEdit(e)}
          className="text-zinc-400 hover:text-[#c8f31d] transition-colors"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => setDeleteId(e.id)}
          className="text-zinc-400 hover:text-red-400 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </td>
  </tr>
);

const ExerciseTable = () => {
  const {
    state: { tab, exercises, search, filterCategory, filterMuscle },
    openEdit,
    setDeleteId,
    handleTogglePublic
  } = useAdminExercises();

  const filtered = exercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCategory || e.category === filterCategory;
    const matchMuscle = !filterMuscle || e.muscles.includes(filterMuscle);
    
    let matchTab = true;
    if (tab === 'all') matchTab = e.isPublic === true;
    if (tab === 'hidden') matchTab = e.isPublic === false;

    return matchSearch && matchCat && matchMuscle && matchTab;
  });

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <TableHeader />
        <tbody>
          {filtered.length === 0 ? (
            <TableEmpty />
          ) : (
            filtered.map((e) => (
              <TableRow
                key={e.id}
                e={e}
                handleTogglePublic={handleTogglePublic}
                openEdit={openEdit}
                setDeleteId={setDeleteId}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExerciseTable;
