import { createContext, useContext, useReducer } from "react";
import { initState, reducer } from "./reducer";
import * as TYPES from "./types";
import axiosClient from "../../../config/axiosClient";

const AdminUsersContext = createContext();

const AdminUsersProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState);

    const fetchAllUsers = async () => {
        try {
            const data = await axiosClient.get('/user/admin/all');
            dispatch({ type: TYPES.FETCH_ALL_USER, payload: data })
        }
        catch (err) {
            console.error('Error fetching admin dashboard foods list in context:', err);
        }
    }

    const toggleLockUser = async (userId) => {
        try {
            const res = await axiosClient.patch(`/user/admin/${userId}/toggle-lock`);
            // Assuming res.user contains the updated user object
            dispatch({ type: TYPES.UPDATE_USER, payload: res.user });
        } catch (err) {
            console.error('Error toggling user lock status:', err);
            throw err;
        }
    }

    const setSearch = (search) => dispatch({ type: TYPES.SET_SEARCH, payload: search });
    const setFilters = (filters) => dispatch({ type: TYPES.SET_FILTERS, payload: filters });
    const setTab = (tab) => dispatch({ type: TYPES.SET_TAB, payload: tab });

    const value = {
        state,
        dispatch,
        fetchAllUsers,
        toggleLockUser,
        setSearch,
        setFilters,
        setTab,
    };

    return (
        <AdminUsersContext.Provider value={value}>
            {children}
        </AdminUsersContext.Provider>
    )

}

const useAdminUser = () => {
    const context = useContext(AdminUsersContext);
    if (!context) throw new Error("useAdminUser must be used within a AdminUsersProvider")
    return context;
}

export { AdminUsersProvider, useAdminUser };