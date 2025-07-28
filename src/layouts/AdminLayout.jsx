import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";

export default function AdminLayout() {
	const location = useLocation();
	const isLoginPage =
		location.pathname === "/admin" || location.pathname === "/admin/";

	if (isLoginPage) {
		return (
			<>
				<AdminHeader />
				<main>
					<Outlet />
				</main>
			</>
		);
	}
	return (
		<>
			<AdminHeader logOutButton />
			<main className="mb-3">
				<Outlet />
			</main>
			<AdminFooter />
		</>
	);
}
