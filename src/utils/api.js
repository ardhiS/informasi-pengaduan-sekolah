// Alamat dasar dari server backend Anda
const BASE_URL = "http://3.27.88.145:5000";

// --- Fungsi Helper untuk Mengelola Token ---

function getAccessToken() {
	return localStorage.getItem("accessToken");
}

function putAccessToken(accessToken) {
	return localStorage.setItem("accessToken", accessToken);
}

function getRefreshToken() {
	return localStorage.getItem("refreshToken");
}

function putRefreshToken(refreshToken) {
	return localStorage.setItem("refreshToken", refreshToken);
}

// Fungsi pembantu untuk fetch dengan token otentikasi
async function fetchWithToken(url, options = {}) {
	return fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${getAccessToken()}`,
		},
	});
}

// Helper untuk mengubah objek menjadi query string
function buildQueryString(params) {
	return Object.keys(params)
		.map(
			(key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
		)
		.join("&");
}

// --- 1. AUTHENTICATION API ---

/**
 * Melakukan login untuk user.
 * @param {object} credentials - { username, password }
 * @returns {Promise<object>}
 */
async function login({ username, password }) {
	const response = await fetch(`${BASE_URL}/api/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username, password }),
	});
	return response.json();
}

/**
 * Mendaftarkan user baru.
 * @param {object} userData - { username, password, fullName, role, email }
 * @returns {Promise<object>}
 */
async function register(userData) {
	const response = await fetch(`${BASE_URL}/api/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(userData),
	});
	return response.json();
}

/**
 * Melakukan logout dengan menghapus token di client dan memanggil API.
 */
async function logout() {
	// Menggunakan endpoint legacy DELETE /api/authentications
	await fetchWithToken(`${BASE_URL}/api/authentications`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refreshToken: getRefreshToken() }),
	});
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
}

/**
 * Memperbarui access token menggunakan refresh token.
 * @returns {Promise<object>}
 */
async function refreshAuthToken() {
	const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ refreshToken: getRefreshToken() }),
	});
	return response.json();
}

/**
 * Mendapatkan data pengguna yang sedang login.
 * @returns {Promise<object>}
 */
async function getUserLogged() {
	// Menggunakan endpoint GET /api/users/{id} yang spesifik, misal 'me'
	// Jika backend tidak support 'me', cara lain diperlukan. Untuk saat ini, kita asumsikan login sudah mengembalikan data user.
	// Namun, jika API-nya ada, implementasinya akan seperti ini:
	// const response = await fetchWithToken(`${BASE_URL}/api/users/me`);
	// return response.json();
	// Untuk sementara, fungsi ini bisa di-skip jika data user sudah didapat dari `login`.
	// Jika belum ada, kita bisa mengambilnya dari `login` dan menyimpannya.
}

// =================================================================
// --- 2. USER & GURU MANAGEMENT API ---
// =================================================================

/**
 * Mendapatkan daftar pengguna dengan filter dan paginasi.
 * @param {object} params - { role, page, limit, search, sort, order }
 * @returns {Promise<object>}
 */
async function getUsers(params = {}) {
	const queryString = buildQueryString(params);
	const response = await fetchWithToken(`${BASE_URL}/api/users?${queryString}`);
	return response.json();
}

/**
 * Mendapatkan detail pengguna berdasarkan ID.
 * @param {string} id - User ID
 * @returns {Promise<object>}
 */
async function getUserDetails(id) {
	const response = await fetchWithToken(`${BASE_URL}/api/users/${id}`);
	return response.json();
}

// ... Tambahkan fungsi lain untuk update, delete, dan get stats jika diperlukan

// =================================================================
// --- 3. COMPLAINT MANAGEMENT API ---
// =================================================================

/**
 * Membuat pengaduan baru dengan unggahan file.
 * @param {FormData} formData - FormData object (title, description, category, priority, images[])
 * @returns {Promise<object>}
 */
async function createComplaint(formData) {
	// fetchWithToken tidak bisa langsung dipakai karena header 'Content-Type' diatur otomatis oleh browser untuk FormData
	const response = await fetch(`${BASE_URL}/api/complaints`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
			// JANGAN SET 'Content-Type': 'multipart/form-data', browser akan melakukannya
		},
		body: formData,
	});
	return response.json();
}

/**
 * Mendapatkan daftar pengaduan milik pengguna yang sedang login.
 * @returns {Promise<object>}
 */
async function getMyComplaints() {
	const response = await fetchWithToken(`${BASE_URL}/api/complaints/my`);
	return response.json();
}

/**
 * Mendapatkan semua pengaduan publik (tanpa otentikasi).
 * @returns {Promise<object>}
 */
async function getPublicComplaints() {
	const response = await fetch(`${BASE_URL}/api/complaints/all`);
	return response.json();
}

/**
 * Mendapatkan detail pengaduan berdasarkan ID.
 * @param {string} id - Complaint ID
 * @returns {Promise<object>}
 */
async function getComplaintDetails(id) {
	const response = await fetchWithToken(`${BASE_URL}/api/complaints/${id}`);
	return response.json();
}

// ... Tambahkan fungsi lain untuk list semua complaints (dengan filter), update, dan delete jika diperlukan

// =================================================================
// --- 4. ADVANCED COMPLAINT OPERATIONS API ---
// =================================================================

/**
 * Mengubah status pengaduan.
 * @param {string} id - Complaint ID
 * @param {object} payload - { status, resolution }
 * @returns {Promise<object>}
 */
async function updateComplaintStatus(id, payload) {
	const response = await fetchWithToken(
		`${BASE_URL}/api/complaints/${id}/status`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}
	);
	return response.json();
}

/**
 * Menugaskan pengaduan ke staff.
 * @param {string} id - Complaint ID
 * @param {object} payload - { assigned_to, admin_notes }
 * @returns {Promise<object>}
 */
async function assignComplaint(id, payload) {
	const response = await fetchWithToken(
		`${BASE_URL}/api/complaints/${id}/assign`,
		{
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		}
	);
	return response.json();
}

// ... Tambahkan fungsi untuk approve dan reject jika diperlukan

// Menambahkan user melalui akun admin
async function addUser({ identifierNumber, password, fullname, role }) {
	const payload = { username: identifierNumber, password, fullname, role };
	console.log("Token saat ini:", getAccessToken());
	const response = await fetchWithToken(`${BASE_URL}/api/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const responseJson = await response.json();

	if (responseJson.status !== "success") {
		return { error: true, data: null };
	}

	return { error: false, data: responseJson.data.userId };
}

// Export semua fungsi agar bisa digunakan di komponen lain
export {
	// Helpers
	putAccessToken,
	getAccessToken,
	putRefreshToken,
	getRefreshToken,

	// Auth
	login,
	register,
	logout,
	refreshAuthToken,
	getUserLogged,

	// Users
	getUsers,
	getUserDetails,

	// Complaints
	createComplaint,
	getMyComplaints,
	getPublicComplaints,
	getComplaintDetails,
	updateComplaintStatus,
	assignComplaint,

	// Admin
	addUser,
};
