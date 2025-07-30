const BASE_URL = "http://3.27.88.145:5000";

function getAccessToken() {
	return localStorage.getItem("accessToken");
}

function putAccessToken(accessToken) {
	return localStorage.setItem("accessToken", accessToken);
}

function putRefreshToken(refreshToken) {
	return localStorage.setItem("refreshToken", refreshToken);
}

async function getUserLogged() {
	const response = await fetchWithToken(`${BASE_URL}/api`);
	const responseJson = await response.json();

	if (responseJson.status !== "success") {
		return { error: true, data: null };
	}

	return { error: false, data: responseJson.data };
}

async function fetchWithToken(url, options = {}) {
	return fetch(url, {
		...options,
		headers: {
			...options.headers,
			Authorization: `Bearer ${getAccessToken()}`,
		},
	});
}

async function login({ username, password }) {
	const response = await fetch(`${BASE_URL}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	});

	const responseJson = await response.json();

	if (responseJson.status !== "success") {
		return { error: true, data: null };
	}

	return { error: false, data: responseJson.data };
}

export {
	getAccessToken,
	putAccessToken,
	putRefreshToken,
	login,
	getUserLogged,
};
