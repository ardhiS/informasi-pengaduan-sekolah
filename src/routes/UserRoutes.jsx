import { Routes, Route } from "react-router-dom";
import UserLayout from "../layouts/UserLayout";
import ProtectedRoutes from "./ProtectedRoutes";

// User pages
import UserLoginPage from "../pages/user/UserLoginPage";
import UserHomePage from "../pages/user/UserHomePage";
import ComplaintForm from "../pages/user/complaints/ComplaintForm";
import SuccessfulComplaintPage from "../pages/user/complaints/SuccessfulComplaintPage";
import ListComplaintsPage from "../pages/user/complaints/ListComplaintPage";
import ComplaintDetailPage from "../pages/user/complaints/ComplaintDetailsPage";
import ComplaintCheckPage from "../pages/user/complaints/ComplaintCheckPage";

import "../styles/userStyles.css";

export default function UserRoutes() {
	return (
		<Routes>
			<Route path="/" element={<UserLayout />}>
				<Route index element={<UserLoginPage />} />
				<Route element={<ProtectedRoutes />}>
					<Route path="home" element={<UserHomePage />} />
					<Route path="complaints/form" element={<ComplaintForm />} />
					<Route
						path="complaints/succeed"
						element={<SuccessfulComplaintPage />}
					/>
					<Route path="complaints/list" element={<ListComplaintsPage />} />
					<Route
						path="complaints/detail/:complaintId"
						element={<ComplaintDetailPage />}
					/>
					<Route path="complaints/check" element={<ComplaintCheckPage />} />
				</Route>
			</Route>
		</Routes>
	);
}
