import { createContext, useContext, useReducer } from "react"
import { initState, reducer } from "./reducer";
import axiosClient from "../../../config/axiosClient";
import * as ACTIONS from './types';
const MealPlanContext = createContext();

const MealPlanProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState);

    const fetchFoodOptions = async (searchKeyword, activeTab) => {
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

    const setActiveMeal = (meal) => dispatch({ type: ACTIONS.SET_ACTIVE_MEAL, payload: meal });
    const setActiveTab = (tab) => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab });
    const setSearch = (search) => dispatch({ type: ACTIONS.SET_SEARCH, payload: search });
    const setSelectedFood = (food) => dispatch({ type: ACTIONS.SET_SELECTED_FOOD, payload: food });

    const value = {
        state,
        dispatch,
        fetchFoodOptions,
        setActiveMeal,
        setActiveTab,
        setSearch,
        setSelectedFood
    }

    return <MealPlanContext.Provider value={value}>
        {children}
    </MealPlanContext.Provider>
}

const useMealPlan = () => {
    const context = useContext(MealPlanContext);
    if (!context) {
        throw new Error('useMealPlan must be used within MealPlanProvider');
    }
    return context;
}

export default MealPlanProvider;
export { useMealPlan };

