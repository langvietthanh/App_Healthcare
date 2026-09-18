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
                    description: e.description || '',
                    instructions: e.instructions ? e.instructions.map(ins => ins.text) : [''],
                    image: e.imgURL ? `http://localhost:3000${e.imgURL}` : '',
                    isPublic: e.isPublic || false,
                    creator: e.creatorId ? 'Người dùng' : 'Hệ thống',
                }));
                dispatch({ type: 'SET_EXERCISES', payload: mapped });
            }
            console.log(data);
        } catch (err) {
            console.error('Error fetching exercises:', err);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const handleSave = async (form) => {
        const { editItem } = state;
        if (!form.name.trim()) return;

        // Map instructions and target muscles for Backend
        const instructionsMapped = form.instructions
            .filter(text => text.trim() !== '')
            .map((text, i) => ({ stepNumber: i + 1, text }));

        const targetMusclesMapped = form.targetMuscles.map(m => ({
            muscle: muscleMapVE[m.muscle] || 'Full Body',
            rating: m.rating || 5
        }));

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('category', form.category);
        formData.append('description', form.description);
        formData.append('instructions', JSON.stringify(instructionsMapped));
        formData.append('targetMuscles', JSON.stringify(targetMusclesMapped));

        if (form.imageFile) {
            formData.append('image', form.imageFile);
        } else if (form.image) {
            // Keep existing image URL if not replacing
            formData.append('imgURL', form.image);
        }

        try {
            if (editItem) {
                await axiosClient.put(`/exercises/${editItem.id}?type=exercise`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axiosClient.post('/exercises?type=exercise', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
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

    // Form handlers are now inside local component (ExerciseFormModal)

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
        closeForm
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