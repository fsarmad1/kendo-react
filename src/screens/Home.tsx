import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Detail from "./Detail";

const Home = () => {
    return (
        <Router>
            <Routes>
                <Route path={"/detail"} element={<Detail />} />
                <Route path={"/"} element={<Dashboard />} />
            </Routes>
        </Router>
    )
}
export default Home;
