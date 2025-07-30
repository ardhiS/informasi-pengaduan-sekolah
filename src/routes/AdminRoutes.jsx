import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedAdminRoutes } from "./ProtectedRoutes";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminComplaintDetailsPage from "../pages/admin/complaints/AdminComplaintDetailsPage";

import "../styles/adminStyles.css";

import { adminRoutesList } from "./adminRoutesList";

export default function AdminRoutes() {
	console.log("Rendering AdminRoutes");
	return (
		<Routes>
			<Route path="/" element={<AdminLayout />}>
				<Route index element={<AdminLoginPage />} />
				<Route element={<ProtectedAdminRoutes />}>
					{adminRoutesList.map((route) => {
						const { path, page: Page } = route;
						return <Route key={path} path={path} element={<Page />} />;
					})}
					<Route path="complaint/details/:complaintId" />
				</Route>
			</Route>
		</Routes>
	);
}
