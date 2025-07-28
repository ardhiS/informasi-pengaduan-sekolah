import { Outlet, useLocation } from "react-router-dom";
import UserHeader from "../components/UserHeader";
import UserFooter from "../components/UserFooter";

export default function UserLayout() {
	const location = useLocation();

	const isLoginPage =
		location.pathname === "/user" || location.pathname === "/user/";

	return (
		<>
			{isLoginPage ? <UserHeader /> : <UserHeader searchField logOutButton />}
			<main>
				<Outlet />
			</main>
			<UserFooter />
		</>
	);
}
