import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function AdminFooter({ isShortPage }) {
	const footerClassName = `bottom-nav border-top bg-body p-2 ${
		isShortPage ? "fixed-bottom" : "sticky-bottom"
	}`;

	const location = useLocation();

	const navItems = [
		{
			to: "/admin/home",
			icon: "bi bi-house-door-fill d-block",
			label: "Beranda",
		},
		{
			to: "/admin/complaints",
			icon: "bi bi-flag-fill d-block",
			label: "Pengaduan",
		},
		{ to: "/admin/features", icon: "bi bi-grid-fill d-block", label: "Fitur" },
		{
			to: "/admin/feedback",
			icon: "bi bi-three-dots d-block",
			label: "Lainnya",
		},
	];

	return (
		<footer className={footerClassName}>
			<nav className="nav nav-fill">
				{navItems.map(({ to, icon, label }) => {
					const isActive = location.pathname.startsWith(to);
					const linkClass = `nav-link ${isActive ? "active" : "text-muted"}`;
					return (
						<Link key={to} to={to} className={linkClass}>
							<i className={icon} />
							{label}
						</Link>
					);
				})}
			</nav>
		</footer>
	);
}

AdminFooter.propTypes = {
	isShortPage: PropTypes.bool.isRequired,
};
