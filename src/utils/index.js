import { nanoid } from "nanoid";

/**
 * FUNGSI: generateComplaintId
 *
 * Fungsi: Membuat ID unik untuk pengaduan
 * Format: ADU + NANO ID 9 KARAKTER
 * Contoh: ADU3gyfgedw3
 */

export const generateComplaintId = () => {
	const prefix = "ADU";
	const uniqueId = nanoid(6);
	return `${prefix}${uniqueId}`;
};

/**
 * FUNGSI: formatDate
 *
 * Fungsi: Format tangga
 * Format: Date Object ataU tanggal string
 * Contoh: "12 JULY 2025, 22:00"
 */

export const formatDate = (date) => {
	return new Intl.DateTimeFormat("id-ID", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
};

/**
 * FUNGSI: validateComplaintForm
 *
 * Fungsi: Validasi data form pengaduan
 * Input: Object dengan data form
 * Output: {isValid: boolean, errors: object}
 */

export const validateComplaintForm = (data) => {
	const errors = {};

	if (!data.category || data.category.trim() === "") {
		errors.category = "Kategori pengaduan harus dipilah";
	}

	if (!data.description || data.description.trim().length < 10) {
		errors.description = "Deskripsi minimal 10 karakter";
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

/**
 * FUNGSI: simulateApiDelay
 *
 * Fungsi: Simulasi delay API (untuk testing)
 * Berguna untuk menguji loading state
 */

export const simulateApiDelay = (ms = 1000) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * MOCK/Dummy DATABASE: mockUsers
 *
 * Data dummy untuk simulasi database user
 * ini nanti diganti dengan API call ke server
 * akun siswa : NIS  = 12345 PASSOWRD = siswa123
 * akun guru : NIP =54321 Password = guru123
 */
const mockUsers = [
	{
		nisn: "12345",
		password: "siswa123",
		name: "Assad - Siswa",
		role: "siswa",
	},
	{
		nisn: "54321",
		password: "guru123",
		name: "Rahmat - Guru",
		role: "guru",
	},
];

const adminAccount = {
	username: "6789",
	password: "admin123",
	name: "Admin",
	role: "admin",
};

/**
 * FUNGSI: loginUser
 *
 * Fungsi: Simulasi API login
 * Input: nisn dan password
 * Output: { success: boolean, user/error: object/string }
 */
export const loginUser = async (nisn, password) => {
	await simulateApiDelay(1500); // Simulasi delay network

	// Cari user berdasarkan nisn dan password
	const user = mockUsers.find(
		(u) => u.nisn === nisn && u.password === password
	);

	if (user) {
		// Login berhasil
		return {
			success: true,
			user: { nisn: user.nisn, name: user.name, role: user.role },
		};
	}

	// Login gagal
	return { success: false, error: "NISN/NIP atau password salah" };
};

export const loginAdmin = async (username, password) => {
	await simulateApiDelay(1500);

	if (
		!(username === adminAccount.username && password === adminAccount.password)
	) {
		return { success: false, error: "Username atau Password salah" };
	}

	return { success: true, admin: adminAccount };
};

export const checkComplaint = async (complaintId) => {
	await simulateApiDelay();

	const existingComplaints = JSON.parse(
		localStorage.getItem("complaints") || "[]"
	);

	const complaintTarget = existingComplaints.find(
		(complaint) => complaint.id === complaintId
	);

	if (!complaintTarget) {
		return { success: false, error: "Pengaduan tidak ditemukan" };
	}

	return complaintTarget;
};
