/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useContext } from 'react';
import reducer, { initialState } from './reducer';
import axiosClient from '../../../config/axiosClient';
import { muscleMapEV, muscleMapVE } from '../../../constants';

const ExerciseContext = createContext();

const ExerciseProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchExercises = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await axiosClient.get('/exercises');
            const data = response.data || response;
            if (Array.isArray(data)) {
                const mapped = data.map(e => ({
                    id: e._id,
                    name: e.name,
                    category: e.category || 'Strength',
                    muscles: e.targetMuscles ? e.targetMuscles.map(m => muscleMapEV[m.muscle] || m.muscle) : [],
                    targetMuscles: e.targetMuscles || [],
                    level: 'Trung bình', // Fallback level UI
                    description: e.description || '',
                    instructions: e.instructions ? e.instructions.map(ins => ins.text) : [''],
                    image: e.imgURL || '',
                    isPublic: e.isPublic || false,
                }));
                dispatch({ type: 'SET_EXERCISES', payload: mapped });
            }
        } catch (err) {
            console.error('Error fetching exercises:', err);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleSave = async () => {
        const { form, editItem } = state;
        if (!form.name.trim()) return;

        // Map instructions and target muscles for Backend
        const instructionsMapped = form.instructions
            .filter(text => text.trim() !== '')
            .map((text, i) => ({ stepNumber: i + 1, text }));

        const targetMusclesMapped = form.targetMuscles.map(m => ({
            muscle: muscleMapVE[m.muscle] || 'Full Body',
            rating: m.rating || 5
        }));

        const payload = {
            name: form.name,
            category: form.category,
            description: form.description,
            instructions: instructionsMapped,
            targetMuscles: targetMusclesMapped,
            imgURL: form.image,
        };

        try {
            if (editItem) {
                await axiosClient.put(`/exercises/${editItem.id}`, payload);
            } else {
                await axiosClient.post('/exercises', payload);
            }
            dispatch({ type: 'CLOSE_FORM' });
            fetchExercises(); // reload
        } catch (err) {
            console.error('Error saving exercise:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi lưu bài tập');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axiosClient.delete(`/exercises/${id}`);
            dispatch({ type: 'SET_DELETE_ID', payload: null });
            fetchExercises(); // reload
        } catch (err) {
            console.error('Error deleting exercise:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi xóa bài tập');
        }
    };

    const handleTogglePublic = async (id, currentStatus) => {
        try {
            await axiosClient.put(`/exercises/${id}`, { isPublic: !currentStatus });
            fetchExercises(); // reload
        } catch (err) {
            console.error('Error toggling public status:', err);
            alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
        }
    };

    // --- State Handler Helpers ---
    const setTab = (val) => dispatch({ type: 'SET_TAB', payload: val });
    const setSearch = (val) => dispatch({ type: 'SET_SEARCH', payload: val });
    const toggleFilter = () => dispatch({ type: 'TOGGLE_FILTER' });
    const setFilterCategory = (val) => dispatch({ type: 'SET_FILTER_CATEGORY', payload: val });
    const setFilterMuscle = (val) => dispatch({ type: 'SET_FILTER_MUSCLE', payload: val });
    
    const setDeleteId = (id) => dispatch({ type: 'SET_DELETE_ID', payload: id });
    
    const openAdd = () => dispatch({ type: 'OPEN_ADD_FORM' });
    const openEdit = (item) => dispatch({ type: 'OPEN_EDIT_FORM', payload: item });
    const closeForm = () => dispatch({ type: 'CLOSE_FORM' });
    
    // Form handlers
    const setForm = (val) => {
        const newForm = typeof val === 'function' ? val(state.form) : val;
        dispatch({ type: 'SET_FORM', payload: newForm });
    };
    const addStep = () => dispatch({ type: 'SET_FORM', payload: { ...state.form, instructions: [...state.form.instructions, ''] } });
    const removeStep = (i) => dispatch({ type: 'SET_FORM', payload: { ...state.form, instructions: state.form.instructions.filter((_, idx) => idx !== i) } });
    const updateStep = (i, val) => dispatch({ type: 'SET_FORM', payload: { ...state.form, instructions: state.form.instructions.map((s, idx) => idx === i ? val : s) } });
    const toggleMuscle = (m) => dispatch({ 
        type: 'SET_FORM', 
        payload: { 
            ...state.form, 
            targetMuscles: state.form.targetMuscles.some(x => x.muscle === m) 
                ? state.form.targetMuscles.filter(x => x.muscle !== m) 
                : [...state.form.targetMuscles, { muscle: m, rating: 5 }] 
        } 
    });
    
    const updateMuscleRating = (m, rating) => dispatch({
        type: 'SET_FORM',
        payload: {
            ...state.form,
            targetMuscles: state.form.targetMuscles.map(x => x.muscle === m ? { ...x, rating } : x)
        }
    });
    const handleImageFile = (e) => { 
        const file = e.target.files[0]; 
        if (file) dispatch({ type: 'SET_FORM', payload: { ...state.form, image: URL.createObjectURL(file) } }); 
    };

    const value = {
        state,
        dispatch,
        fetchExercises,
        handleSave,
        handleDelete,
        handleTogglePublic,
        
        // Helpers
        setTab,
        setSearch,
        toggleFilter,
        setFilterCategory,
        setFilterMuscle,
        setDeleteId,
        openAdd,
        openEdit,
        closeForm,
        setForm,
        addStep,
        removeStep,
        updateStep,
        toggleMuscle,
        updateMuscleRating,
        handleImageFile
    };

    return <ExerciseContext.Provider value={value}>
        {children}
    </ExerciseContext.Provider>
}

const useAdminExercises = () => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useAdminExercises must be used within ExerciseProvider');
    }
    return context;
}

export { ExerciseProvider, useAdminExercises };