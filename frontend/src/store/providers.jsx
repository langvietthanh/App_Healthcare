import { useReducer } from 'react';
import reducerDailyLog, { initState as initStateDailyLog } from './reducers/dailyLog';
import reducerMealPlan, { initState as initStateMealPlan } from './reducers/mealPlan';
import reducerWorkout, { initState as initStateWorkout } from './reducers/workout';
import { MealPlanContext, DailyLogContext, WorkoutContext } from './context';
import * as actions from './actions';

const MealPlanProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducerMealPlan, initStateMealPlan);
    const value = {
        state,
        dispatch,
        fetchFoodOptions: actions.fetchFoodOptions(dispatch),
        setActiveMeal: actions.setActiveMeal(dispatch),
        setActiveTab: actions.setActiveTab(dispatch),
        setSearch: actions.setSearch(dispatch),
        setSelectedFood: actions.setSelectedFood(dispatch)
    }

    return <MealPlanContext.Provider value={value}>
        {children}
    </MealPlanContext.Provider>
}

const DailyLogProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducerDailyLog, initStateDailyLog);

    const value = {
        state,
        dispatch,
        setSelectedDate: actions.setSelectedDate(dispatch),
        fetchDailyOverview: actions.fetchDailyOverview(dispatch, state),
        fetchUserTarget: actions.fetchUserTarget(dispatch),
        fetchFavoriteFoodsList: actions.fetchFavoriteFoodsList(dispatch),
        logFood: actions.logFood(dispatch, state),
        deleteLogFood: actions.deleteLogFood(dispatch, state),
        toggleFavorite: actions.toggleFavorite(dispatch),
        updateDietPreset: actions.updateDietPreset(dispatch),
        updateWaterIntake: actions.updateWaterIntake(dispatch, state),
    };

    return (
        <DailyLogContext.Provider value={value}>
            {children}
        </DailyLogContext.Provider>
    );
};

const WorkoutProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducerWorkout, initStateWorkout);

    const value = {
        state,
        dispatch,
        setWorkoutView: actions.setWorkoutView(dispatch),
        setWorkoutActiveTab: actions.setWorkoutActiveTab(dispatch),
        setWorkoutSearch: actions.setWorkoutSearch(dispatch),
        setWorkoutShowFilters: actions.setWorkoutShowFilters(dispatch),
        setWorkoutSelectedMuscles: actions.setWorkoutSelectedMuscles(dispatch),
        setWorkoutRatingFilter: actions.setWorkoutRatingFilter(dispatch),
        setWorkoutIsCustom: actions.setWorkoutIsCustom(dispatch),
        setWorkoutIsFavorite: actions.setWorkoutIsFavorite(dispatch),
        setWorkoutSelectedExercise: actions.setWorkoutSelectedExercise(dispatch),
        setWorkoutExerciseMode: actions.setWorkoutExerciseMode(dispatch),
        setWorkoutSets: actions.setWorkoutSets(dispatch),
        setWorkoutRepsOrTime: actions.setWorkoutRepsOrTime(dispatch),
        setWorkoutRestTime: actions.setWorkoutRestTime(dispatch),
        setScheduledExercises: actions.setScheduledExercises(dispatch),
        setCurrentExerciseIndex: actions.setCurrentExerciseIndex(dispatch),
        setWorkoutSelectedDate: actions.setWorkoutSelectedDate(dispatch),
        setWorkoutSelectedTime: actions.setWorkoutSelectedTime(dispatch),
        fetchExercisesFromBackend: actions.fetchExercisesFromBackend(dispatch, state),
        logExerciseEntry: actions.logExerciseEntry(dispatch),
        fetchExerciseHistory: actions.fetchExerciseHistory(dispatch)
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};

export { MealPlanProvider, DailyLogProvider, WorkoutProvider };
