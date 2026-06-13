import * as TYPES from "./types"

export const defaultFilters = {
  gender: 'all',
  ageMin: '',
  ageMax: '',
  activityLevel: 'all',
  bmiStatus: 'all',
  dateFrom: '',
  dateTo: '',
};

const initState = {
    users: [],
    loading: false,
    error: null,
    search: '',
    filters: defaultFilters,
    tab: 'all',
}


const reducer = (state, action) => {

    switch (action.type) {
        case TYPES.FETCH_ALL_USER:
            return { ...state, users: action.payload }
        case TYPES.UPDATE_USER:
            return {
                ...state,
                users: state.users.map(user => 
                    user._id === action.payload._id ? action.payload : user
                )
            }
        case TYPES.SET_SEARCH:
            return { ...state, search: action.payload }
        case TYPES.SET_FILTERS:
            return { ...state, filters: action.payload }
        case TYPES.SET_TAB:
            return { ...state, tab: action.payload }
        default:
            return state;
    }

}


export { initState, reducer };