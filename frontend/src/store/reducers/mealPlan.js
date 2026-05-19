import * as ACTIONS from '../types';

export const initState = {
    activeMeal: null,
    activeTab: 'all',
    search: '',
    listFoods: [],
    loadingSearch: false,
    selectedFood: null
}

const reducerMealPlan = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_ACTIVE_MEAL:
            return { ...state, activeMeal: action.payload };
        case ACTIONS.SET_ACTIVE_TAB:
            return { ...state, activeTab: action.payload };
        case ACTIONS.SET_SEARCH:
            return { ...state, search: action.payload };
        case ACTIONS.FETCH_FOODS_START:
            return { ...state, loadingSearch: true };
        case ACTIONS.FETCH_FOODS_SUCCESS:
            return { ...state, loadingSearch: false, listFoods: action.payload };
        case ACTIONS.FETCH_FOODS_FAILURE:
            return { ...state, loadingSearch: false, listFoods: [] };
        case ACTIONS.SET_SELECTED_FOOD:
            return { ...state, selectedFood: action.payload };
        default:
            return state;
    }
}

export default reducerMealPlan;
