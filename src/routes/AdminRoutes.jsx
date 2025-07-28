import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import { ProtectedAdminRoutes } from "./ProtectedRoutes";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminHomePage from "../pages/admin/AdminHomePage";
import AdminAddStudentPage from "../pages/admin/AddStudentPage";
import AdminAddTeacherPage from "../pages/admin/AddTeacherPage";
import AdminOthersPage from "../pages/admin/AdminOthersPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import EditTeacherPage from "../pages/admin/EditTeacherPage";
import FeaturesPage from "../pages/admin/FeaturesPage";
import FeedbackPage from "../pages/admin/FeedbackPage";
import PoliciesPage from "../pages/admin/PoliciesPage";
import StudentsListPage from "../pages/admin/StudentsListPage";
import TeachersListPage from "../pages/admin/TeachersListPage";
import AdminComplaintDetailsPage from "../pages/admin/complaints/AdminComplaintDetailsPage";
import AdminComplaintsPage from "../pages/admin/complaints/AdminComplaintsPage";
import AdminConfirmationPage from "../pages/admin/complaints/ConfirmationPage";

import "../styles/adminStyles.css";

export default function AdminRoutes() {
	console.log("Rendering AdminRoutes");
	return (
		<Routes>
			<Route path="/" element={<AdminLayout />}>
				<Route index element={<AdminLoginPage />} />
				<Route element={<ProtectedAdminRoutes />}>
					<Route path="home" element={<AdminHomePage />} />
				</Route>
			</Route>
		</Routes>
	);
}
