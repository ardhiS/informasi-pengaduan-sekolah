import React from "react";

export default function Footer() {
	return (
		<footer className="bg-body-white border-top mt-5">
			<div className="container py-4 text-center">
				{/* <!-- Link footer --> */}
				<div className="mb-2">
					<a
						href="#"
						className="text-decoration-none text-info me-3"
						data-lang-id="Kebijakan Privasi">
						Kebijakan Privasi
					</a>
					<a
						href="#"
						className="text-decoration-none text-info"
						data-lang-id="Bantuan">
						Bantuan
					</a>
				</div>
				{/* <!-- Copyright --> */}
				<p
					className="text-muted small mb-0"
					data-lang-id="Sistem didukung oleh © 2025 AT-THAHIRIN">
					Sistem didukung oleh &copy; 2025 AT-THAHIRIN
				</p>
			</div>
		</footer>
	);
}
