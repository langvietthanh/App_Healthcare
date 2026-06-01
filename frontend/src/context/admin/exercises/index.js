import { createContext, useReducer, useContext } from 'react';
import reducer, { initialState } from './reducer';

const ExerciseContext = createContext();

const ExerciseProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);


    const value = {
        state,
        dispatch,

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