import AdminHomePage from "../pages/admin/AdminHomePage";
import AdminOthersPage from "../pages/admin/AdminOthersPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";
import EditTeacherPage from "../pages/admin/EditTeacherPage";
import FeaturesPage from "../pages/admin/FeaturesPage";
import FeedbackPage from "../pages/admin/FeedbackPage";
import PoliciesPage from "../pages/admin/PoliciesPage";
import StudentsListPage from "../pages/admin/StudentsListPage";
import TeachersListPage from "../pages/admin/TeachersListPage";
import AdminComplaintsPage from "../pages/admin/complaints/AdminComplaintsPage";
import AdminConfirmationPage from "../pages/admin/complaints/ConfirmationPage";
import AddTeacherPage from "../pages/admin/AddTeacherPage";
import AddStudentPage from "../pages/admin/AddStudentPage";

export const adminRoutesList = [
	{
		path: "home",
		page: AdminHomePage,
	},
	{
		path: "add/teacher",
		page: AddTeacherPage,
	},
	{
		path: "add/student",
		page: AddStudentPage,
	},
	{
		path: "others",
		page: AdminOthersPage,
	},
	{
		path: "settings",
		page: AdminSettingsPage,
	},
	{
		path: "edit/teacher",
		page: EditTeacherPage,
	},
	// To do (Make edit student)
	{
		path: "students/list",
		page: StudentsListPage,
	},
	{
		path: "teachers/list",
		page: TeachersListPage,
	},
	{
		path: "complaints",
		page: AdminComplaintsPage,
	},
	{
		path: "confirmation",
		page: AdminConfirmationPage,
	},
	{
		path: "policies",
		page: PoliciesPage,
	},
	{
		path: "features",
		page: FeaturesPage,
	},
	{
		path: "feedback",
		page: FeedbackPage,
	},
];
