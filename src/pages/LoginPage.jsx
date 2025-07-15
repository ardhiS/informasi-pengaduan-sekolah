import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AtThahirinLogo from "../assets/images/favicon-128x128.png";
import SecurityAlert from "../components/SecurityAlert";
// Import hook untuk mengakses context autentikasi
import { useAuth } from "../contexts/AuthContext";
// Import custom hook untuk mengelola input form
import useInput from "../hooks/useInput";
// Import custom hook untuk mengelola submit form
import useFormSubmit from "../hooks/useFormSubmit";
// Import fungsi untuk melakukan login user ke backend
import { loginUser } from "../utils";

export default function LoginPage() {
  // State untuk menyimpan nilai NISN/NIP
  const [nisn, onNisnChange] = useInput("");
  // State untuk menyimpan nilai password
  const [password, onPasswordChange] = useInput("");
  // State untuk mengelola status loading dan submit form
  const [loading, handleSubmit] = useFormSubmit();
  // State untuk menampilkan pesan error
  const [error, setError] = useState("");

  // Mengambil fungsi login dari context autentikasi
  const { login } = useAuth();
  // Hook untuk navigasi halaman
  const navigate = useNavigate();

  // Handler untuk submit form login
  const onSubmit = async (event) => {
    // Mencegah form melakukan refresh halaman
    event.preventDefault();
    // Reset pesan error
    setError("");

    // Menjalankan proses login
    await handleSubmit(async () => {
      // Memanggil API login
      const result = await loginUser(nisn, password);

      // Jika login berhasil
      if (result.success) {
        // Set data user ke context
        login(result.user);
        // Redirect ke halaman utama
        navigate("/");
      } else {
        // Jika gagal, tampilkan pesan error
        setError(result.error);
      }
    });
  };
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
              data-lang-id="SISTEM INFORMASI"
            >
              SISTEM INFORMASI
            </h1>
            <h2
              className="h5 mb-2 fw-bold text-info"
              data-lang-id="PENGADUAN ONLINE"
            >
              PENGADUAN ONLINE
            </h2>
          </div>

          {/* <!-- Pesan error --> */}
          {error && (
            <div className="alert alert-danger mb-3" role="alert">
              {error}
            </div>
          )}

          {/* <!-- Form login --> */}
          <form onSubmit={onSubmit}>
            {/* <!-- Input NISN/NIP --> */}
            <div className="mb-3">
              <label
                htmlFor="nisn"
                className="form-label fw-semibold text-dark mb-2"
                data-lang-id="NISN/NIP"
              >
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
                  data-lang-id="Masukan NISN/NIP anda"
                >
                  Masukan NISN/NIP anda
                </label>
              </div>
            </div>
            {/* <!-- Input password --> */}
            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label fw-semibold text-dark mb-2"
                data-lang-id="Kata Sandi"
              >
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
                  data-lang-id="Masukan kata sandi anda"
                >
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
                  htmlFor="ingatkanSaya"
                  data-lang-id="Ingatkan saya"
                >
                  Ingatkan saya
                </label>
              </div>
              <a
                href="#"
                className="small text-decoration-none text-info"
                data-lang-id="Lupa kata sandi?"
              >
                Lupa kata sandi?
              </a>
            </div>

            {/* <!-- Tombol submit --> */}
            <button
              className="w-100 btn btn-lg btn-info"
              type="submit"
              data-lang-id="Masuk"
            >
              {loading ? "Memproses...." : "Masuk"}
            </button>
          </form>
        </div>

        {/* <!-- Alert informasi keamanan --> */}
        <SecurityAlert />
      </main>
    </>
  );
}
