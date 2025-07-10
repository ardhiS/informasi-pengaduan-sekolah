import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AtThahirinLogo from "../assets/images/favicon-128x128.png";
import { BsShieldFillCheck } from "react-icons/bs";
import SecurityAlert from "../components/SecurityAlert";

export default function LoginPage() {
	return (
		<>
			<main>
				<div className="card px-5 py-3 card-login">
					<div className="text-center mb-4">
						<img
							className="logo-login mb-3"
							src={AtThahirinLogo}
							alt="Logo Sistem Pengaduan"
						/>
						<h1
							className="h4 mb-1 fw-bold text-success"
							data-lang-id="SISTEM INFORMASI">
							SISTEM INFORMASI
						</h1>
						<h2
							className="h5 mb-2 fw-bold text-info"
							data-lang-id="PENGADUAN ONLINE">
							PENGADUAN ONLINE
						</h2>
					</div>

					{/* <!-- Form login --> */}
					<form>
						{/* <!-- Input NISN/NIP --> */}
						<div className="mb-3">
							<label
								for="nisn"
								className="form-label fw-semibold text-dark mb-2"
								data-lang-id="NISN/NIP">
								NISN/NIP
							</label>
							<div className="form-floating">
								<input
									type="text"
									className="form-control"
									id="nisn"
									placeholder="Masukan NISN/NIP anda"
								/>
								<label
									for="nisn"
									className="text-muted"
									data-lang-id="Masukan NISN/NIP anda">
									Masukan NISN/NIP anda
								</label>
							</div>
						</div>
						{/* <!-- Input password --> */}
						<div className="mb-3">
							<label
								for="password"
								className="form-label fw-semibold text-dark mb-2"
								data-lang-id="Kata Sandi">
								Kata Sandi
							</label>
							<div className="form-floating">
								<input
									type="password"
									className="form-control"
									id="password"
									placeholder="Masukan kata sandi anda"
								/>
								<label
									for="password"
									className="text-muted"
									data-lang-id="Masukan kata sandi anda">
									Masukan kata sandi anda
								</label>
							</div>
						</div>

						{/* <!-- Checkbox "Ingatkan saya" dan link "Lupa kata sandi" --> */}
						<div className="d-flex justify-content-between align-items-center mb-3">
							<div className="form-check">
								<input
									className="form-check-input"
									type="checkbox"
									value=""
									id="ingatkanSaya"
								/>
								<label
									className="form-check-label"
									for="ingatkanSaya"
									data-lang-id="Ingatkan saya">
									Ingatkan saya
								</label>
							</div>
							<a
								href="#"
								className="small text-decoration-none text-info"
								data-lang-id="Lupa kata sandi?">
								Lupa kata sandi?
							</a>
						</div>

						{/* <!-- Tombol submit --> */}
						<button
							className="w-100 btn btn-lg btn-info"
							type="submit"
							data-lang-id="Masuk">
							Masuk
						</button>
					</form>
				</div>

				{/* <!-- Alert informasi keamanan --> */}
				<SecurityAlert />
			</main>
		</>
	);
}
