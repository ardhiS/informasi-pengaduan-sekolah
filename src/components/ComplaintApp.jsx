import React from "react";
import Navbar from "./Navbar";
import HomePage from "../pages/HomePage";
import Footer from "./Footer";

export default function ComplaintApp() {
	return (
		<>
			<Navbar searchField logOutButton />
			<HomePage />
			<Footer />
		</>
	);
}
