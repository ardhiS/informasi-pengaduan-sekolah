import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import HomePage from "../pages/HomePage";
import ComplaintForm from "../pages/complaints/ComplaintForm";
import Footer from "./Footer";
import ComplaintDetailsPage from "../pages/complaints/ComplaintDetailsPage";
import LoginPage from "../pages/LoginPage";
import ComplaintCheckPage from "../pages/complaints/ComplaintCheckPage";
import ComplaintDetailPage from "../pages/complaints/ComplaintDetailsPage";
import SuccessfulComplaintPage from "../pages/complaints/SuccessfulComplaintPage";

export default function ComplaintApp() {
	const [authedUser, setAuthedUser] = useState(true);

	if (!authedUser) {
		return (
			<>
				<Navbar />
				<main>
					<Routes>
						<Route path="/*" element={<LoginPage />} />
					</Routes>
				</main>
			</>
		);
	}

	return (
		<>
			<Navbar logOutButton />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/complaints/new" element={<ComplaintForm />} />
				<Route path="/complaints/check" element={<ComplaintCheckPage />} />
			</Routes>
			<Footer />
		</>
	);
}
