import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
// import ComplaintApp from "./components/ComplaintApp";
import "./styles/style.css";
import ComplaintForm from "./pages/complaints/ComplaintForm";
import LoginPage from "./pages/LoginPage";
import CurrentPage from "./pages/complaints/CategoriesPage";
import CategoriesPage from "./pages/complaints/CategoriesPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter } from "react-router-dom";
import ComplaintApp from "./components/ComplaintApp";

export default function App() {
	const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

	function toggleTheme() {
		setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
	}

	useEffect(() => {
		document.documentElement.setAttribute("data-bs-theme", theme);
	}, [theme]);

	return (
		<>
			<BrowserRouter>
				<ComplaintApp toggleTheme={toggleTheme} />
			</BrowserRouter>
		</>
	);
}
