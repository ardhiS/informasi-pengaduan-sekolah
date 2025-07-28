export default function AdminFooter() {
	return (
		<footer className="bottom-nav bg-white p-2 sticky-bottom">
			<nav className="nav nav-fill">
				<a className="nav-link text-muted" href="beranda.html">
					<i className="bi bi-house-door-fill d-block"></i>Beranda
				</a>
				<a className="nav-link active" href="pengaduan.html">
					<i className="bi bi-flag-fill d-block"></i>Pengaduan
				</a>
				<a className="nav-link text-muted" href="fitur.html">
					<i className="bi bi-grid-fill d-block"></i>Fitur
				</a>
				<a className="nav-link text-muted" href="lainnya.html">
					<i className="bi bi-three-dots d-block"></i>Lainnya
				</a>
			</nav>
		</footer>
	);
}
