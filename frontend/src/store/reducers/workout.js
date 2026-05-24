import * as ACTIONS from '../types';

export const initState = {
    // Navigation State
    view: 'schedule', // 'schedule' | 'list' | 'session' | 'detail' | 'search'

    // Search State
    activeTab: 'Cardio',
    search: '',
    showFilters: false,
    selectedMuscles: [],
    ratingFilter: { min: '', max: '' },
    isCustom: false,
    isFavorite: false,

    // Dynamic exercise lists from backend
    listExercises: [],
    loading: false,

    // Detail State
    selectedExercise: null,
    exerciseMode: 'reps', // 'reps' | 'time'
    sets: 3,
    repsOrTime: 12,
    restTime: 30,

    // Schedule State (Mock/Local session schedule)
    scheduledExercises: [],
    currentExerciseIndex: 0,
    selectedDate: new Date(),
    selectedTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),

    // Exercise History (Past date logs from DB)
    exerciseHistory: [],
    historyLoading: false
};

const reducerWorkout = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_WORKOUT_VIEW:
            return { ...state, view: action.payload };
        case ACTIONS.SET_WORKOUT_ACTIVE_TAB:
            return { ...state, activeTab: action.payload };
        case ACTIONS.SET_WORKOUT_SEARCH:
            return { ...state, search: action.payload };
        case ACTIONS.SET_WORKOUT_SHOW_FILTERS:
            return { ...state, showFilters: action.payload };
        case ACTIONS.SET_WORKOUT_SELECTED_MUSCLES:
            return { ...state, selectedMuscles: action.payload };
        case ACTIONS.SET_WORKOUT_RATING_FILTER:
            return { ...state, ratingFilter: action.payload };
        case ACTIONS.SET_WORKOUT_IS_CUSTOM:
            return { ...state, isCustom: action.payload };
        case ACTIONS.SET_WORKOUT_IS_FAVORITE:
            return { ...state, isFavorite: action.payload };

        case ACTIONS.FETCH_EXERCISES_START:
            return { ...state, loading: true };
        case ACTIONS.FETCH_EXERCISES_SUCCESS:
            return { ...state, loading: false, listExercises: action.payload };
        case ACTIONS.FETCH_EXERCISES_FAILURE:
            return { ...state, loading: false, listExercises: [] };

        case ACTIONS.SET_WORKOUT_SELECTED_EXERCISE:
            return { ...state, selectedExercise: action.payload };
        case ACTIONS.SET_WORKOUT_EXERCISE_MODE:
            return { ...state, exerciseMode: action.payload };
        case ACTIONS.SET_WORKOUT_SETS:
            return { ...state, sets: action.payload };
        case ACTIONS.SET_WORKOUT_REPS_OR_TIME:
            return { ...state, repsOrTime: action.payload };
        case ACTIONS.SET_WORKOUT_REST_TIME:
            return { ...state, restTime: action.payload };

        case ACTIONS.SET_SCHEDULED_EXERCISES:
            return { ...state, scheduledExercises: action.payload };
        case ACTIONS.SET_CURRENT_EXERCISE_INDEX:
            return { ...state, currentExerciseIndex: action.payload };
        case ACTIONS.SET_WORKOUT_SELECTED_DATE:
            return { ...state, selectedDate: action.payload };
        case ACTIONS.SET_WORKOUT_SELECTED_TIME:
            return { ...state, selectedTime: action.payload };

        case ACTIONS.FETCH_EXERCISE_HISTORY_START:
            return { ...state, historyLoading: true, exerciseHistory: [] };
        case ACTIONS.FETCH_EXERCISE_HISTORY_SUCCESS:
            return { ...state, historyLoading: false, exerciseHistory: action.payload };
        case ACTIONS.FETCH_EXERCISE_HISTORY_FAILURE:
            return { ...state, historyLoading: false, exerciseHistory: [] };

        default:
            return state;
    }
};

export default reducerWorkout;
