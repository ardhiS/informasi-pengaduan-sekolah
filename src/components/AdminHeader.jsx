import { useContext } from "react";
import { Link } from "react-router-dom";
// Import hook useAuth dari AuthContext untuk mengakses data admin dan fungsi autentikasi
import { useAuth } from "../contexts/AuthContext";
import {
	BsSearch,
	BsGlobe,
	BsGeoAltFill,
	BsMoonStars,
	BsPersonCircle,
} from "react-icons/bs";

import favicon from "../assets/images/favicon-64x64.png";
import ThemeContext from "../contexts/ThemeContext";

export default function AdminHeader({ searchField, logOutButton }) {
	const { toggleTheme } = useContext(ThemeContext);
	// Mengambil data admin dan fungsi logout dari context auth yang telah dibuat
	const { admin, removeAdminFromLocalStorage } = useAuth();
	console.log(admin);

	// Fungsi untuk menangani proses logout ketika tombol logout diklik
	// Memanggil fungsi logout yang didapat dari auth context
	const handleLogout = () => {
		removeAdminFromLocalStorage();
	};

	return (
		<header className="navbar navbar-expand-lg bg-body shadow-sm position-sticky top-0 z-1">
			<div className="container">
				{/* Tombol toggle untuk tampilan mobile */}
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarNav">
					<span className="navbar-toggler-icon"></span>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					<div className="d-flex align-items-center gap-3">
						{/* <!-- Form pencarian --> */}

						{searchField && (
							<form className="d-flex" role="search">
								<input
									className="form-control form-control-sm"
									type="search"
									placeholder="Cari..."
									data-lang-id="Cari..."
								/>
								<button
									className="btn btn-info btn-sm ms-1 d-flex align-items-center"
									type="submit"
									style={{ height: "31px" }}>
									<BsSearch />
								</button>
							</form>
						)}

						{/*Dropdown pemilihan bahasa*/}
						<div className="dropdown">
							<button
								className="btn btn-info btn-sm dropdown-toggle d-flex align-items-center gap-1"
								type="button"
								data-bs-toggle="dropdown"
								style={{ height: "31px" }}>
								<BsGlobe /> <span id="currentLang">ID</span>
							</button>
							<ul className="dropdown-menu">
								<li>
									<a className="dropdown-item" href="#">
										<BsGeoAltFill className="text-info" /> Indonesia
									</a>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										<BsGeoAltFill className="text-info" /> English
									</a>
								</li>
							</ul>
						</div>

						{/* Tombol toggle tema gelap/terang*/}
						<button
							className="btn btn-info btn-sm d-flex align-items-center"
							style={{ height: "31px" }}
							onClick={toggleTheme}>
							<BsMoonStars id="themeIcon" />
						</button>

						{/* Tombol keluar*/}
						{/* Menampilkan informasi admin dan tombol logout jika:
                - prop logOutButton bernilai true
                - admin sudah login (admin tidak null/undefined)
                Terdiri dari:
                - Icon dan nama admin (hanya tampil di layar medium ke atas)
                - Tombol logout yang akan memanggil handleLogout saat diklik
            */}
						{logOutButton && admin && (
							<div className="d-flex align-items-center gap-2">
								<span className="text-muted small d-none d-md-inline">
									<BsPersonCircle className="me-1" />
									{admin.name}
								</span>
								<button
									onClick={handleLogout}
									className="btn btn-outline-danger btn-sm"
									data-lang-id="Keluar">
									Keluar
								</button>
							</div>
						)}
					</div>
				</div>

				<Link
					to={"/admin/home"}
					className="navbar-brand d-flex align-items-center">
					<img
						src={favicon}
						alt="Logo SMP At-thahirin"
						width="32"
						height="32"
						className="me-2"
					/>
					<span
						className="fw-bold text-logo-gradient"
						data-lang-id="SMP PLUS AT-THAHIRIN">
						SMP PLUS AT-THAHIRIN
					</span>
				</Link>
			</div>
		</header>
	);
}
