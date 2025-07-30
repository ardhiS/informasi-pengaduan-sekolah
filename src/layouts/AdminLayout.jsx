import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";

export default function AdminLayout() {
	const [pageHeight, setPageHeight] = useState();
	const location = useLocation();

	useEffect(() => {
		function checkHeight() {
			const contentHeight = document.documentElement.scrollHeight;
			const viewportHeight = window.innerHeight;
			setPageHeight(contentHeight <= viewportHeight);
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(checkHeight);
		});
		window.addEventListener("resize", checkHeight);

		return () => window.removeEventListener("resize", checkHeight);
	}, []);

	useEffect(() => {
		function checkHeight() {
			const contentHeight = document.documentElement.scrollHeight;
			const viewportHeight = window.innerHeight;
			setPageHeight(contentHeight <= viewportHeight);
		}

		requestAnimationFrame(() => {
			requestAnimationFrame(checkHeight);
		});
	}, [location.pathname]);

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
			<AdminHeader isUseLogo logOutButton />
			<main className="mb-3">
				<Outlet />
			</main>
			<AdminFooter isShortPage={pageHeight} />
		</>
	);
}
