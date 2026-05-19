import * as ACTIONS from './types';
import axiosClient from '../config/axiosClient';

// ============================================
// 1. MEAL PLAN ACTIONS (Chỉ cần dispatch)
// ============================================

export const fetchFoodOptions = (dispatch) => async (searchKeyword, activeTab) => {
    dispatch({ type: ACTIONS.FETCH_FOODS_START });
    try {
        let endpoint = `/foods?q=${encodeURIComponent(searchKeyword)}`;
        if (activeTab === 'favorite') {
            endpoint = '/foods/favorites';
        }
        else if (activeTab === 'custom') {
            endpoint = '/foods/my-foods'
        }
        const response = await axiosClient.get(endpoint);
        const data = response.data || response;
        if (Array.isArray(data)) {
            const mapped = data.map(e => ({
                id: e._id,
                name: e.name,
                kcal: e.nutrients?.calories || 0,
                carbs: e.nutrients?.carbs || 0,
                protein: e.nutrients?.protein || 0,
                fat: e.nutrients?.fat || 0,
                unit: e.servingSize?.unit || 'g',
                amount: e.servingSize?.amount || 100,
                desc: `${e.servingSize?.amount || 100}${e.servingSize?.unit || 'g'}`,
                image: e.imgURL || ''
            }));
            dispatch({ type: ACTIONS.FETCH_FOODS_SUCCESS, payload: mapped });
        }
        else {
            dispatch({ type: ACTIONS.FETCH_FOODS_SUCCESS, payload: [] });
        }
    }
    catch (error) {
        console.log("Error fetching food options", error);
        dispatch({ type: ACTIONS.FETCH_FOODS_FAILURE });
    }
}

export const setActiveMeal = (dispatch) => (meal) => dispatch({ type: ACTIONS.SET_ACTIVE_MEAL, payload: meal });
export const setActiveTab = (dispatch) => (tab) => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab });
export const setSearch = (dispatch) => (search) => dispatch({ type: ACTIONS.SET_SEARCH, payload: search });
export const setSelectedFood = (dispatch) => (food) => dispatch({ type: ACTIONS.SET_SELECTED_FOOD, payload: food });


// ============================================
// 2. DAILY LOG ACTIONS (Cần dispatch và đôi khi cần state)
// ============================================

