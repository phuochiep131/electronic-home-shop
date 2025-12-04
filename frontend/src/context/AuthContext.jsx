// // src/context/AuthContext.js
// import React, { createContext, useContext, useReducer, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// const initialState = {
//   currentUser: null,
//   loading: true,
// };

// const authReducer = (state, action) => {
//   console.log("Reducer được gọi với action:", action.type);
//   switch (action.type) {
//     case "AUTH_SUCCESS": {
//       // SỬA LỖI 1: Thêm ngoặc nhọn bao quanh case này để tạo scope riêng
//       const userPayload = action.payload.user || action.payload;
//       return {
//         ...state,
//         currentUser: userPayload,
//         loading: false,
//       };
//     }
//     case "AUTH_FAILURE":
//       return {
//         ...state,
//         currentUser: null,
//         loading: false,
//       };
//     default:
//       return state;
//   }
// };

// export const AuthProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   useEffect(() => {
//     const checkLoggedIn = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/user/me",
//           {
//             withCredentials: true,
//           }
//         );
//         dispatch({ type: "AUTH_SUCCESS", payload: response.data });
//       } catch {
//         // SỬA LỖI 2: Bỏ "(error)" vì không dùng biến error
//         dispatch({ type: "AUTH_FAILURE" });
//       }
//     };
//     checkLoggedIn();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ state, dispatch }}>
//       {!state.loading && children}
//     </AuthContext.Provider>
//   );
// };

// // SỬA LỖI 3: Thêm dòng comment bên dưới để tắt cảnh báo React Refresh cho hook này
// // eslint-disable-next-line react-refresh/only-export-components
// export const useAuth = () => {
//   return useContext(AuthContext);
// };

import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const initialState = {
  currentUser: null,
  loading: true, // Quan trọng: Giữ true để chặn render cho đến khi check xong
};

const authReducer = (state, action) => {
  // console.log("Auth State Change:", action.type, action.payload);

  switch (action.type) {
    case "AUTH_SUCCESS": {
      // Logic phòng thủ: Backend có thể trả về { user: {...} } hoặc trực tiếp {...}
      const userPayload = action.payload.user || action.payload;
      return {
        ...state,
        currentUser: userPayload,
        loading: false,
      };
    }
    case "AUTH_FAILURE":
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
        // QUAN TRỌNG: Đường dẫn này phải khớp với file route ở Backend
        // Thường là: server.js khai báo app.use('/api/auth', authRoute)
        // Và authRoute khai báo router.get('/me', ...)
        // => Kết quả là: /api/auth/me
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          withCredentials: true, // Bắt buộc để gửi Cookie đi kèm
        });

        dispatch({ type: "AUTH_SUCCESS", payload: response.data });
      } catch (error) {
        // Không cần log lỗi này ra console để tránh đỏ màn hình khi user chưa login
        dispatch({ type: "AUTH_FAILURE" });
      }
    };

    checkLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {/* Chỉ render children khi đã kiểm tra xong (loading = false) */}
      {!state.loading && children}
    </AuthContext.Provider>
  );
};

// Fix lỗi Fast Refresh của Vite
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};
