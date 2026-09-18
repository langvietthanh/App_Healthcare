import { useReducer, createContext, useContext } from 'react';
import axiosClient from '../../../config/axiosClient';
import { ACTIONS } from './types';
import { reducer, initState } from './reducer';

const DailyLogContext = createContext();

const DailyLogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const formatLocal = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const dateString = formatLocal(state.selectedDate);

  // Lấy dữ liệu tổng quan hàng ngày từ server
  const fetchDailyOverview = async (customDateStr) => {
    dispatch({ type: ACTIONS.FETCH_DAILY_LOG_START });
    try {
      const targetDate = customDateStr || dateString;
      const response = await axiosClient.get(`/daily-logs/${targetDate}`);
      const data = response.data || response;
      if (data) {
        dispatch({ type: ACTIONS.FETCH_DAILY_LOG_SUCCESS, payload: data });
      }
    } catch (err) {
      console.error('Error fetching daily overview in context:', err);
    }
  };

  // Lấy các mục tiêu trong hồ sơ người dùng
  const fetchUserTarget = async () => {
    try {
      const response = await axiosClient.get('/auth/me');
      const data = response.data || response;
      if (data) {
        dispatch({ type: ACTIONS.FETCH_USER_GOAL_SUCCESS, payload: data });
      }
    } catch (err) {
      console.error('Error fetching user goals in context:', err);
    }
  };

  // Lấy danh sách món ăn yêu thích của người dùng
  const fetchFavoriteFoodsList = async () => {
    try {
      const response = await axiosClient.get('/foods/favorites');
      const data = response.data || response;
      if (Array.isArray(data)) {
        dispatch({ type: ACTIONS.FETCH_FAVORITES_SUCCESS, payload: data });
      }
    } catch (err) {
      console.error('Error fetching favorite foods list in context:', err);
    }
  };

  // Ghi nhận món ăn mới vào cơ sở dữ liệu
  const logFood = async (payload) => {
    try {
      await axiosClient.post('/daily-logs/foods', payload);
      await fetchDailyOverview(); // Tải lại dữ liệu nhật ký
    } catch (err) {
      console.error('Error logging food:', err);
      throw err;
    }
  };

  // Xóa bản ghi món ăn đã ghi nhận
  const deleteLogFood = async (entryId) => {
    try {
      await axiosClient.delete(`/daily-logs/foods/${entryId}`);
      await fetchDailyOverview(); // Tải lại dữ liệu nhật ký
    } catch (err) {
      console.error('Error deleting logged food:', err);
      throw err;
    }
  };

  // Bật/tắt trạng thái món ăn yêu thích
  const toggleFavorite = async (foodId, isFavoriteNow) => {
    try {
      if (isFavoriteNow) {
        await axiosClient.delete(`/foods/favorites/${foodId}`);
      } else {
        await axiosClient.post('/foods/favorites', { foodId });
      }
      await fetchFavoriteFoodsList(); // Tải lại bộ nhớ tạm danh sách yêu thích
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  };

  // Lưu thiết lập chế độ ăn kiêng dinh dưỡng (macros) mới
  const updateDietPreset = (presetName, ratios) => {
    const updated = { ...ratios, name: presetName };
    dispatch({ type: ACTIONS.UPDATE_DIET_PRESET, payload: updated });
    localStorage.setItem('diary_diet_preset', JSON.stringify(updated));
  };

  // Hàm bổ trợ để thiết lập ngày đang chọn
  const setSelectedDate = (newDate) => {
    dispatch({ type: ACTIONS.SET_SELECTED_DATE, payload: newDate });
  };

  const updateWaterIntake = async (amount) => {
    try {
      const response = await axiosClient.put('/daily-logs/water', { date: dateString, waterAmount: amount });
      const data = response.data || response;
      if (data) {
        dispatch({ type: ACTIONS.UPDATE_WATER_SUCCESS, payload: data });
      }
      else {
        throw new Error('Không nhận được dữ liệu update water');
      }
    }
    catch (err) {
      console.error('Error update water intake:', err);
      throw err;
    }
  }

  // Cập nhật thông tin cá nhân (username, email, birthDate)
  const updateUserInfo = async (data) => {
    try {
      const response = await axiosClient.put('/user/info', data);
      await fetchUserTarget(); // Refresh user data toàn cục
      return response;
    } catch (err) {
      console.error('Error updating user info:', err);
      throw err;
    }
  };

  // Cập nhật chỉ số thể chất (weight, height, gender, activityLevel)
  const updatePhysicalDetail = async (data) => {
    try {
      const response = await axiosClient.put('/user/physical-detail', data);
      await fetchUserTarget(); // Refresh user data toàn cục
      return response;
    } catch (err) {
      console.error('Error updating physical detail:', err);
      throw err;
    }
  };

  // Cập nhật mục tiêu (goals)
  const updateGoals = async (data) => {
    try {
      const response = await axiosClient.put('/user/goals', data);
      await fetchUserTarget(); // Refresh user data toàn cục
      return response;
    } catch (err) {
      console.error('Error updating goals:', err);
      throw err;
    }
  };

  // Đổi mật khẩu
  const changePassword = async (data) => {
    try {
      const response = await axiosClient.put('/user/password', data);
      return response;
    } catch (err) {
      console.error('Error changing password:', err);
      throw err;
    }
  };

  // Lấy lịch sử cân nặng 7 ngày (hoặc theo custom date)
  const fetchWeightHistory = async (customFrom, customTo, viewMode = 'day', fallbackInitial = 70, fallbackCurrent = 70) => {
    dispatch({ type: ACTIONS.FETCH_WEIGHT_HISTORY_START });
    try {
      const to = customTo || formatLocal(new Date());
      const from = customFrom || formatLocal(new Date(Date.now() - 6 * 86400000));

      let url = `/reports/weight?from=${from}&to=${to}`;
      if (viewMode) url += `&viewMode=${viewMode}`;
      if (fallbackInitial) url += `&fallbackInitial=${fallbackInitial}`;
      if (fallbackCurrent) url += `&fallbackCurrent=${fallbackCurrent}`;

      const res = await axiosClient.get(url);
      const data = res.data || res;
      dispatch({ type: ACTIONS.FETCH_WEIGHT_HISTORY_SUCCESS, payload: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error('Error fetching weight history:', err);
      dispatch({ type: ACTIONS.FETCH_WEIGHT_HISTORY_FAILURE });
    }
  };

  // Đảm bảo hôm nay có bản ghi cân nặng
  const ensureTodayWeight = async () => {
    try {
      await axiosClient.post('/user/weight/ensure');
    } catch (err) {
      console.error('Error ensuring today weight:', err);
    }
  };

  // Cập nhật cân nặng hôm nay (upsert)
  const updateTodayWeight = async (weight) => {
    try {
      await axiosClient.put('/user/weight', { weight });
      await fetchWeightHistory(); // Refresh biểu đồ sau khi cập nhật
    } catch (err) {
      console.error('Error updating today weight:', err);
      throw err;
    }
  };

  // Lấy lịch sử calo tiêu thụ và thặng dư
  const fetchCalorieHistory = async (customFrom, customTo, viewMode = 'day', goalKcal = 2000) => {
    dispatch({ type: ACTIONS.FETCH_CALORIE_HISTORY_START });
    try {
      const to = customTo || formatLocal(new Date());
      const from = customFrom || formatLocal(new Date(Date.now() - 6 * 86400000));
      const res = await axiosClient.get('/reports/calories', {
        params: { from, to, viewMode, goalKcal }
      });
      dispatch({ type: ACTIONS.FETCH_CALORIE_HISTORY_SUCCESS, payload: res.data || res });
    } catch (err) {
      console.error('Error fetching calorie history:', err);
      dispatch({ type: ACTIONS.FETCH_CALORIE_HISTORY_FAILURE });
    }
  };

  const value = {
    state,
    dispatch,
    setSelectedDate,
    fetchDailyOverview,
    fetchUserTarget,
    fetchFavoriteFoodsList,
    logFood,
    deleteLogFood,
    toggleFavorite,
    updateDietPreset,
    updateWaterIntake,
    updateUserInfo,
    updatePhysicalDetail,
    updateGoals,
    changePassword,
    fetchWeightHistory,
    ensureTodayWeight,
    updateTodayWeight,
    fetchCalorieHistory,
  };

  return (
    <DailyLogContext.Provider value={value}>
      {children}
    </DailyLogContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDailyLog = () => {
  const context = useContext(DailyLogContext);
  if (!context) {
    throw new Error('useDailyLog must be used within a DailyLogProvider');
  }
  return context;
};

export default DailyLogProvider;