import { useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useNavigate,
} from "react-router-dom";
// Import hook useAuth dari AuthContext untuk mengakses data user dan fungsi autentikasi
import { useAuth } from "../contexts/AuthContext";

// import Navbar from "./UserHeader";
// import HomePage from "../pages/user/UserHomePage";
// import ComplaintForm from "../pages/user/complaints/ComplaintForm";
// import Footer from "./UserFooter";
// // import ComplaintDetailsPage from "../pages/user/complaints/ComplaintDetailsPage";
// import LoginPage from "../pages/user/UserLoginPage";
// import ComplaintCheckPage from "../pages/user/complaints/ComplaintCheckPage";
// import ComplaintDetailPage from "../pages/user/complaints/ComplaintDetailsPage";
// import SuccessfulComplaintPage from "../pages/user/complaints/SuccessfulComplaintPage";
// import ListComplaintsPage from "../pages/user/complaints/ListComplaintPage";
// import { checkComplaint } from "../utils/index";
import Loading from "./Loading";
// import { formatDate } from "../utils/index";
import ComplaintAppRoutes from "../routes";

// AdminPage

export default function ComplaintApp() {
	// Mengambil data user dan status loading dari hook useAuth
	const { user, loading } = useAuth();
	const [complaintDetails, setComplaintdetails] = useState({});

	const navigate = useNavigate();

	async function handleComplaintCheck(complaintId) {
		const detail = await checkComplaint(complaintId);
		const { id, category, description, date, status } = detail;
		setComplaintdetails({
			id,
			category,
			description,
			date: formatDate(date),
			status,
		});

		// navigate("/complaints/detail");
	}

	// // Menampilkan komponen Loading jika status loading masih true
	// if (loading) {
	// 	return <Loading />;
	// }
	// // Redirect ke halaman login jika user belum login (user = null)
	// if (!user) {
	// 	// return (
	// 	// 	<>
	// 	// 		<Navbar />
	// 	// 		<main>
	// 	// 			<Routes>
	// 	// 				<Route path="/*" element={<LoginPage />} />
	// 	// 			</Routes>
	// 	// 		</main>
	// 	// 	</>
	// 	// );

	// 	// return (
	// 	// 	<>
	// 	// 		{/* <Navbar /> */}
	// 	// 		<Routes>
	// 	// 			{/* <Route path="/*" element={<AddStudentPage />} /> */}
	// 	// 		</Routes>
	// 	// 	</>
	// 	// );

	// 	return <ComplaintAppRoutes />;
	// }

	// // return (
	// // 	<>
	// // 		<Navbar logOutButton />
	// // 		<Routes>
	// // 			<Route path="/" element={<HomePage />} />
	// // 			<Route path="/complaints/new" element={<ComplaintForm />} />
	// // 			<Route
	// // 				path="/complaints/check"
	// // 				element={
	// // 					<ComplaintCheckPage onComplaintCheck={handleComplaintCheck} />
	// // 				}
	// // 			/>
	// // 			<Route
	// // 				path="/complaints/success"
	// // 				element={<SuccessfulComplaintPage />}
	// // 			/>
	// // 			<Route
	// // 				path="/complaints/detail"
	// // 				element={<ComplaintDetailPage complaintDetails={complaintDetails} />}
	// // 			/>
	// // 			"
	// // 			<Route path="/complaints/list" element={<ListComplaintsPage />} />
	// // 		</Routes>
	// // 		<Footer />
	// // 	</>
	// // );

	return <ComplaintAppRoutes />;
}
