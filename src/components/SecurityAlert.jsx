export default function SecurityAlert() {
	return (
		<div className="d-flex justify-content-center mt-4">
			<div className="alert alert-success alert-success-custom d-flex align-items-center">
				<div className="small">
					<i className="bi bi-shield-fill-check me-1 shield-icon"></i>
					<strong data-lang-id="Semua komunikasi bersifat anonim dan dienkripsi">
						Semua komunikasi bersifat anonim dan dienkripsi
					</strong>
					,{" "}
					<a
						href="#"
						className="text-decoration-underline link-custom"
						data-lang-id="Pelajari lebih lanjut tentang anonimitas">
						Pelajari lebih lanjut tentang anonimitas
					</a>
				</div>
			</div>
		</div>
	);
}
