import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicComplaints } from "../../../utils/api";
import SecurityAlert from "../../../components/SecurityAlert";
import { formatDate } from "../../../utils";

export default function ListComplaintsPage() {
	const [complaints, setComplaints] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");

	useEffect(() => {
		const fetchComplaints = async () => {
			const result = await getPublicComplaints();
			console.log(result);
			if (result.status === "success") {
				const sorted = result.data.complaints.sort(
					(a, b) => new Date(b.reported_at) - new Date(a.reported_at)
				);
				setComplaints(sorted);
			} else {
				setError(result.message || "Gagal memuat data pengaduan.");
			}
			setLoading(false);
		};

		fetchComplaints();
	}, []);

	const defineStatusClass = (status) => {
		switch (status.toLowerCase()) {
			case "pending_approval":
				return "bg-warning text-dark";
			case "in_progress":
				return "bg-primary text-white";
			case "resolved":
				return "bg-success text-white";
			case "rejected":
				return "bg-danger text-white";
			default:
				return null;
		}
	};

	const categories = [
		"all",
		...Array.from(new Set(complaints.map((c) => c.category))),
	];

	const filteredComplaints = complaints.filter((c) => {
		const matchCategory =
			selectedCategory === "all" || c.category === selectedCategory;

		const matchKeyword =
			c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			c.description.toLowerCase().includes(searchTerm.toLowerCase());

		return matchCategory && matchKeyword;
	});

	if (loading) {
		return (
			<main className="container my-5 text-center">
				<div className="spinner-border text-info" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</main>
		);
	}

	if (error) {
		return (
			<main className="container my-5 text-center">
				<div className="alert alert-danger">
					<p className="fw-bold">Terjadi Kesalahan</p>
					<p>{error}</p>
				</div>
			</main>
		);
	}

	return (
		<main className="container my-5">
			<div className="row justify-content-center">
				<div className="col-lg-10">
					<h1 className="display-6 fw-bold mb-3 text-info">
						Semua Pengaduan Publik
					</h1>
					<p className="fs-6 text-muted mb-4">
						Filter pengaduan berdasarkan kategori dan kata kunci.
					</p>

					{/* Input pencarian dan filter kategori */}
					<div className="row mb-4">
						<div className="col-md-6 mb-2 mb-md-0">
							<input
								type="text"
								className="form-control"
								placeholder="Cari berdasarkan judul atau deskripsi..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className="col-md-6">
							<select
								className="form-select"
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}>
								{categories.map((cat) => (
									<option key={cat} value={cat}>
										{cat === "all" ? "Semua Kategori" : cat}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Hasil pencarian */}
					{filteredComplaints.length === 0 ? (
						<div className="text-center text-muted my-5">
							<i className="bi bi-search" style={{ fontSize: "3rem" }}></i>
							<h4 className="mt-3">Tidak ada hasil ditemukan</h4>
							<p>Coba kata kunci lain atau pilih kategori yang berbeda.</p>
							<Link to="/user/complaints/form" className="btn btn-info">
								Buat Pengaduan Baru
							</Link>
						</div>
					) : (
						<div className="row">
							{filteredComplaints.map((complaint) => (
								<div key={complaint.id} className="col-md-6 col-lg-4 mb-4">
									<div className="card border-0 bg-body-secondary h-100 shadow-sm">
										<div className="card-body p-4 d-flex flex-column">
											<div className="d-flex justify-content-between align-items-start mb-3">
												<span className="badge bg-info text-capitalize">
													{complaint.category}
												</span>
												<span
													className={`badge ${defineStatusClass(
														complaint.status
													)} text-capitalize`}>
													{complaint.status}
												</span>
											</div>
											<h6 className="card-title text-body mb-2 fw-bold">
												{complaint.title}
											</h6>
											<p className="card-text text-muted small mb-3 flex-grow-1">
												{complaint.description.length > 100
													? complaint.description.substring(0, 100) + "..."
													: complaint.description}
											</p>
											<div className="d-flex justify-content-between align-items-center mt-auto">
												<small className="text-muted">
													<i className="bi bi-calendar me-1"></i>
													{formatDate(complaint.reported_at)}
												</small>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Navigasi */}
					<div className="text-center mt-4">
						<Link to="/user/home" className="btn btn-outline-info me-2">
							<i className="bi bi-house me-2"></i>Kembali ke Beranda
						</Link>
						<Link to="/user/complaints/form" className="btn btn-info">
							<i className="bi bi-plus-circle me-2"></i>Buat Pengaduan Baru
						</Link>
					</div>
				</div>
			</div>
			<SecurityAlert />
		</main>
	);
}
