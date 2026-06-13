import * as TYPES from './types.js'
import { muscleMapEV } from '../../../constants';
export const emptyForm = { name: '', category: 'Strength', targetMuscles: [], level: 'Trung bình', description: '', instructions: [''], image: '' };

const initialState = {
    tab: 'all',
    search: '',
    exercises: [],
    loading: false,
    filterCategory: '',
    filterMuscle: '',
    showFilter: false,
    showForm: false,
    editItem: null,
    form: emptyForm,
    deleteId: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_TAB':
            return { ...state, tab: action.payload };
        case TYPES.SET_SEARCH:
            return { ...state, search: action.payload };
        case TYPES.SET_EXERCISES:
            return { ...state, exercises: action.payload, loading: false };
        case TYPES.SET_LOADING:
            return { ...state, loading: action.payload };
        case TYPES.SET_FILTER_CATEGORY:
            return { ...state, filterCategory: action.payload };
        case TYPES.SET_FILTER_MUSCLE:
            return { ...state, filterMuscle: action.payload };
        case TYPES.TOGGLE_FILTER:
            return { ...state, showFilter: !state.showFilter };
        case TYPES.OPEN_ADD_FORM:
            return { ...state, form: emptyForm, editItem: null, showForm: true };
        case TYPES.OPEN_EDIT_FORM:
            return {
                ...state,
                editItem: action.payload,
                form: {
                    ...action.payload,
                    targetMuscles: action.payload.targetMuscles ? action.payload.targetMuscles.map(m => ({
                        muscle: muscleMapEV[m.muscle] || m.muscle,
                        rating: m.rating
                    })) : [],
                    description: action.payload.description || '',
                    instructions: action.payload.instructions?.length ? action.payload.instructions : [''],
                    image: action.payload.image || ''
                },
                showForm: true
            };
        case TYPES.CLOSE_FORM:
            return { ...state, showForm: false };
        case TYPES.SET_FORM:
            return { ...state, form: action.payload };
        case TYPES.SET_DELETE_ID:
            return { ...state, deleteId: action.payload };
        default:
            return state;
    }
};

export default reducer;
export { initialState };