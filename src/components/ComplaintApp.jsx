import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import HomePage from "../pages/HomePage";
import CategoriesPage from "../pages/complaints/CategoriesPage";
import Footer from "./Footer";
import ComplaintDetailsPage from "../pages/complaints/ComplaintDetailsPage";

export default function ComplaintApp({ toggleTheme }) {
	return (
		<>
			<Navbar searchField logOutButton onToggleTheme={toggleTheme} />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/category" element={<CategoriesPage />} />
			</Routes>
			<Footer />
		</>
	);
}
