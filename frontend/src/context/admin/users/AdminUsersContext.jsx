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

    const deleteUser = async (userId) => {
        try {
            await axiosClient.delete(`/user/admin/${userId}`);
            dispatch({ type: TYPES.DELETE_USER, payload: userId });
        } catch (err) {
            console.error('Error deleting user:', err);
            throw err;
        }
    }

    const value = {
        state,
        dispatch,
        fetchAllUsers,
        deleteUser,
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