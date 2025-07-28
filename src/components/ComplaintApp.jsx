// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// Import hook useAuth dari AuthContext untuk mengakses data user dan fungsi autentikasi
import { useAuth } from "../contexts/AuthContext";
// import { formatDate, checkComplaint } from "../utils/index";

import Loading from "./Loading";
import ComplaintAppRoutes from "../routes";

export default function ComplaintApp() {
	const { loading } = useAuth();

	if (loading) {
		return <Loading />;
	}

	return <ComplaintAppRoutes />;
}
