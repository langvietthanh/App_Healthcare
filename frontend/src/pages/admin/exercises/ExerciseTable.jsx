/**
 * Tác dụng của file: Bảng danh sách các bài tập hiện có với hình ảnh thu nhỏ, danh mục, nhóm cơ, mức độ khó và nút sửa/xóa.
 * File này dùng cho component cha nào là chính: AdminExercises (src/pages/admin/exercises/index.jsx)
 */
import React from 'react';
import { Pencil, Trash2, ImagePlus } from 'lucide-react';

const levelColor = { 'Dễ': '#22c55e', 'Trung bình': '#f97316', 'Khó': '#ef4444' };

const ExerciseTable = ({ filtered, onEdit, onDelete }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
            {['Ảnh', 'Tên bài tập', 'Danh mục', 'Nhóm cơ', 'Độ khó', 'Hành động'].map((h) => (
              <th key={h} className="text-left px-5 py-4 font-semibold text-zinc-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-12 text-center text-zinc-600 font-medium">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filtered.map((e) => (
              <tr key={e.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
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
                  <div className="flex flex-wrap gap-1">
                    {e.muscles.map((m) => (
                      <span key={m} className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-xs">
                        {m}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: `${levelColor[e.level]}20`,
                      color: levelColor[e.level],
                    }}
                  >
                    {e.level}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onEdit(e)}
                      className="text-zinc-400 hover:text-[#c8f31d] transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(e.id)}
                      className="text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExerciseTable;
