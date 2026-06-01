const emptyForm = { name: '', calories: '', protein: '', carbs: '', fat: '', unit: 'g', amount: '100', image: '' };

const initialState = {
    tab: 'all', // 'all' | 'pending'
    search: '',
    macroFilter: 'all', // 'all', 'high_protein', 'low_fat', 'low_carbs'
    showFilter: false,
    foods: [],
    loading: false,
    showForm: false,
    editItem: null,
    form: emptyForm,
    deleteId: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_TAB': return { ...state, tab: action.payload };
        case 'SET_SEARCH': return { ...state, search: action.payload };
        case 'SET_MACRO_FILTER': return { ...state, macroFilter: action.payload };
        case 'SET_SHOW_FILTER': return { ...state, showFilter: action.payload };
        case 'SET_FOODS': return { ...state, foods: action.payload, loading: false };
        case 'SET_LOADING': return { ...state, loading: action.payload };

        // Form & Modals
        case 'OPEN_ADD_FORM':
            return { ...state, showForm: true, editItem: null, form: emptyForm };
        case 'OPEN_EDIT_FORM':
            return {
                ...state,
                showForm: true,
                editItem: action.payload,
                form: {
                    ...action.payload,
                    calories: String(action.payload.calories),
                    protein: String(action.payload.protein),
                    carbs: String(action.payload.carbs),
                    fat: String(action.payload.fat),
                    amount: String(action.payload.amount),
                    image: action.payload.image || ''
                }
            };
        case 'CLOSE_FORM': return { ...state, showForm: false };
        case 'UPDATE_FORM':
            return { ...state, form: typeof action.payload === 'function' ? action.payload(state.form) : action.payload };
        case 'SET_DELETE_ID': return { ...state, deleteId: action.payload };
        default: return state;
    }
};

export default reducer;
export { initialState };