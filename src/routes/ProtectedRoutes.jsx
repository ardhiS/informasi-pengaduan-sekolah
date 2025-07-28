import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

export default function ProtectedRoutes() {
	const { user, loading } = useAuth();

	if (loading) return <Loading />;

	if (!user) {
		return <Navigate to={"/user"} replace />;
	}

	return <Outlet />;
}

export function ProtectedAdminRoutes() {
	const { admin, loading } = useAuth();

	if (loading) return <Loading />;

	if (!admin) {
		return <Navigate to="/admin" replace />;
	}
	return <Outlet />;
}
