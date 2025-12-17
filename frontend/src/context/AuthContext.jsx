import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const initialState = {
  currentUser: null,
  isAuthenticated: false, // Thêm biến này để dễ check
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_SUCCESS": {
      const userPayload = action.payload.user || action.payload;
      return {
        ...state,
        currentUser: userPayload,
        isAuthenticated: true, // Login thành công -> true
        loading: false,
      };
    }
    case "AUTH_FAILURE":
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false, // Login thất bại -> false
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
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true,
        });

        if (response.status === 200 && response.data) {
          dispatch({ type: "AUTH_SUCCESS", payload: response.data });
        } else {
          dispatch({ type: "AUTH_FAILURE" });
        }
      } catch (error) {
        // Lỗi 401 là bình thường khi chưa đăng nhập
        dispatch({ type: "AUTH_FAILURE" });
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
