import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useInput from "../../hooks/useInput";
import useFormSubmit from "../../hooks/useFormSubmit";
// import { loginAdmin } from "../../utils";
// import { useAuth } from "../../contexts/AuthContext";

import {
	login,
	putAccessToken,
	putRefreshToken,
} from "../../utils/network-data";

export default function AdminLoginPage() {
	const [username, onChangeUsername] = useInput();
	const [password, onChangePassword] = useInput();
	const [loading, handleSubmit] = useFormSubmit();
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const submitHandler = async (event) => {
		event.preventDefault();
		// await handleSubmit(async () => {
		// 	const result = await loginAdmin(username, password);
		// 	console.log(result);
		// 	if (!result.success) {
		// 		setError(result.error);
		// 		return;
		// 	}
		// 	saveAdminToLocalStorage(result.admin);
		// 	console.log("Admin after save:", result); // ✅ log ini
		// 	navigate("/admin/home");
		// 	console.log("Navigate");
		// });

		await handleSubmit(async () => {
			const { error, data } = await login({ username, password });

			if (error || !data?.accessToken || !data?.refreshToken) {
				setError("Username atau Password salah");
				return;
			}
			putAccessToken(data.accessToken);
			putRefreshToken(data.refreshToken);

			navigate("/admin/home");
		});
	};
	return (
		<div className="col-11 col-sm-10 col-md-8 col-lg-5 col-xl-4 mx-auto mt-5">
			<div className="card shadow-lg border-0 rounded-4">
				<div className="card-body p-4 p-md-5">
					<div className="text-center mb-4">
						<i className="bi bi-shield-lock-fill display-4 text-primary"></i>
						<h3 className="mt-3 fw-bold">Admin Panel</h3>
						<p className="text-muted">Selamat datang kembali!</p>
					</div>
					{error && (
						<div className="alert alert-danger mb-3" role="alert">
							{error}
						</div>
					)}

					<form onSubmit={submitHandler}>
						<div className="input-group mb-3">
							<span className="input-group-text">
								<i className="bi bi-person"></i>
							</span>
							<div className="form-floating">
								<input
									type="text"
									className="form-control"
									id="username"
									placeholder="Username"
									value={username}
									onChange={onChangeUsername}
									required
								/>
								<label htmlFor="username">Username</label>
							</div>
						</div>

						<div className="input-group mb-3">
							<span className="input-group-text">
								<i className="bi bi-lock"></i>
							</span>
							<div className="form-floating">
								<input
									type="password"
									className="form-control"
									id="password"
									placeholder="Password"
									value={password}
									onChange={onChangePassword}
									required
								/>
								<label htmlFor="password">Password</label>
							</div>
						</div>

						<div className="d-flex justify-content-between align-items-center mb-4">
							<div className="form-check">
								<input
									className="form-check-input"
									type="checkbox"
									value=""
									id="ingatSaya"
								/>
								<label className="form-check-label" htmlFor="ingatSaya">
									Ingat Saya
								</label>
							</div>
							<a href="#" className="small text-decoration-none">
								Lupa password?
							</a>
						</div>

						<div className="d-grid">
							<button className="btn btn-primary btn-lg" type="submit">
								{loading ? "Memproses..." : "Masuk"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
