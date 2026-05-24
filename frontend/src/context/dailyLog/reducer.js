/**
 * Tác dụng của file: Định nghĩa trạng thái ban đầu (initState) và hàm biến đổi trạng thái thuần khiết (reducer) cho DailyLog.
 */
import { ACTIONS } from './types';

export const initState = {
  selectedDate: new Date(),
  dailyLog: null,
  foodsLogged: [],
  targetCalories: 2000,
  user: null, // Lưu trữ thông tin User toàn cục dùng cho Sidebar và các trang khác
  favoriteFoodsList: [],
  dietPreset: (() => {
    const cached = localStorage.getItem('diary_diet_preset');
    return cached ? JSON.parse(cached) : { carbs: 40, protein: 40, fat: 20, name: 'Cân Bằng' };
  })(),
  loading: false,

  // Weight history (biểu đồ cân nặng)
  weightHistory: [],
  weightLoading: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_DATE:
      return { ...state, selectedDate: action.payload };

    case ACTIONS.FETCH_DAILY_LOG_START:
      return { ...state, loading: true };

    case ACTIONS.FETCH_DAILY_LOG_SUCCESS:
      return {
        ...state,
        dailyLog: action.payload.log,
        foodsLogged: action.payload.foods || [],
        loading: false
      };

    case ACTIONS.FETCH_USER_GOAL_SUCCESS:
      return { 
        ...state, 
        user: action.payload,
        targetCalories: action.payload?.goals?.dailyCalories || 2000 
      };

    case ACTIONS.FETCH_FAVORITES_SUCCESS:
      return { ...state, favoriteFoodsList: action.payload };

    case ACTIONS.UPDATE_DIET_PRESET:
      return { ...state, dietPreset: action.payload };

    case ACTIONS.UPDATE_WATER_SUCCESS:
      return { ...state, dailyLog: action.payload };

    case ACTIONS.FETCH_WEIGHT_HISTORY_START:
      return { ...state, weightLoading: true };
    case ACTIONS.FETCH_WEIGHT_HISTORY_SUCCESS:
      return { ...state, weightLoading: false, weightHistory: action.payload };
    case ACTIONS.FETCH_WEIGHT_HISTORY_FAILURE:
      return { ...state, weightLoading: false, weightHistory: [] };

    default:
      return state;
  }
};
