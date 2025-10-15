import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Footer from "../../components/footer/footer";
import Header from "../../components/header/header";
import Home from "./Home/home";

import "./userLayout.css";

function UserLayout() {
    const userContentRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (userContentRef.current) {
            userContentRef.current.scrollTop = 0;
        }
    }, [location]);

    return (
        <div className="UserLayout">
            <div className="User-content" ref={userContentRef}>
                <Header />
                    <div className="content-fill">
                        <Routes>
                            <Route path="/" element={<Home />} />                                                      
                        </Routes>
                    </div>
                <Footer />
            </div>
        </div>

    )
}


export default UserLayout;
