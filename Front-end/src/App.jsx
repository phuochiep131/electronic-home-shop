import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/user/userLayout";
import Login from "./layouts/user/Login/login";
import Register from "./layouts/user/Logup/logup";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<UserLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
