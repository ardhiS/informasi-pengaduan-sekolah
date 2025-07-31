import { Routes, Route } from "react-router-dom";
import AdminRoutes from "../routes/AdminRoutes";
import UserRoutes from "./UserRoutes";
import LandingPage from "../pages/LandingPage";

export default function ComplaintAppRoutes() {
	return (
		<Routes>
			<Route index element={<LandingPage />} />
			<Route path="/user/*" element={<UserRoutes />} />
			<Route path="/admin/*" element={<AdminRoutes />} />
		</Routes>
	);
}
