import * as TYPES from "./types"

const initState = {
    users: [],
    loading: false,
    error: null,
}


const reducer = (state, action) => {

    switch (action.type) {
        case TYPES.FETCH_ALL_USER:
            return { ...state, users: action.payload }
        case TYPES.DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user._id !== action.payload)
            }
        default:
            return state;
    }

}


export { initState, reducer };