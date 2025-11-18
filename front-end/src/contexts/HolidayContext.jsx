import { createContext, useReducer } from "react";

export const HolidayContext = createContext();

const initialState = {
    apiHolidays: [],
    customHolidays: [],
    loading: false,
    error: null,
    searchHistory: [],
    activeSource: 'api' // ou 'custom'
};

function holidayReducer(state, action) {
    switch (action.type) {

        case "FETCH_START":
            return {
                ...state,
                loading: true,
                error: null,
            };

        case "FETCH_ERROR":
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case "ADD_HISTORY":
            return {
                ...state,
                searchHistory: [...state.searchHistory, action.payload]
            };

        case "SET_API_HOLIDAYS":
            return {
                ...state,
                apiHolidays: action.payload,
                loading: false,
                error: null
            };

        case "SET_CUSTOM_HOLIDAYS":
            return {
                ...state,
                customHolidays: action.payload,
                loading: false,
                error: null
            };

        case "SET_ACTIVE_SOURCE":
            return {
                ...state,
                activeSource: action.payload
            };

        default: return state;
    }
}

export const HolidayProvider = ({ children }) => {
    const [state, dispatch] = useReducer(holidayReducer, initialState);

    return (
        <HolidayContext.Provider value={{ state, dispatch }} >
            {children}
        </HolidayContext.Provider>
    );
};