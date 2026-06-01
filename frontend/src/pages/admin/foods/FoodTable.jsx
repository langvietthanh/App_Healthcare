/**
 * Tác dụng của file: Hiển thị bảng danh sách món ăn, các chỉ số dinh dưỡng (Calo, Protein, Carbs, Fat) hoặc danh sách yêu cầu chờ kiểm duyệt gửi từ người dùng.
 * File này dùng cho component cha nào là chính: AdminFoods (src/pages/admin/foods/index.jsx)
 */
import React from 'react';
import { Pencil, Trash2, ImagePlus, CheckCircle2, Clock, XCircle, Check, X } from 'lucide-react';

const statusConfig = {
  approved: { label: 'Đã duyệt',   color: '#22c55e', bg: '#22c55e15', icon: CheckCircle2 },
  pending:  { label: 'Chờ duyệt',  color: '#f97316', bg: '#f9731615', icon: Clock },
  rejected: { label: 'Từ chối',    color: '#ef4444', bg: '#ef444415', icon: XCircle },
};

const FoodTable = ({ tab, filtered, onEdit, onDelete, onVerify }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
            {tab === 'all'
              ? ['Ảnh', 'Tên món', 'Calo', 'Protein', 'Carbs', 'Fat', 'Ngày thêm', 'Trạng thái', 'Hành động'].map((h) => (
                  <th key={h} className="text-left px-5 py-4 font-semibold text-zinc-500">
                    {h}
                  </th>
                ))
              : ['Tên món', 'Calo', 'Người gửi', 'Ngày gửi', 'Trạng thái', 'Duyệt'].map((h) => (
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
                {tab === 'all' ? (
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
                      {f.isPublic ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#c8f31d]/20 text-[#c8f31d]">
                          Hệ thống
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-zinc-800 text-zinc-400">
                          Cá nhân
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-3">
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
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {f.calories} kcal · {f.protein}g P · {f.carbs}g C · {f.fat}g F
                      </p>
                    </td>
                    <td className="px-5 py-4 text-[#c8f31d] font-bold">{f.calories}</td>
                    <td className="px-5 py-4 text-zinc-300 text-sm">{f.creator}</td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">{f.createdAt}</td>
                    <td className="px-5 py-4">
                      {(() => {
                        const s = statusConfig[f.status];
                        const Icon = s.icon;
                        return (
                          <span
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold w-fit"
                            style={{ backgroundColor: s.bg, color: s.color }}
                          >
                            <Icon size={12} />
                            {s.label}
                          </span>
                        );
                      })()}
                    </td>
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
