export default function FeedbackPage() {
	return (
		<div className="container py-4">
			<h3 className="mb-3">Pertanyaan yang Sering Diajukan (FAQ)</h3>
			<div className="accordion shadow-sm mb-4" id="faqAccordion">
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button
							className="accordion-button"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseOne">
							Bagaimana cara mengonfirmasi sebuah pengaduan?
						</button>
					</h2>
					<div
						id="collapseOne"
						className="accordion-collapse collapse show"
						data-bs-parent="#faqAccordion">
						<div className="accordion-body">
							Anda dapat masuk ke halaman detail pengaduan, lalu klik tombol
							"Konfirmasi". Anda akan diarahkan ke halaman untuk mengisi detail
							tindakan yang telah dilakukan.
						</div>
					</div>
				</div>
				<div className="accordion-item">
					<h2 className="accordion-header">
						<button
							className="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#collapseTwo">
							Apakah saya bisa mengubah status pengaduan?
						</button>
					</h2>
					<div
						id="collapseTwo"
						className="accordion-collapse collapse"
						data-bs-parent="#faqAccordion">
						<div className="accordion-body">
							Ya, Anda bisa mengubah status menjadi "Pending" jika pengaduan
							sedang dalam proses, atau "Selesai" jika sudah ditindaklanjuti.
						</div>
					</div>
				</div>
			</div>

			<h3 className="mb-3">Kirim Masukan Anda</h3>
			<div className="card shadow-sm">
				<div className="card-body">
					<p className="text-muted">
						Punya saran atau menemukan masalah? Beri tahu kami agar kami bisa
						memperbaikinya.
					</p>
					<form>
						<div className="mb-3">
							<label htmlFor="feedbackText" className="form-label">
								Pesan Anda
							</label>
							<textarea
								className="form-control"
								id="feedbackText"
								rows="5"
								required></textarea>
						</div>
						<button type="submit" className="btn btn-primary">
							Kirim Feedback
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
