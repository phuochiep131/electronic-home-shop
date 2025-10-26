// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  currentUser: null,
  loading: true,
};

const authReducer = (state, action) => {
  console.log("Reducer được gọi với action:", action.type);
  switch (action.type) {
    case 'AUTH_SUCCESS':
      const userPayload = action.payload.user || action.payload;
      return {
        ...state,
        currentUser: userPayload, 
        loading: false,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        currentUser: null,
        loading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/info', {
          withCredentials: true,
        });
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
      } catch (error) {
        dispatch({ type: 'AUTH_FAILURE' });
      }
    };
    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {!state.loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};