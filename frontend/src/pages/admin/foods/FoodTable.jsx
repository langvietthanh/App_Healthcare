import { Pencil, Trash2, ImagePlus, Eye, EyeOff, Check, X } from 'lucide-react';
import { useAdminFoods } from '../../../providers/admin';

const FoodTable = () => {
  const {
    state,
    openEdit: onEdit,
    setDeleteId: onDelete,
    handleVerify: onVerify,
    handleTogglePublic: onTogglePublic
  } = useAdminFoods();
  const { tab, search, originFilter, timeFilter, foods } = state;

  const filtered = foods.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());

    let matchTab = true;
    if (tab === 'all') matchTab = f.isPublic === true && f.status !== 'pending';
    if (tab === 'hidden') matchTab = f.isPublic === false && f.status !== 'pending';

    let matchOrigin = true;
    if (originFilter === 'system') matchOrigin = f.creator === 'Hệ thống';
    if (originFilter === 'user') matchOrigin = f.creator === 'Người dùng';

    return matchSearch && matchTab && matchOrigin;
  });

  // timeFilter: 'newest' | 'oldest'
  if (timeFilter === 'oldest') {
    filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } else {
    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
            {tab === 'all' || tab === 'hidden'
              ? ['Ảnh', 'Tên món', 'Calo', 'Protein', 'Carbs', 'Fat', 'Ngày thêm', 'Nguồn gốc', 'Hành động'].map((h) => (
                <th key={h} className="text-left px-5 py-4 font-semibold text-zinc-500">
                  {h}
                </th>
              ))
              : ['Tên món', 'Calo', 'Protein', 'Carbs', 'Fat', 'Người gửi', 'Ngày gửi', 'Duyệt'].map((h) => (
                <th key={h} className="text-left px-5 py-4 font-semibold text-zinc-500">
                  {h}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-5 py-12 text-center text-zinc-600 font-medium">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filtered.map((f) => (
              <tr key={f.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                {tab === 'all' || tab === 'hidden' ? (
                  <>
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 flex items-center justify-center border border-zinc-850">
                        {f.image ? (
                          <img src={f.image} alt={f.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImagePlus size={16} className="text-zinc-600" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-white">{f.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{f.amount} {f.unit}</p>
                    </td>
                    <td className="px-5 py-3 text-[#c8f31d] font-bold">{f.calories}</td>
                    <td className="px-5 py-3 text-zinc-300">{f.protein}g</td>
                    <td className="px-5 py-3 text-zinc-300">{f.carbs}g</td>
                    <td className="px-5 py-3 text-zinc-300">{f.fat}g</td>
                    <td className="px-5 py-3 text-zinc-500 text-xs">{f.createdAt}</td>
                    <td className="px-5 py-3">
                      {f.creator === 'Hệ thống' ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#c8f31d]/20 text-[#c8f31d]">
                          Hệ thống
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-zinc-800 text-zinc-400">
                          Người dùng
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onTogglePublic(f.id, f.isPublic)}
                          className={`transition-colors ${f.isPublic ? 'text-[#c8f31d] hover:text-[#a0c517]' : 'text-zinc-500 hover:text-zinc-300'}`}
                          title={f.isPublic ? 'Đang công khai - Bấm để ẩn' : 'Đang ẩn - Bấm để công khai'}
                        >
                          {f.isPublic ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          onClick={() => onEdit(f)}
                          className="text-zinc-400 hover:text-[#c8f31d] transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(f.id)}
                          className="text-zinc-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">{f.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">{f.amount} {f.unit}</p>
                    </td>
                    <td className="px-5 py-4 text-[#c8f31d] font-bold">{f.calories}</td>
                    <td className="px-5 py-4 text-zinc-300">{f.protein}g</td>
                    <td className="px-5 py-4 text-zinc-300">{f.carbs}g</td>
                    <td className="px-5 py-4 text-zinc-300">{f.fat}g</td>
                    <td className="px-5 py-4 text-zinc-300 text-sm">{f.creator}</td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">{f.createdAt}</td>
                    <td className="px-5 py-4">
                      {f.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onVerify(f.id, 'approved')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500/15 text-green-400 hover:bg-green-500/25 rounded-lg text-xs font-bold transition-colors"
                          >
                            <Check size={13} /> Duyệt
                          </button>
                          <button
                            onClick={() => onVerify(f.id, 'rejected')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/25 rounded-lg text-xs font-bold transition-colors"
                          >
                            <X size={13} /> Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-xs font-semibold">Đã xử lý</span>
                      )}
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FoodTable;
