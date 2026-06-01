export const emptyForm = { name: '', category: 'Strength', muscles: [], level: 'Trung bình', description: '', instructions: [''], image: '' };

const initialState = {
    search: '',
    exercises: [],
    loading: false,
    filterCategory: '',
    filterMuscle: '',
    filterLevel: '',
    showFilter: false,
    showForm: false,
    editItem: null,
    form: emptyForm,
    deleteId: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_SEARCH':
            return { ...state, search: action.payload };
        case 'SET_EXERCISES':
            return { ...state, exercises: action.payload, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_FILTER_CATEGORY':
            return { ...state, filterCategory: action.payload };
        case 'SET_FILTER_MUSCLE':
            return { ...state, filterMuscle: action.payload };
        case 'SET_FILTER_LEVEL':
            return { ...state, filterLevel: action.payload };
        case 'TOGGLE_FILTER':
            return { ...state, showFilter: !state.showFilter };
        case 'OPEN_ADD_FORM':
            return { ...state, form: emptyForm, editItem: null, showForm: true };
        case 'OPEN_EDIT_FORM':
            return { 
                ...state, 
                editItem: action.payload, 
                form: {
                    ...action.payload,
                    description: action.payload.description || '',
                    instructions: action.payload.instructions?.length ? action.payload.instructions : [''],
                    image: action.payload.image || ''
                }, 
                showForm: true 
            };
        case 'CLOSE_FORM':
            return { ...state, showForm: false };
        case 'SET_FORM':
            return { ...state, form: action.payload };
        case 'SET_DELETE_ID':
            return { ...state, deleteId: action.payload };
        default:
            return state;
    }
};

export default reducer;
export { initialState };