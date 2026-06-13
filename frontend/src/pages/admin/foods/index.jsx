import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useAdminFoods } from '../../../providers/admin';

import FoodFilter from './FoodFilter';
import FoodTable from './FoodTable';
import FoodFormModal from './FoodFormModal';
import FoodDeleteModal from './FoodDeleteModal';


const AdminFoods = () => {
  const { state, fetchFoods, openAdd } = useAdminFoods();
  const { tab, loading, showForm, deleteId, totalCount } = state;

  useEffect(() => {
    fetchFoods();
  }, [tab]);


  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Quản lý Món ăn</h1>
          <p className="text-zinc-500 text-sm">
            {loading ? 'Đang tải dữ liệu...' : `${totalCount} món ăn trong hệ thống`}
          </p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-3 bg-[#c8f31d] text-black font-black rounded-xl hover:scale-[1.02] transition-all text-sm">
          <Plus size={18} /> Thêm món ăn
        </button>
      </div>

      <FoodFilter />
      <FoodTable />
      {showForm && <FoodFormModal />}
      {deleteId && <FoodDeleteModal />}
    </div>
  );
};

export default AdminFoods;
