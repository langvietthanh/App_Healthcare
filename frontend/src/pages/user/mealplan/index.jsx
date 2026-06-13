/**
 * Tác dụng của file: Điều phối chính và quản lý State (activeMeal, selectedFood, activeTab, lượng ăn) cho tính năng thực đơn hàng ngày của người dùng, sử dụng Context & Reducer tập trung.
 * File này dùng cho component cha nào là chính: App.jsx (qua tệp barrel export pages/user/index.js)
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Sun, Moon, Cookie, ChevronRight, ChevronLeft, Heart } from 'lucide-react';
import { useDailyLog } from '../../../providers/user/dailyLog';
import { useMealPlan } from '../../../providers/user/mealplan';

import MealCard from './MealCard';
import CustomFoodForm from './CustomFoodForm';
import FoodSearchList from './FoodSearchList';
import PortionDetailForm from './PortionDetailForm';

const MealPlanHeader = ({ displayMonth, displayDay }) => (
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

const SummaryBanner = ({ totalCaloriesLogged, targetCalories, navigate }) => (
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
);

const MealsList = ({ getMealCalories, targetCalories, getMealItems, handleAddFood, handleRemoveLogItem, Coffee, Sun, Moon, Cookie }) => (
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

const OverlayHeader = ({ handleCloseSearch, isCreatingFood, selectedFood, activeMeal, handleToggleFavorite, isFavorite }) => (
  <div className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#1a1a1a]">
    <button onClick={handleCloseSearch} className="text-zinc-400 hover:text-white transition-colors bg-zinc-800 p-2 rounded-full">
      <ChevronLeft size={24} />
    </button>
    <h2 className="text-xl font-bold text-white">
      {isCreatingFood ? 'Tạo món cá nhân' : selectedFood ? 'Chi tiết món ăn' : `Thêm món - ${activeMeal?.title}`}
    </h2>
    {selectedFood && !isCreatingFood ? (
      <button
        onClick={handleToggleFavorite}
        className={`p-2 rounded-full transition-colors ${isFavorite ? 'bg-rose-500/20 text-rose-500' : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
      >
        <Heart size={24} fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    ) : (
      <div className="w-10"></div>
    )}
  </div>
);

const MealPlan = () => {
  const navigate = useNavigate();

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

  const todayDateStr = state.selectedDate.toISOString().slice(0, 10);
  const displayMonth = state.selectedDate.toLocaleDateString('vi-VN', { month: 'short' });
  const displayDay = state.selectedDate.getDate();

  // Fetch search food options based on current activeTab and keyword
  useEffect(() => {
    fetchDailyOverview();
    fetchUserTarget();
    fetchFavoriteFoodsList();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeMeal) {
        fetchFoodOptions(search, activeTab);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search, activeTab, activeMeal]);

  const handleAddFood = (id, title) => {
    setActiveMeal({ id, title });
    setSelectedFood(null);
    setIsCreatingFood(false);
    setSearch('');
  };

  const handleCloseSearch = () => {
    if (isCreatingFood) {
      setIsCreatingFood(false);
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

    // Check if this food item is already in user's favorites
    const isAlreadyFav = favoriteFoodsList.some(fav => fav._id === food.id || fav.id === food.id);
    setIsFavorite(isAlreadyFav);
  };

  // Toggle favorite food in database using Context
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

  // Confirm logging food to server using Context
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

  // Remove food log using Context
  const handleRemoveLogItem = async (entryId) => {
    try {
      await deleteLogFood(entryId);
    } catch (err) {
      console.error('Error deleting logged food:', err);
      alert('Không thể xóa món ăn vào lúc này');
    }
  };

  // Map meal items for MealCard
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

  // Get total calories per meal type
  const getMealCalories = (type) => {
    return Math.round(
      foodsLogged
        .filter(f => f.mealType?.toLowerCase() === type.toLowerCase())
        .reduce((sum, f) => sum + (f.calories || 0), 0)
    );
  };

  const totalCaloriesLogged = Math.round(dailyLog?.totals?.caloriesIn || 0);

  return (
    <div className="h-full bg-[#111] text-white relative font-sans overflow-hidden flex flex-col">
      {/* Scrollable Main Content */}
      <div className="flex-1 overflow-y-auto pt-10 pb-20 scrollbar-hide">
        <MealPlanHeader displayMonth={displayMonth} displayDay={displayDay} />

        <SummaryBanner
          totalCaloriesLogged={totalCaloriesLogged}
          targetCalories={targetCalories}
          navigate={navigate}
        />

        <MealsList
          getMealCalories={getMealCalories}
          targetCalories={targetCalories}
          getMealItems={getMealItems}
          handleAddFood={handleAddFood}
          handleRemoveLogItem={handleRemoveLogItem}
          Coffee={Coffee}
          Sun={Sun}
          Moon={Moon}
          Cookie={Cookie}
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
            selectedFood={selectedFood}
            activeMeal={activeMeal}
            handleToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
          />

          {isCreatingFood ? (
            <CustomFoodForm onSave={() => { setIsCreatingFood(false); fetchFoodOptions(); }} />
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
