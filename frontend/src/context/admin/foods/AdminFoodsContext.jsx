import { createContext, useContext, useReducer } from "react";
import reducer, { initialState } from "./reducer";
import axiosClient from "../../../config/axiosClient";
import * as TYPES from "./types";

const AdminFoodsContext = createContext();

const AdminFoodsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setTab = (val) => dispatch({ type: TYPES.SET_TAB, payload: val });
    const setSearch = (val) => dispatch({ type: TYPES.SET_SEARCH, payload: val });
    const setMacroFilter = (val) => dispatch({ type: TYPES.SET_MACRO_FILTER, payload: val });
    const setShowFilter = (val) => dispatch({ type: TYPES.SET_SHOW_FILTER, payload: val });
    const setDeleteId = (val) => dispatch({ type: TYPES.SET_DELETE_ID, payload: val });
    const setForm = (val) => dispatch({ type: TYPES.UPDATE_FORM, payload: val });


    const fetchFoods = async () => {
        dispatch({ type: TYPES.SET_LOADING, payload: true });
        try {
            const endpoint = state.tab === 'pending' ? '/foods/pending' : '/foods';
            const response = await axiosClient.get(endpoint);
            const data = response.data || response;

            if (Array.isArray(data)) {
                const mapped = data.map(e => ({
                    id: e._id,
                    name: e.name,
                    calories: e.nutrients?.calories || 0,
                    protein: e.nutrients?.protein || 0,
                    carbs: e.nutrients?.carbs || 0,
                    fat: e.nutrients?.fat || 0,
                    unit: e.servingSize?.unit || 'g',
                    amount: e.servingSize?.amount || 100,
                    status: e.verifyStatus || 'approved',
                    createdAt: e.createdAt ? e.createdAt.slice(0, 10) : '',
                    creator: e.creatorId ? 'Người dùng' : 'Hệ thống',
                    image: e.imgURL || '',
                    isPublic: e.isPublic !== undefined ? e.isPublic : true
                }));
                dispatch({ type: TYPES.SET_FOODS, payload: mapped });
            }
        } catch (err) {
            console.error('Error fetching foods:', err);
            dispatch({ type: TYPES.SET_LOADING, payload: false });
        }
    };

    const openAdd = () => dispatch({ type: TYPES.OPEN_ADD_FORM });
    const openEdit = (item) => dispatch({ type: TYPES.OPEN_EDIT_FORM, payload: item });
    const closeForm = () => dispatch({ type: TYPES.CLOSE_FORM });
    const handleImageFile = (e) => { const f = e.target.files[0]; if (f) setForm(p => ({ ...p, image: URL.createObjectURL(f) })); };

    const handleSave = async () => {
        if (!state.form.name.trim()) return;

        const p = +state.form.protein || 0;
        const c = +state.form.carbs || 0;
        const f = +state.form.fat || 0;
        const computedCalories = Math.round(p * 4 + c * 4 + f * 9);

        const payload = {
            name: state.form.name,
            protein: p,
            carbs: c,
            fat: f,
            calories: computedCalories,
            unit: state.form.unit || 'g',
            amount: +state.form.amount || 100,
            isPublic: true,
            image: state.form.image
        };

        try {
            if (state.editItem) {
                await axiosClient.patch(`/foods/${state.editItem.id}`, payload);
            } else {
                await axiosClient.post('/foods', payload);
            }
            dispatch({ type: TYPES.CLOSE_FORM });
            fetchFoods();
        } catch (err) {
            console.error('Error saving food:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu món ăn');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/foods/${id}`);
            setDeleteId(null);
            fetchFoods();
        } catch (err) {
            console.error('Error deleting food:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa món ăn');
        }
    };

    const handleVerify = async (id, status) => {
        const backendStatus = status === 'approved' ? 'approve' : 'reject';
        try {
            await axiosClient.patch(`/foods/${id}/verify`, { verifyStatus: backendStatus });
            fetchFoods();
        } catch (err) {
            console.error('Error verifying food:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi duyệt món ăn');
        }
    };

    const value = {
        state,
        dispatch,
        setTab,
        setSearch,
        setMacroFilter,
        setShowFilter,
        setDeleteId,
        setForm,
        fetchFoods,
        openAdd,
        openEdit,
        closeForm,
        handleImageFile,
        handleSave,
        handleDelete,
        handleVerify
    }

    return (
        <AdminFoodsContext.Provider value={value}>
            {children}
        </AdminFoodsContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminFoods = () => {
    const context = useContext(AdminFoodsContext);
    if (!context) throw new Error("useAdminFoods must be used within a AdminFoodsProvider")
    return context;
}

export { AdminFoodsProvider };