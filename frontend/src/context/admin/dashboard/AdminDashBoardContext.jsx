import { createContext, useContext, useReducer } from "react";
import { initState, reducer } from "./reducer";
import * as TYPES from "./types";
import axiosClient from "../../../config/axiosClient";

const AdminDashBoardContext = createContext();

const AdminDashBoardProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState);

    const fetchAdminDashBoard = async () => {
        try {
            const data = await axiosClient.get('/reports/admin/dashboard');
            console.log(data);
            dispatch({ type: TYPES.FETCH_DASHBOARD, payload: data })
        }
        catch (err) {
            console.error('Error fetching admin dashboard foods list in context:', err);
        }
    }

    const value = {
        state,
        dispatch,
        fetchAdminDashBoard,
    };

    return (
        <AdminDashBoardContext.Provider value={value}>
            {children}
        </AdminDashBoardContext.Provider>
    )

}

const useAdminDashBoard = () => {
    const context = useContext(AdminDashBoardContext);
    if (!context) throw new Error("useAdminDashBoard must be used within a AdminDashBoardProvider")
    return context;
}

export { AdminDashBoardProvider, useAdminDashBoard };