import { useContext } from 'react';
import { MealPlanContext, DailyLogContext, WorkoutContext } from './context';

export const useMealPlan = () => {
    const context = useContext(MealPlanContext);
    if (!context) {
        throw new Error('useMealPlan must be used within MealPlanProvider');
    }
    return context;
}
export const useDailyLog = () => {
    const context = useContext(DailyLogContext);
    if (!context) {
        throw new Error('useDailyLog must be used within a DailyLogProvider');
    }
    return context;
};
export const useWorkout = () => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkout must be used within a WorkoutProvider');
    }
    return context;
};

