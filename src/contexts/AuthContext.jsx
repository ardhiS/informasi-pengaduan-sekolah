import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Context untuk mengelola state autentikasi aplikasi
 *
 * Menyediakan:
 * - State user yang sedang login
 * - State loading untuk proses autentikasi
 * - Fungsi login untuk menyimpan data user
 * - Fungsi logout untuk menghapus data user
 *
 * Cara pakai:
 * const { user, loading, login, logout } = useAuth();
 */
const AuthContext = createContext();

/**
 * Custom hook untuk menggunakan AuthContext
 *
 * Kegunaan:
 * - Mempermudah akses ke context autentikasi
 * - Memastikan hook digunakan dalam AuthProvider
 * - Memberikan type safety untuk nilai context
 *
 * Cara pakai:
 * const auth = useAuth();
 * const { user, loading } = useAuth();
 */
export function useAuth() {
	const context = useContext(AuthContext);
	// Memastikan hook digunakan dalam AuthProvider
	if (!context) {
		throw new Error("useAuth harus digunakan dalam AuthProvider");
	}
	return context;
}

/**
 * Provider component untuk menyediakan state autentikasi
 *
 * Kegunaan:
 * - Menyediakan state global untuk autentikasi
 * - Mengelola penyimpanan data user di localStorage
 * - Memastikan konsistensi state autentikasi
 *
 * Cara pakai:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 */
export function AuthProvider({ children }) {
	// State untuk menyimpan data user
	const [user, setUser] = useState(null);
	// State untuk menandai proses loading
	const [loading, setLoading] = useState(true);
	const [admin, setAdmin] = useState(null);

	// Effect untuk mengecek user yang tersimpan di localStorage saat komponen dimount
	useEffect(() => {
		const savedUser = localStorage.getItem("user");
		const savedAdmin = localStorage.getItem("admin");

		if (savedUser) {
			setUser(JSON.parse(savedUser));
		}
		if (savedAdmin) {
			setAdmin(JSON.parse(savedAdmin));
		}

		setLoading(false);
	}, []);

	// Fungsi untuk melakukan login
	const login = (userData) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	const adminLogin = (adminData) => {
		setAdmin(adminData);
		localStorage.setItem("admin", JSON.stringify(adminData));
	};

	// Fungsi untuk melakukan logout
	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	};

	const adminLogout = () => {
		setAdmin(null);
		localStorage.removeItem("admin");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				adminLogin,
				logout,
				adminLogout,
				admin,
			}}>
			{children}
		</AuthContext.Provider>
	);
}