export const fetchDailyOverview = (dispatch, state) => async (customDateStr) => {
    dispatch({ type: ACTIONS.FETCH_DAILY_LOG_START });
    try {
        // Lấy ngày từ state vì hàm này được gọi khi date thay đổi
        const dateString = state.selectedDate.toISOString().slice(0, 10);
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

export const fetchUserTarget = (dispatch) => async () => {
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

export const fetchFavoriteFoodsList = (dispatch) => async () => {
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

export const logFood = (dispatch, state) => async (payload) => {
    try {
        await axiosClient.post('/daily-logs/foods', payload);
        await fetchDailyOverview(dispatch, state)(); // Reload data sau khi log
    } catch (err) {
        console.error('Error logging food:', err);
        throw err;
    }
};

export const deleteLogFood = (dispatch, state) => async (entryId) => {
    try {
        await axiosClient.delete(`/daily-logs/foods/${entryId}`);
        await fetchDailyOverview(dispatch, state)(); // Reload
    } catch (err) {
        console.error('Error deleting logged food:', err);
        throw err;
    }
};

export const toggleFavorite = (dispatch) => async (foodId, isFavoriteNow) => {
    try {
        if (isFavoriteNow) {
            await axiosClient.delete(`/foods/favorites/${foodId}`);
        } else {
            await axiosClient.post('/foods/favorites', { foodId });
        }
        await fetchFavoriteFoodsList(dispatch)(); // Reload cache
    } catch (err) {
        console.error('Error toggling favorite:', err);
        throw err;
    }
};

export const updateDietPreset = (dispatch) => (presetName, ratios) => {
    const updated = { ...ratios, name: presetName };
    dispatch({ type: ACTIONS.UPDATE_DIET_PRESET, payload: updated });
    localStorage.setItem('diary_diet_preset', JSON.stringify(updated));
};

export const setSelectedDate = (dispatch) => (newDate) => {
    dispatch({ type: ACTIONS.SET_SELECTED_DATE, payload: newDate });
};

export const updateWaterIntake = (dispatch, state) => async (amount) => {
    try {
        const dateString = state.selectedDate.toISOString().slice(0, 10);
        const response = await axiosClient.put('/daily-logs/water', { date: dateString, waterAmount: amount });
        const data = response.data || response;
        if (data) {
            dispatch({ type: ACTIONS.UPDATE_WATER_SUCCESS, payload: data });
        } else {
            throw new Error('Không nhận được dữ liệu update water');
        }
    } catch (err) {
        console.error('Error update water intake:', err);
        throw err;
    }
}

// ============================================
// 3. WORKOUT ACTIONS (Cần dispatch)
// ============================================

export const setWorkoutView = (dispatch) => (view) => dispatch({ type: ACTIONS.SET_WORKOUT_VIEW, payload: view });
export const setWorkoutActiveTab = (dispatch) => (tab) => dispatch({ type: ACTIONS.SET_WORKOUT_ACTIVE_TAB, payload: tab });
export const setWorkoutSearch = (dispatch) => (search) => dispatch({ type: ACTIONS.SET_WORKOUT_SEARCH, payload: search });
export const setWorkoutShowFilters = (dispatch) => (show) => dispatch({ type: ACTIONS.SET_WORKOUT_SHOW_FILTERS, payload: show });
export const setWorkoutSelectedMuscles = (dispatch) => (muscles) => dispatch({ type: ACTIONS.SET_WORKOUT_SELECTED_MUSCLES, payload: muscles });
export const setWorkoutRatingFilter = (dispatch) => (rating) => dispatch({ type: ACTIONS.SET_WORKOUT_RATING_FILTER, payload: rating });
export const setWorkoutIsCustom = (dispatch) => (isCustom) => dispatch({ type: ACTIONS.SET_WORKOUT_IS_CUSTOM, payload: isCustom });
export const setWorkoutIsFavorite = (dispatch) => (isFavorite) => dispatch({ type: ACTIONS.SET_WORKOUT_IS_FAVORITE, payload: isFavorite });

export const setWorkoutSelectedExercise = (dispatch) => (exercise) => dispatch({ type: ACTIONS.SET_WORKOUT_SELECTED_EXERCISE, payload: exercise });
export const setWorkoutExerciseMode = (dispatch) => (mode) => dispatch({ type: ACTIONS.SET_WORKOUT_EXERCISE_MODE, payload: mode });
export const setWorkoutSets = (dispatch) => (sets) => dispatch({ type: ACTIONS.SET_WORKOUT_SETS, payload: sets });
export const setWorkoutRepsOrTime = (dispatch) => (val) => dispatch({ type: ACTIONS.SET_WORKOUT_REPS_OR_TIME, payload: val });
export const setWorkoutRestTime = (dispatch) => (time) => dispatch({ type: ACTIONS.SET_WORKOUT_REST_TIME, payload: time });

export const setScheduledExercises = (dispatch) => (exercises) => dispatch({ type: ACTIONS.SET_SCHEDULED_EXERCISES, payload: exercises });
export const setCurrentExerciseIndex = (dispatch) => (index) => dispatch({ type: ACTIONS.SET_CURRENT_EXERCISE_INDEX, payload: index });
export const setWorkoutSelectedDate = (dispatch) => (date) => dispatch({ type: ACTIONS.SET_WORKOUT_SELECTED_DATE, payload: date });
export const setWorkoutSelectedTime = (dispatch) => (time) => dispatch({ type: ACTIONS.SET_WORKOUT_SELECTED_TIME, payload: time });

export const fetchExercisesFromBackend = (dispatch, state) => async () => {
    dispatch({ type: ACTIONS.FETCH_EXERCISES_START });
    try {
        let url = `/exercises?category=${state.activeTab}`;
        if (state.search.trim()) {
            url += `&q=${encodeURIComponent(state.search)}`;
        }
        
        const response = await axiosClient.get(url);
        const data = response.data || response;
        if (Array.isArray(data)) {
            // Mapping muscleMapEV inline for now to avoid dependency
            const muscleMapEV = {
                'Chest': 'Ngực', 'Back': 'Lưng', 'Legs': 'Chân',
                'Shoulders': 'Vai', 'Arms': 'Tay', 'Core': 'Bụng',
                'Full Body': 'Toàn thân'
            };
            
            const mapped = data.map((e) => ({
                id: e._id,
                name: e.name,
                rating: e.targetMuscles?.[0]?.rating || 4.8,
                time: '15 phút', // Fallback display time
                kcal: e.category === 'Cardio' ? 300 : 180, 
                img: e.imgURL || (e.category === 'Cardio' ? '🏃‍♂️' : '🏋️'),
                type: e.category || 'Strength',
                description: e.description || '',
                instructions: e.instructions?.map(ins => ins.text) || [],
                muscles: e.targetMuscles?.map(m => muscleMapEV[m.muscle] || m.muscle) || []
            }));
            dispatch({ type: ACTIONS.FETCH_EXERCISES_SUCCESS, payload: mapped });
        } else {
            dispatch({ type: ACTIONS.FETCH_EXERCISES_SUCCESS, payload: [] });
        }
    } catch (err) {
        console.error('Error loading user exercises:', err);
        dispatch({ type: ACTIONS.FETCH_EXERCISES_FAILURE });
    }
};