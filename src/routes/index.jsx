import { Routes, Route } from "react-router-dom";
import AdminRoutes from "../routes/AdminRoutes";
import UserRoutes from "./UserRoutes";

export default function ComplaintAppRoutes() {
	return (
		<Routes>
			<Route path="/user/*" element={<UserRoutes />} />
			<Route path="/admin/*" element={<AdminRoutes />} />
		</Routes>
	);
}
