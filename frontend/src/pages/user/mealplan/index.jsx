import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Sun, Moon, Cookie, ChevronRight, ChevronLeft, Heart, Send, Clock, CheckCircle, Trash2, Edit3 } from 'lucide-react';
import { useDailyLog, useMealPlan } from '../../../providers/user';
import axiosClient from '../../../config/axiosClient';

import MealCard from './components/cards/MealCard';
import CustomFoodForm from './components/forms/CustomFoodForm';
import FoodSearchList from './components/search/FoodSearchList';
import PortionDetailForm from './components/forms/PortionDetailForm';

const MealPlanHeader = ({ displayMonth, displayDay }) => (
  // GIAO DIỆN MEAL PLAN HEADER
  <div className="px-8 mb-10 flex justify-between items-center">
    <div>
      <h1 className="text-4xl font-black mb-2 tracking-tight">
        Thực đơn <span className="text-[#c8f31d]">Hôm nay</span>
      </h1>
      <p className="text-zinc-400 font-medium">Ghi chép các bữa ăn để theo dõi lượng calo</p>
    </div>
    <div className="w-16 h-16 rounded-[20px] bg-zinc-800 flex flex-col items-center justify-center border border-zinc-700 shadow-lg">
      <span className="text-xs font-bold text-zinc-400 uppercase">{displayMonth}</span>
      <span className="text-xl font-black text-[#c8f31d]">{displayDay}</span>
    </div>
  </div>
);

const SummaryBanner = ({ totalCaloriesLogged, targetCalories }) => {
  const navigate = useNavigate();
  return (
    // GIAO DIỆN SUMMARY BANNER
    <div className="px-8 mb-8">
      <div className="bg-gradient-to-r from-[#c8f31d]/20 to-transparent border border-[#c8f31d]/30 rounded-2xl p-6 flex justify-between items-center">
        <div>
          <p className="text-zinc-300 text-sm font-medium mb-1">Tổng lượng Calo đã nạp</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#c8f31d]">{totalCaloriesLogged}</span>
            <span className="text-zinc-500 font-bold">/ {targetCalories} kcal</span>
          </div>
        </div>
        <button
          className="w-10 h-10 bg-[#c8f31d] text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          onClick={() => navigate('/diary')}
          title="Trở về Nhật ký"
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  )
};

const MealsList = ({ getMealCalories, targetCalories, getMealItems, handleAddFood, handleRemoveLogItem }) => (
  // GIAO DIỆN MEALS LIST
  <div className="px-8">
    <MealCard
      id="breakfast"
      title="Bữa sáng"
      icon={Coffee}
      currentKcal={getMealCalories('breakfast')}
      targetKcal={Math.round(targetCalories * 0.25)}
      items={getMealItems('breakfast')}
      onAddFood={handleAddFood}
      onRemoveItem={handleRemoveLogItem}
    />
    <MealCard
      id="lunch"
      title="Bữa trưa"
      icon={Sun}
      currentKcal={getMealCalories('lunch')}
      targetKcal={Math.round(targetCalories * 0.35)}
      items={getMealItems('lunch')}
      onAddFood={handleAddFood}
      onRemoveItem={handleRemoveLogItem}
    />
    <MealCard
      id="dinner"
      title="Bữa tối"
      icon={Moon}
      currentKcal={getMealCalories('dinner')}
      targetKcal={Math.round(targetCalories * 0.30)}
      items={getMealItems('dinner')}
      onAddFood={handleAddFood}
      onRemoveItem={handleRemoveLogItem}
    />
    <MealCard
      id="snack"
      title="Bữa phụ"
      icon={Cookie}
      currentKcal={getMealCalories('snack')}
      targetKcal={Math.round(targetCalories * 0.10)}
      items={getMealItems('snack')}
      onAddFood={handleAddFood}
      onRemoveItem={handleRemoveLogItem}
    />
  </div>
);

