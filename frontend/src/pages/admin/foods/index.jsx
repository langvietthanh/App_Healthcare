/**
 * Tác dụng của file: Điều phối quản lý State món ăn, đóng mở các modal thêm/sửa/xóa, và thực hiện duyệt/từ chối yêu cầu thực phẩm từ người dùng thực tế qua các API từ Backend.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/admin/index.js)
 */
import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAdminFoods } from '../../../context/admin';

import FoodFilter from './FoodFilter';
import FoodTable from './FoodTable';
import FoodFormModal from './FoodFormModal';
import FoodDeleteModal from './FoodDeleteModal';


const AdminFoods = () => {
  const {
    state,
    setTab,
    setSearch,
    setMacroFilter,
    setDeleteId,
    setForm,
    fetchFoods,
    openAdd,
    openEdit,
    closeForm,
    handleImageFile,
    handleSave,
    handleDelete,
    handleVerify
  } = useAdminFoods();
  // Lấy các state ra để dùng
  const {
    tab,
    search,
    macroFilter,
    foods,
    loading,
    showForm,
    editItem,
    form,
    deleteId
  } = state;

  useEffect(() => {
    fetchFoods();
  }, [tab]);

  // Filter logic
  const filtered = foods.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    let matchMacro = true;
    if (macroFilter === 'high_protein') matchMacro = f.protein > 20;
    if (macroFilter === 'low_fat') matchMacro = f.fat < 3;
    if (macroFilter === 'low_carbs') matchMacro = f.carbs < 10;

    return matchSearch && matchMacro;
  });

  const pendingCount = tab === 'pending' ? foods.length : 0; // count pending length safely

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
        macroFilter={macroFilter}
        setMacroFilter={setMacroFilter}
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
          onClose={closeForm}
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
