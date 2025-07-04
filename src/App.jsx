import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ComplaintApp from "./components/ComplaintApp";
import "./styles/style.css";

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
			<Navbar onToggleTheme={toggleTheme} />
			<ComplaintApp />
		</>
	);
}