const OverlayHeader = ({ handleCloseSearch, isCreatingFood, isEditingFood, selectedFood, activeMeal, handleToggleFavorite, isFavorite, activeTab, handleRequestApproval, handleDeleteCustomFood, handleEditCustomFood }) => (
  // GIAO DIỆN OVERLAY HEADER
  <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#1a1a1a]">
    <button onClick={handleCloseSearch} className="text-zinc-400 hover:text-white transition-colors bg-zinc-800 p-2 rounded-full">
      <ChevronLeft size={24} />
    </button>
    <h2 className="text-xl font-bold text-white">
      {isCreatingFood ? 'Tạo món cá nhân' : isEditingFood ? 'Sửa món ăn' : selectedFood ? 'Chi tiết món ăn' : `Thêm món - ${activeMeal?.title}`}
    </h2>
    {selectedFood && !isCreatingFood && !isEditingFood ? (
      activeTab === 'custom' ? (
        <div className="flex gap-2">
          {selectedFood.verifyStatus === 'pending' ? (
            <div className="p-2 text-amber-500 bg-amber-500/10 rounded-full" title="Đang chờ duyệt">
              <Clock size={24} />
            </div>
          ) : selectedFood.verifyStatus === 'approved' || selectedFood.isPublic ? (
            <div className="p-2 text-[#c8f31d] bg-[#c8f31d]/10 rounded-full" title="Đã được duyệt public">
              <CheckCircle size={24} />
            </div>
          ) : (
            <button
              onClick={handleRequestApproval}
              className="p-2 rounded-full transition-colors bg-[#c8f31d]/20 text-[#c8f31d] hover:bg-[#c8f31d]/40"
              title="Gửi cho Admin duyệt để chia sẻ cộng đồng"
            >
              <Send size={24} />
            </button>
          )}
          <button
            onClick={handleEditCustomFood}
            className="p-2 rounded-full transition-colors bg-blue-500/20 text-blue-500 hover:bg-blue-500/40"
            title="Sửa món ăn này"
          >
            <Edit3 size={24} />
          </button>
          <button
            onClick={handleDeleteCustomFood}
            className="p-2 rounded-full transition-colors bg-rose-500/20 text-rose-500 hover:bg-rose-500/40"
            title="Xóa món ăn này"
          >
            <Trash2 size={24} />
          </button>
        </div>
      ) : (
        <button
          onClick={handleToggleFavorite}
          className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-rose-500/20 text-rose-500' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
        >
          <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      )
    ) : (
      <div className="w-10"></div>
    )}
  </div>
);

