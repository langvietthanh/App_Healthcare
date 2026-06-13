/**
 * Tác dụng của file: Khai báo Context quản lý và điều phối các Async Actions kết nối live với Backend API cho Nhật ký & Thực đơn của User.
 * File này import ACTIONS, reducer, và initState từ thư mục con vệ tinh dailyLog/.
 */
import { createContext, useContext, useReducer } from 'react';
import axiosClient from '../../../config/axiosClient';
import { ACTIONS } from './types';
import { reducer, initState } from './reducer';

const DailyLogContext = createContext();

const DailyLogProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);

  const dateString = state.selectedDate.toISOString().slice(0, 10);

  // Fetch daily overview from server
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

  // Fetch user profile targets
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

  // Fetch user favorites list
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

  // Log new food to database
  const logFood = async (payload) => {
    try {
      await axiosClient.post('/daily-logs/foods', payload);
      await fetchDailyOverview(); // Reload
    } catch (err) {
      console.error('Error logging food:', err);
      throw err;
    }
  };

  // Delete logged food entry
  const deleteLogFood = async (entryId) => {
    try {
      await axiosClient.delete(`/daily-logs/foods/${entryId}`);
      await fetchDailyOverview(); // Reload
    } catch (err) {
      console.error('Error deleting logged food:', err);
      throw err;
    }
  };

  // Toggle favorite food
  const toggleFavorite = async (foodId, isFavoriteNow) => {
    try {
      if (isFavoriteNow) {
        await axiosClient.delete(`/foods/favorites/${foodId}`);
      } else {
        await axiosClient.post('/foods/favorites', { foodId });
      }
      await fetchFavoriteFoodsList(); // Reload cache
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    }
  };

  // Save new macro diet preset
  const updateDietPreset = (presetName, ratios) => {
    const updated = { ...ratios, name: presetName };
    dispatch({ type: ACTIONS.UPDATE_DIET_PRESET, payload: updated });
    localStorage.setItem('diary_diet_preset', JSON.stringify(updated));
  };

  // Helper setter for active selected Date
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

  // \u0110\u1ed5i m\u1eadt kh\u1ea9u
  const changePassword = async (data) => {
    try {
      const response = await axiosClient.put('/user/password', data);
      return response;
    } catch (err) {
      console.error('Error changing password:', err);
      throw err;
    }
  };

  // L\u1ea5y l\u1ecbch s\u1eed c\u00e2n n\u1eb7ng 7 ng\u00e0y
  const fetchWeightHistory = async () => {
    dispatch({ type: ACTIONS.FETCH_WEIGHT_HISTORY_START });
    try {
      const to = new Date().toISOString().slice(0, 10);
      const from = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
      const res = await axiosClient.get(`/reports/weight?from=${from}&to=${to}`);
      const data = res.data || res;
      dispatch({ type: ACTIONS.FETCH_WEIGHT_HISTORY_SUCCESS, payload: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error('Error fetching weight history:', err);
      dispatch({ type: ACTIONS.FETCH_WEIGHT_HISTORY_FAILURE });
    }
  };

  // \u0110\u1ea3m b\u1ea3o h\u00f4m nay c\u00f3 b\u1ea3n ghi c\u00e2n n\u1eb7ng
  const ensureTodayWeight = async () => {
    try {
      await axiosClient.post('/user/weight/ensure');
    } catch (err) {
      console.error('Error ensuring today weight:', err);
    }
  };

  // C\u1eadp nh\u1eadt c\u00e2n n\u1eb7ng h\u00f4m nay (upsert)
  const updateTodayWeight = async (weight) => {
    try {
      await axiosClient.put('/user/weight', { weight });
      await fetchWeightHistory(); // Refresh bi\u1ec3u \u0111\u1ed3 sau khi c\u1eadp nh\u1eadt
    } catch (err) {
      console.error('Error updating today weight:', err);
      throw err;
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
    changePassword,
    fetchWeightHistory,
    ensureTodayWeight,
    updateTodayWeight,
  };

  return (
    <DailyLogContext.Provider value={value}>
      {children}
    </DailyLogContext.Provider>
  );
};

// Custom Hook to consume Context safely
const useDailyLog = () => {
  const context = useContext(DailyLogContext);
  if (!context) {
    throw new Error('useDailyLog must be used within a DailyLogProvider');
  }
  return context;
};

export default DailyLogProvider;
export { useDailyLog };