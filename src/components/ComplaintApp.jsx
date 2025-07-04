import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import HomePage from "../pages/HomePage";
import CategoryPage from "../pages/complaints/CategoryPage";
import Footer from "./Footer";

export default function ComplaintApp() {
  return (
    <Router>
      <Navbar searchField logOutButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<CategoryPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}
