/**
 * Tác dụng của file: Khai báo Context quản lý và điều phối các Async Actions kết nối live với Backend API cho Nhật ký & Thực đơn của User.
 * File này import ACTIONS, reducer, và initState từ thư mục con vệ tinh dailyLog/.
 */
import React, { createContext, useContext, useReducer } from 'react';
import axiosClient from '../config/axiosClient';
import { ACTIONS } from './dailyLog/types';
import { reducer, initState } from './dailyLog/reducer';

const DailyLogContext = createContext();

export const DailyLogProvider = ({ children }) => {
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

  const fetchReport = async () => {
    try {
      const res = await axiosClient.get('/reports/weekly');
      const data = res.data || res;
      setReport(data);
    } catch (err) {
      console.error('Error fetching weekly report:', err);
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
  };

  return (
    <DailyLogContext.Provider value={value}>
      {children}
    </DailyLogContext.Provider>
  );
};

// Custom Hook to consume Context safely
export const useDailyLog = () => {
  const context = useContext(DailyLogContext);
  if (!context) {
    throw new Error('useDailyLog must be used within a DailyLogProvider');
  }
  return context;
};
