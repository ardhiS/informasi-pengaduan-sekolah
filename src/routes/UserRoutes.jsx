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
import { userRoutesList } from "./userRoutesList";

import "../styles/userStyles.css";

export default function UserRoutes() {
	return (
		<Routes>
			<Route path="/" element={<UserLayout />}>
				<Route index element={<UserLoginPage />} />
				<Route element={<ProtectedRoutes />}>
					{userRoutesList.map((route) => {
						const { path, page: Page } = route;
						return <Route key={path} path={path} element={<Page />} />;
					})}

					<Route
						path="complaint/details/:complaintId"
						element={<ComplaintDetailPage />}
					/>
				</Route>
			</Route>
		</Routes>
	);
}
