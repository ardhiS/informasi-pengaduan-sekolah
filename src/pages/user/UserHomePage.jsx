import React from "react";
import {
	BsCheckCircleFill,
	BsPlusCircleFill,
	BsSearch,
	BsShieldFillCheck,
} from "react-icons/bs";
import { Link } from "react-router-dom";

import SecurityAlert from "../../components/SecurityAlert";

function HomePage() {
	return (
		<>
			<main className="container my-5">
				<div className="row justify-content-center">
					<div className="col-lg-8 text-start">
						{/* <!-- Judul dan subtitle --> */}
						<h1
							className="display-4 fw-bold mb-3 text-info"
							data-lang-id="Pengaduan Online">
							Pengaduan Online
						</h1>
						<p
							className="fs-5 text-muted mb-4 fw-medium"
							data-lang-id="Laporkan Tanpa Ragu: Kami Lindungi Identitas Anda">
							Laporkan Tanpa Ragu: Kami Lindungi Identitas Anda
						</p>

						{/* <!-- Alert informasi --> */}
						<div className="alert alert-info border-0 bg-light-subtle">
							<p
								className="mb-3 fs-6 lh-lg"
								data-lang-id="Apakah Anda mengalami atau mengetahui hal yang tidak semestinya terjadi dalam lingkungan sekolah? Kami menyediakan saluran pengaduan khusus yang dapat digunakan secara anonim.">
								Apakah Anda mengalami atau mengetahui hal yang tidak semestinya
								terjadi dalam lingkungan sekolah? Kami menyediakan saluran
								pengaduan khusus yang dapat digunakan secara anonim.
							</p>
							<p
								className="mb-0 fs-6 lh-lg"
								data-lang-id="Sekolah kami menjunjung tinggi nilai integritas, keamanan, dan kenyamanan seluruh siswa, guru, serta staf. Jika Anda melihat atau mengalami hal yang tidak pantas seperti bullying, pelecehan, atau pelanggaran lainnya, Anda dapat melaporkannya melalui saluran ini tanpa mengungkap identitas. Semua laporan akan diproses secara rahasia dan profesional.">
								Sekolah kami menjunjung tinggi nilai integritas, keamanan, dan
								kenyamanan seluruh siswa, guru, serta staf. Jika Anda melihat
								atau mengalami hal yang tidak pantas seperti bullying,
								pelecehan, atau pelanggaran lainnya, Anda dapat melaporkannya
								melalui saluran ini tanpa mengungkap identitas. Semua laporan
								akan diproses secara rahasia dan profesional.
							</p>
						</div>

						{/* <!-- Card panduan pelaporan --> */}
						<div className="card border-0 bg-body mt-4">
							<div className="card-body p-4">
								<h3
									className="card-title mb-4 fs-3 fw-bold text-info"
									data-lang-id="Panduan Pelaporan">
									Panduan Pelaporan
								</h3>

								{/* <!-- Panduan cara pelaporan --> */}
								<h5
									className="mb-3 fs-5 fw-semibold"
									data-lang-id="Cara menyampaikan laporan dengan tepat:">
									Cara menyampaikan laporan dengan tepat:
								</h5>
								<ul className="list-unstyled">
									<li className="mb-3 fs-6 d-flex align-items-center gap-3">
										<BsCheckCircleFill className="text-success" />
										<span
											className="text-muted"
											data-lang-id="Sampaikan secara rinci—ceritakan kejadian, waktu, dan pihak yang terlibat sejelas mungkin">
											<strong
												className="fw-bold text-body"
												data-lang-id="Isi laporan dengan jujur">
												Isi laporan dengan jujur:
											</strong>
											Sampaikan secara rinci—ceritakan kejadian, waktu, dan
											pihak yang terlibat
										</span>
									</li>
									<li className="mb-3 fs-6 d-flex align-items-center gap-3">
										<BsCheckCircleFill className="text-success" />
										<span data-lang-id="Gunakan bahasa yang sopan dan jelas">
											<strong
												className="fw-bold text-body"
												data-lang-id="Isi laporan dengan jujur">
												Gunakan bahasa yang sopan dan jelas
											</strong>
										</span>
									</li>
								</ul>

								{/* <!-- Informasi kode laporan --> */}
								<h5
									className="mt-4 mb-3 fs-5 fw-semibold"
									data-lang-id="Simpan kode laporan Anda">
									Simpan kode laporan Anda
								</h5>
								<p
									className="mb-0 fs-6 text-muted lh-lg"
									data-lang-id="Setelah mengirim laporan, Anda akan mendapatkan kode unik. Simpan baik-baik, karena kode ini memungkinkan Anda untuk melihat perkembangan laporan dan memberikan informasi tambahan.">
									Setelah mengirim laporan, Anda akan mendapatkan kode unik.
									Simpan baik-baik, karena kode ini memungkinkan Anda untuk
									melihat perkembangan laporan dan memberikan informasi
									tambahan.
								</p>
							</div>
						</div>

						{/* <!-- Tombol aksi --> */}
						<div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
							{/* <button
								onClick={handleCreateComplaint}
								className="btn btn-info btn-lg px-4 d-flex align-items-center gap-2"
								type="button">
								<BsPlusCircleFill />

								<span data-lang-id="Buat Pengaduan">Buat Pengaduan</span>
							</button> */}

							{/* Menggunakan Link dari react-router-dom */}
							<Link
								to={"/user/complaints/form"}
								className="btn btn-info btn-lg px-4 d-flex align-items-center gap-2">
								<BsPlusCircleFill />
								<span data-lang-id="Buat Pengaduan">Buat Pengaduan</span>
							</Link>

							<Link
								to={"/user/complaints/check"}
								className="btn btn-outline-info btn-lg px-4 d-flex align-items-center gap-2">
								<BsSearch />
								<span data-lang-id="Cek Pengaduan">Cek Pengaduan</span>
							</Link>
						</div>

						{/* <!-- Alert keamanan --> */}
						<SecurityAlert />
					</div>
				</div>
			</main>
		</>
	);
}

export default HomePage;
