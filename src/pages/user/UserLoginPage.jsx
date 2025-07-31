import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AtThahirinLogo from "../../assets/images/favicon-128x128.png";
import SecurityAlert from "../../components/SecurityAlert";
import useInput from "../../hooks/useInput";
import { useAuth } from "../../contexts/AuthContext";
import useFormSubmit from "../../hooks/useFormSubmit";

import {
	login as apiLogin,
	putAccessToken,
	putRefreshToken,
} from "../../utils/api";

export default function LoginPage() {
	const [nisn, onNisnChange] = useInput("");
	const [password, onPasswordChange] = useInput("");
	const [loading, handleSubmit] = useFormSubmit();
	const [error, setError] = useState("");

	const { login } = useAuth();
	const navigate = useNavigate();

	// Logika onSubmit
	const onSubmit = async (event) => {
		event.preventDefault();
		setError("");

		await handleSubmit(async () => {
			// Panggil API login
			const result = await apiLogin({ username: nisn, password });

			if (result.status !== "success") {
				setError(result.message || "NISN/NIP atau Password salah.");
				return;
			}

			if (
				result.data.user.role !== "siswa" &&
				result.data.user.role !== "guru"
			) {
				setError("Hanya user yang boleh login di halaman ini");
				return;
			}

			putAccessToken(result.data.accessToken);
			putRefreshToken(result.data.refreshToken);
			login(result.data.user);
			navigate("/user/home");
		});
	};

	return (
		<>
			<div className="card px-5 py-3 card-login shadow border">
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

				{error && (
					<div className="alert alert-danger mb-3" role="alert">
						{error}
					</div>
				)}

				<form onSubmit={onSubmit}>
					<div className="mb-3">
						<label
							htmlFor="nisn"
							className="form-label fw-semibold text-body mb-2"
							data-lang-id="NISN/NIP">
							NISN/NIP
						</label>
						<div className="form-floating">
							<input
								type="text"
								className="form-control"
								id="nisn"
								placeholder="Masukan NISN/NIP anda"
								value={nisn}
								onChange={onNisnChange}
								required
							/>
							<label
								htmlFor="nisn"
								className="text-muted"
								data-lang-id="Masukan NISN/NIP anda">
								Masukan NISN/NIP anda
							</label>
						</div>
					</div>
					<div className="mb-3">
						<label
							htmlFor="password"
							className="form-label fw-semibold text-body mb-2"
							data-lang-id="Kata Sandi">
							Kata Sandi
						</label>
						<div className="form-floating">
							<input
								type="password"
								className="form-control"
								id="password"
								placeholder="Masukan kata sandi anda"
								value={password}
								onChange={onPasswordChange}
								required
							/>
							<label
								htmlFor="password"
								className="text-muted"
								data-lang-id="Masukan kata sandi anda">
								Masukan kata sandi anda
							</label>
						</div>
					</div>

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
								htmlFor="ingatkanSaya"
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

					<button
						className="w-100 btn btn-lg btn-info"
						type="submit"
						data-lang-id="Masuk">
						{loading ? "Memproses...." : "Masuk"}
					</button>
				</form>
			</div>

			<SecurityAlert />
		</>
	);
}
