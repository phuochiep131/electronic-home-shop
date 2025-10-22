import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "../../components/header.jsx";
import Footer from "../../components/footer.jsx";
import Home from "./home.jsx";

function UserLayout() {
  const userContentRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (userContentRef.current) {
      userContentRef.current.scrollTop = 0;
    }
  }, [location]);

  return (
    <div className="flex w-full">
      <div
        className="flex flex-col flex-1 min-h-screen justify-between overflow-y-auto"
        ref={userContentRef}
      >
        <Header />

        <div className="p-8 h-full">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default UserLayout;
