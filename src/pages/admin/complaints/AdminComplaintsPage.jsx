import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import * as api from "../../../utils/api";

export default function AdminComplaintsPage() {
	const location = useLocation();
	const [complaints, setComplaints] = useState({
		pending: [],
		in_progress: [],
		resolved: [],
		rejected: [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchAllComplaints = useCallback(async () => {
		setIsLoading(true);
		try {
			//COBA TAMBAHKAN JADI   const [pendingRes, inProgressRes, resolvedRes, rejectedRes]
			const [pendingRes, inProgressRes, resolvedRes, rejectedRes] =
				await Promise.all([
					api.getComplaints({ status: "pending_approval" }),
					api.getComplaints({ status: "in_progress" }),
					api.getComplaints({ status: "resolved" }),
					api.getComplaints({ status: "rejected" }),
				]);

			setComplaints({
				pending: pendingRes.data.complaints || [],
				// pending: [],
				in_progress: inProgressRes.data.complaints || [],
				resolved: resolvedRes.data.complaints || [],
				rejected: rejectedRes.data.complaints || [],
			});
		} catch (err) {
			setError("Gagal memuat data pengaduan.");
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAllComplaints();
		window.addEventListener("focus", fetchAllComplaints);
		return () => {
			window.removeEventListener("focus", fetchAllComplaints);
		};
	}, [fetchAllComplaints]);

	useEffect(() => {
		if (location.hash) {
			const targetId = location.hash.substring(1);
			const tabButton = document.querySelector(
				`button[data-bs-target="#pills-${targetId}"]`
			);
			if (tabButton) {
				tabButton.click();
			}
		}
	}, [location.hash]);

	const renderComplaintList = (list, status) => {
		if (list.length === 0) {
			return (
				<div className="text-center p-5 bg-body-tertiary rounded shadow-sm">
					<i className="bi bi-folder2-open fs-1 text-muted"></i>
					<h5 className="mt-3">Tidak Ada Data</h5>
					<p className="text-muted">
						Tidak ada pengaduan dengan status "{status}" saat ini.
					</p>
				</div>
			);
		}
		return (
			<div className="list-group">
				{list.map((complaint) => (
					<Link
						key={complaint.id}
						to={`/admin/complaint/details/${complaint.id}`}
						className="list-group-item list-group-item-action d-flex align-items-center py-3">
						<div className="icon-circle bg-primary-subtle text-primary">
							<i className="bi bi-bell"></i>
						</div>
						<div className="ms-3 flex-grow-1">
							<div className="d-flex w-100 justify-content-between">
								<h6 className="mb-1 fw-bold">{complaint.title}</h6>
								<small className="text-muted">
									{new Date(complaint.created_at).toLocaleDateString("id-ID")}
								</small>
							</div>
							<small className="text-muted">
								ID: #{complaint.id.slice(0, 6)}
							</small>
						</div>
						<i className="bi bi-chevron-right ms-3 text-muted"></i>
					</Link>
				))}
			</div>
		);
	};

	if (isLoading) {
		return <div className="text-center py-5">Memuat data...</div>;
	}
	if (error) {
		return <div className="alert alert-danger">{error}</div>;
	}

	return (
		<div className="container py-4">
			<ul className="nav nav-pills nav-fill mb-4" id="pills-tab" role="tablist">
				<li className="nav-item" role="presentation">
					<button
						className="nav-link active"
						data-bs-toggle="pill"
						data-bs-target="#pills-pending">
						Baru{" "}
						<span className="badge bg-white text-primary ms-1">
							{complaints.pending.length}
						</span>
					</button>
				</li>
				<li className="nav-item" role="presentation">
					<button
						className="nav-link"
						data-bs-toggle="pill"
						data-bs-target="#pills-in_progress">
						Diproses{" "}
						<span className="badge bg-white text-primary ms-1">
							{complaints.in_progress.length}
						</span>
					</button>
				</li>
				<li className="nav-item" role="presentation">
					<button
						className="nav-link"
						data-bs-toggle="pill"
						data-bs-target="#pills-resolved">
						Selesai{" "}
						<span className="badge bg-white text-primary ms-1">
							{complaints.resolved.length}
						</span>
					</button>
				</li>
				<li className="nav-item" role="presentation">
					<button
						className="nav-link"
						data-bs-toggle="pill"
						data-bs-target="#pills-rejected">
						Ditolak{" "}
						<span className="badge bg-white text-primary ms-1">
							{complaints.rejected.length}
						</span>
					</button>
				</li>
			</ul>
			<div className="tab-content" id="pills-tabContent">
				<div
					className="tab-pane fade show active"
					id="pills-pending"
					role="tabpanel">
					{renderComplaintList(complaints.pending, "Baru")}
				</div>
				<div className="tab-pane fade" id="pills-in_progress" role="tabpanel">
					{renderComplaintList(complaints.in_progress, "Diproses")}
				</div>
				<div className="tab-pane fade" id="pills-resolved" role="tabpanel">
					{renderComplaintList(complaints.resolved, "Selesai")}
				</div>
				<div className="tab-pane fade" id="pills-rejected" role="tabpanel">
					{renderComplaintList(complaints.rejected, "Ditolak")}
				</div>
			</div>
		</div>
	);
}
