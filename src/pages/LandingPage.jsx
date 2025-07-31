import { Link } from "react-router-dom";
import UserHeader from "../components/UserHeader";

export default function LandingPage() {
	return (
		<div className={`min-vh-100 d-flex flex-column`}>
			<UserHeader />
			<main className="flex-grow-1 d-flex align-items-center justify-content-center">
				<div className="container">
					<div className="row justify-content-center">
						<div className="col-md-6">
							<div className={`card shadow border-0`}>
								<div className="card-body p-5 border border-info-subtle rounded-2">
									<div className="text-center mb-4">
										<h1 className="h3 mb-2 fw-bold">SISTEM INFORMASI</h1>
										<h2 className="h4 mb-4 fw-bold">Pengaduan Online</h2>
										<p className="text-muted mb-4">
											Silakan pilih jenis akun untuk melanjutkan ke halaman
											login
										</p>
									</div>

									<div className="d-grid gap-3 mb-3">
										<Link
											to="/admin"
											className="btn btn-lg fw-semibold btn-outline-info">
											Login Sebagai Admin
										</Link>
										<Link
											to="/user"
											className="btn btn-lg fw-semibold btn-outline-info">
											Login Sebagai User
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
