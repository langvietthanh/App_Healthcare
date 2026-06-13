import { createContext, useContext, useReducer } from 'react';
import { initState, reducer } from './reducers';
import { muscleMapEV } from '../../../constants';
import * as ACTIONS from './types';
import axiosClient from '../../../config/axiosClient';

const WorkoutContext = createContext();

const WorkoutProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState);

    const setWorkoutView = (view) => dispatch({ type: ACTIONS.SET_WORKOUT_VIEW, payload: view });
    const setWorkoutActiveTab = (tab) => dispatch({ type: ACTIONS.SET_WORKOUT_ACTIVE_TAB, payload: tab });
    const setWorkoutSearch = (search) => dispatch({ type: ACTIONS.SET_WORKOUT_SEARCH, payload: search });
    const setWorkoutShowFilters = (show) => dispatch({ type: ACTIONS.SET_WORKOUT_SHOW_FILTERS, payload: show });
    const setWorkoutSelectedMuscles = (muscles) => dispatch({ type: ACTIONS.SET_WORKOUT_SELECTED_MUSCLES, payload: muscles });
    const setWorkoutRatingFilter = (rating) => dispatch({ type: ACTIONS.SET_WORKOUT_RATING_FILTER, payload: rating });
    const setWorkoutIsCustom = (isCustom) => dispatch({ type: ACTIONS.SET_WORKOUT_IS_CUSTOM, payload: isCustom });
    const setWorkoutIsFavorite = (isFavorite) => dispatch({ type: ACTIONS.SET_WORKOUT_IS_FAVORITE, payload: isFavorite });

    const setWorkoutSelectedExercise = (exercise) => dispatch({ type: ACTIONS.SET_WORKOUT_SELECTED_EXERCISE, payload: exercise });
    const setWorkoutExerciseMode = (mode) => dispatch({ type: ACTIONS.SET_WORKOUT_EXERCISE_MODE, payload: mode });
    const setWorkoutSets = (sets) => dispatch({ type: ACTIONS.SET_WORKOUT_SETS, payload: sets });
    const setWorkoutRepsOrTime = (val) => dispatch({ type: ACTIONS.SET_WORKOUT_REPS_OR_TIME, payload: val });
    const setWorkoutRestTime = (time) => dispatch({ type: ACTIONS.SET_WORKOUT_REST_TIME, payload: time });

    const setScheduledExercises = (exercises) => dispatch({ type: ACTIONS.SET_SCHEDULED_EXERCISES, payload: exercises });
    const setCurrentExerciseIndex = (index) => dispatch({ type: ACTIONS.SET_CURRENT_EXERCISE_INDEX, payload: index });

    const logExerciseEntry = async (exerciseData) => {
        try {
            const date = new Date().toISOString().slice(0, 10);
            const payload = {
                date,
                exerciseId: exerciseData.id,
                name: exerciseData.name,
                sets: exerciseData.sets,
                reps: exerciseData.mode === 'reps' ? exerciseData.repsOrTime : undefined,
                durationMinutes: exerciseData.mode === 'time' ? exerciseData.repsOrTime : undefined,
            };
            await axiosClient.post('/daily-logs/exercises', payload);
        } catch (err) {
            console.error('Error logging exercise entry:', err);
        }
    };
    const setWorkoutSelectedDate = (date) => dispatch({ type: ACTIONS.SET_WORKOUT_SELECTED_DATE, payload: date });
    const setWorkoutSelectedTime = (time) => dispatch({ type: ACTIONS.SET_WORKOUT_SELECTED_TIME, payload: time });

    const fetchExerciseHistory = async (dateString) => {
        dispatch({ type: ACTIONS.FETCH_EXERCISE_HISTORY_START });
        try {
            const response = await axiosClient.get(`/daily-logs/${dateString}`);
            const data = response.data || response;
            const exercises = data.exercises || [];
            dispatch({ type: ACTIONS.FETCH_EXERCISE_HISTORY_SUCCESS, payload: exercises });
        } catch (err) {
            console.error('Error fetching exercise history:', err);
            dispatch({ type: ACTIONS.FETCH_EXERCISE_HISTORY_FAILURE });
        }
    };

    const fetchExercisesFromBackend = async () => {
        dispatch({ type: ACTIONS.FETCH_EXERCISES_START });
        try {
            let baseUrl = '/exercises';
            if (state.isFavorite) {
                baseUrl = '/exercises/favorites';
            } else if (state.isCustom) {
                baseUrl = '/exercises/my-exercises';
            }

            let url = `${baseUrl}?category=${encodeURIComponent(state.activeTab)}`;
            if (state.search.trim()) {
                url += `&q=${encodeURIComponent(state.search)}`;
            }

            const response = await axiosClient.get(url);
            const data = response.data || response;
            
            if (Array.isArray(data)) {
                // Xử lý trường hợp endpoint /favorites trả về populate { _id, exerciseId: {...} }
                const rawExercises = data.map(item => item.exerciseId ? item.exerciseId : item);

                let mapped = rawExercises.map((e) => ({
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

                // Frontend fallback filtering cho các filter không được hỗ trợ truyền qua URL
                if (state.isFavorite || state.isCustom) {
                    if (state.activeTab) {
                        mapped = mapped.filter(e => e.type === state.activeTab);
                    }
                    if (state.search.trim()) {
                        const q = state.search.toLowerCase();
                        mapped = mapped.filter(e => e.name.toLowerCase().includes(q));
                    }
                }

                if (state.selectedMuscles.length > 0) {
                    mapped = mapped.filter(e => e.muscles.some(m => state.selectedMuscles.includes(m)));
                }

                if (state.ratingFilter.min) {
                    mapped = mapped.filter(e => e.rating >= Number(state.ratingFilter.min));
                }
                if (state.ratingFilter.max) {
                    mapped = mapped.filter(e => e.rating <= Number(state.ratingFilter.max));
                }

                dispatch({ type: ACTIONS.FETCH_EXERCISES_SUCCESS, payload: mapped });
            } else {
                dispatch({ type: ACTIONS.FETCH_EXERCISES_SUCCESS, payload: [] });
            }
        } catch (err) {
            console.error('Error loading user exercises:', err);
            dispatch({ type: ACTIONS.FETCH_EXERCISES_FAILURE });
        }
    };

    const value = {
        state,
        dispatch,
        setWorkoutView,
        setWorkoutActiveTab,
        setWorkoutSearch,
        setWorkoutShowFilters,
        setWorkoutSelectedMuscles,
        setWorkoutRatingFilter,
        setWorkoutIsCustom,
        setWorkoutIsFavorite,
        setWorkoutSelectedExercise,
        setWorkoutExerciseMode,
        setWorkoutSets,
        setWorkoutRepsOrTime,
        setWorkoutRestTime,
        setScheduledExercises,
        setCurrentExerciseIndex,
        setWorkoutSelectedDate,
        setWorkoutSelectedTime,
        fetchExercisesFromBackend,
        logExerciseEntry,
        fetchExerciseHistory,
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};

const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
};

export default WorkoutProvider;
export { useWorkout };