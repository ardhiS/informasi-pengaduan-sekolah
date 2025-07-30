import UserHomePage from "../pages/user/UserHomePage";
import ComplaintForm from "../pages/user/complaints/ComplaintForm";
import SuccessfulComplaintPage from "../pages/user/complaints/SuccessfulComplaintPage";
import ListComplaintsPage from "../pages/user/complaints/ListComplaintPage";
import ComplaintCheckPage from "../pages/user/complaints/ComplaintCheckPage";

export const userRoutesList = [
	{
		path: "home",
		page: UserHomePage,
	},
	{
		path: "complaints/form",
		page: ComplaintForm,
	},
	{
		path: "complaints/succeed",
		page: SuccessfulComplaintPage,
	},
	{
		path: "complaints/list",
		page: ListComplaintsPage,
	},
	{
		path: "complaints/check",
		page: ComplaintCheckPage,
	},
];