const MealPlan = () => {
  const {
    state,
    fetchDailyOverview,
    fetchUserTarget,
    fetchFavoriteFoodsList,
    logFood,
    deleteLogFood,
    toggleFavorite
  } = useDailyLog();

  const {
    state: mealPlanState,
    fetchFoodOptions,
    setActiveMeal,
    setActiveTab,
    setSearch,
    setSelectedFood
  } = useMealPlan();

  const {
    activeMeal,
    activeTab,
    search,
    listFoods,
    loadingSearch,
    selectedFood
  } = mealPlanState;

  const { dailyLog, foodsLogged, targetCalories, favoriteFoodsList } = state;

  const [amount, setAmount] = useState('100');
  const [unit, setUnit] = useState('g');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isCreatingFood, setIsCreatingFood] = useState(false);
  const [isEditingFood, setIsEditingFood] = useState(false);

  const formatLocal = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const todayDateStr = formatLocal(state.selectedDate);
  const displayMonth = state.selectedDate.toLocaleDateString('vi-VN', { month: 'short' });
  const displayDay = state.selectedDate.getDate();
  // Lấy danh sách gợi ý món ăn dựa trên tab hiện tại và từ khóa tìm kiếm
  useEffect(() => {
    fetchDailyOverview();
    fetchUserTarget();
    fetchFavoriteFoodsList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeMeal) {
        fetchFoodOptions(search, activeTab);
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeTab, activeMeal]);

  const handleAddFood = (id, title) => {
    setActiveMeal({ id, title });
    setSelectedFood(null);
    setIsCreatingFood(false);
    setSearch('');
  };

  const handleCloseSearch = () => {
    if (isCreatingFood || isEditingFood) {
      setIsCreatingFood(false);
      setIsEditingFood(false);
    } else if (selectedFood) {
      setSelectedFood(null);
    } else {
      setActiveMeal(null);
    }
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    setAmount(String(food.amount || 100));
    setUnit(food.unit || 'g');

    // Kiểm tra xem món ăn này đã có trong danh sách yêu thích chưa
    const isAlreadyFav = favoriteFoodsList.some(fav => fav._id === food.id || fav.id === food.id);
    setIsFavorite(isAlreadyFav);
  };

  // Bật/tắt trạng thái món ăn yêu thích trong cơ sở dữ liệu thông qua Context
  const handleToggleFavorite = async () => {
    if (!selectedFood) return;
    try {
      await toggleFavorite(selectedFood.id, isFavorite);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite status:', err);
      alert('Không thể cập nhật danh sách yêu thích');
    }
  };

  // Gửi yêu cầu cho Admin duyệt để món ăn được hiển thị công khai
  const handleRequestApproval = async () => {
    if (!selectedFood) return;
    if (!window.confirm("Bạn muốn gửi món ăn này cho Admin duyệt để chia sẻ cho mọi người cùng dùng chung?")) return;

    try {
      await axiosClient.patch(`/foods/${selectedFood.id}`, { isPublic: true });
      alert('Đã gửi yêu cầu duyệt thành công!');
      fetchFoodOptions(search, activeTab); // Làm mới danh sách
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu duyệt');
    }
  };

  // Xóa món ăn tự tạo
  const handleDeleteCustomFood = async () => {
    if (!selectedFood) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa món ăn cá nhân này? Thao tác này không thể hoàn tác.")) return;

    try {
      await axiosClient.delete(`/foods/${selectedFood.id}`);
      alert('Đã xóa món ăn thành công!');
      handleCloseSearch(); // Trở về danh sách
      fetchFoodOptions(search, activeTab); // Làm mới danh sách
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa món ăn');
    }
  };

  // Xác nhận lưu món ăn vào nhật ký trên Server thông qua Context
  const handleLogFoodSubmit = async () => {
    if (!selectedFood) return;

    try {
      const payload = {
        date: todayDateStr,
        foodRefId: selectedFood.id,
        mealType: activeMeal.id,
        intakeAmount: +amount || 100,
        intakeUnit: unit || 'g'
      };

      await logFood(payload);
      setActiveMeal(null);
      setSelectedFood(null);
    } catch (err) {
      console.error('Error logging food item:', err);
      alert('Có lỗi xảy ra khi ghi nhật ký ăn uống');
    }
  };

  // Xóa món ăn đã ghi nhận khỏi nhật ký thông qua Context
  const handleRemoveLogItem = async (entryId) => {
    try {
      await deleteLogFood(entryId);
    } catch (err) {
      console.error('Error deleting logged food:', err);
      alert('Không thể xóa món ăn vào lúc này');
    }
  };

  // Ánh xạ dữ liệu món ăn để truyền vào MealCard
  const getMealItems = (type) => {
    return foodsLogged
      .filter(f => f.mealType?.toLowerCase() === type.toLowerCase())
      .map(f => ({
        id: f._id,
        name: f.foodName,
        amount: `${f.intakeAmount}${f.intakeUnit}`,
        kcal: Math.round(f.calories || 0)
      }));
  };

  // Lấy tổng lượng Calo nạp vào theo từng bữa ăn
  const getMealCalories = (type) => {
    return Math.round(
      foodsLogged
        .filter(f => f.mealType?.toLowerCase() === type.toLowerCase())
        .reduce((sum, f) => sum + (f.calories || 0), 0)
    );
  };

  const totalCaloriesLogged = Math.round(dailyLog?.totals?.caloriesIn || 0);

  return (
    // GIAO DIỆN MEAL PLAN
    <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto pt-10 pb-20 scrollbar-hide">
        <MealPlanHeader displayMonth={displayMonth} displayDay={displayDay} />

        <SummaryBanner
          totalCaloriesLogged={totalCaloriesLogged}
          targetCalories={targetCalories}
        />

        <MealsList
          getMealCalories={getMealCalories}
          targetCalories={targetCalories}
          getMealItems={getMealItems}
          handleAddFood={handleAddFood}
          handleRemoveLogItem={handleRemoveLogItem}
        />
      </div>

      {/* Tầng Overlay Thêm Món Ăn (Search Food / Portion Form) */}
      {activeMeal && (
        <div className="absolute inset-0 bg-[#111] z-50 flex flex-col h-full animate-[slideIn_0.3s_ease-out]">
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }
          `}</style>

          <OverlayHeader
            handleCloseSearch={handleCloseSearch}
            isCreatingFood={isCreatingFood}
            isEditingFood={isEditingFood}
            selectedFood={selectedFood}
            activeMeal={activeMeal}
            handleToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            activeTab={activeTab}
            handleRequestApproval={handleRequestApproval}
            handleDeleteCustomFood={handleDeleteCustomFood}
            handleEditCustomFood={() => setIsEditingFood(true)}
          />

          {isCreatingFood || isEditingFood ? (
            <CustomFoodForm
              initialData={isEditingFood ? selectedFood : null}
              onSave={() => { setIsCreatingFood(false); setIsEditingFood(false); setSelectedFood(null); fetchFoodOptions(search, activeTab); }}
            />
          ) : !selectedFood ? (
            <FoodSearchList
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setIsCreatingFood={setIsCreatingFood}
              handleSelectFood={handleSelectFood}
              search={search}
              setSearch={setSearch}
              listFoods={listFoods}
              loading={loadingSearch}
            />
          ) : (
            <PortionDetailForm
              selectedFood={selectedFood}
              amount={amount}
              setAmount={setAmount}
              unit={unit}
              setUnit={setUnit}
              onSubmit={handleLogFoodSubmit}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlan;
