import * as TYPES from "./types"
import { Users, Utensils, Dumbbell, UserPlus, TrendingUp } from 'lucide-react';

const initState = {
    totalUsers: 0,
    newUsers7d: 0,
    newUsers30d: 0,
    totalFoods: 0,
    totalExercises: 0,
    pendingItems: {
        foods: 0,
        exercises: 0,
        total: 0
    },
    newUsersWeekly: { totalUsers: 0, chartData: [] },
    newUsersMonthly: { totalUsers: 0, chartData: [] },
    dailyLogCount: [],
    stats: [
        { icon: Users, label: 'Tổng người dùng', value: '0', sub: 'Đang cập nhật...', color: '#c8f31d', trend: 0 },
        { icon: UserPlus, label: 'Người dùng mới (7d)', value: '0', sub: 'Đang cập nhật...', color: '#22c55e', trend: 0 },
        { icon: Utensils, label: 'Tổng món ăn', value: '0', sub: 'trong hệ thống', color: '#f97316', trend: 0 },
        { icon: Dumbbell, label: 'Tổng bài tập', value: '0', sub: 'trong hệ thống', color: '#a78bfa', trend: 0 },
    ],
}

const reducer = (state, action) => {

    switch (action.type) {
        case TYPES.FETCH_DASHBOARD: {
            const payload = action.payload || {};
            const newStats = state.stats.map((stat, index) => {
                if (index === 0 && payload.totalUsers !== undefined) return { 
                    ...stat, 
                    value: payload.totalUsers,
                    trend: payload.userTrend ?? stat.trend,
                    sub: payload.userSubText ?? stat.sub 
                };
                if (index === 1 && payload.newUsers7d !== undefined) return { 
                    ...stat, 
                    value: payload.newUsers7d,
                    trend: payload.newUserTrend ?? stat.trend,
                    sub: payload.newUserSubText ?? stat.sub 
                };
                if (index === 2 && payload.totalFoods !== undefined) return { 
                    ...stat, 
                    value: payload.totalFoods,
                    trend: payload.foodTrend ?? stat.trend 
                };
                if (index === 3 && payload.totalExercises !== undefined) return { 
                    ...stat, 
                    value: payload.totalExercises,
                    trend: payload.exerciseTrend ?? stat.trend 
                };
                return stat;
            });

            return { ...state, ...payload, stats: newStats };
        }
        case TYPES.SET_START:
            return { ...state, ...action.payload }
        default:
            return state;
    }

}

export { initState, reducer };