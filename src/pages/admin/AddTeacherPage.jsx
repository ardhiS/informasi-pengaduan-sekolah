import { Link } from "react-router-dom";
import useInput from "../../hooks/useInput";
import { addUser } from "../../utils/api";
import useFormSubmit from "../../hooks/useFormSubmit";

export default function AddTeacherPage() {
	const [nip, onNipChange] = useInput();
	const [password, onPasswordChange] = useInput();
	const [fullname, onFullnameChange] = useInput();
	const [loading, handleSubmit] = useFormSubmit();

	const submitHandler = async (event) => {
		event.preventDefault();

		await handleSubmit(async () => {
			const { error } = await addUser({
				identifierNumber: nip,
				password,
				fullname,
				role: "guru",
			});
			if (error) {
				alert("Gagal menambahkan user");
				return;
			}

			alert(`Guru dengan NIP ${nip} berhasil ditambahkan`);
		});
	};

	return (
		<div className="container py-4">
			<div className="card shadow-sm">
				<div className="card-header">
					<h5 className="mb-0">Formulir Data Guru</h5>
				</div>
				<div className="card-body">
					<form id="form-tambah-guru" onSubmit={submitHandler}>
						<div className="mb-3">
							<label htmlFor="nip" className="form-label">
								NIP
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-person-badge"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="nip"
									placeholder="Masukkan Nomor Induk Pegawai"
									value={nip}
									onChange={onNipChange}
									required
								/>
							</div>
						</div>

						<div className="mb-3">
							<label htmlFor="mapel" className="form-label">
								Password
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-book-half"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="mapel"
									placeholder="Contoh: Matematika"
									value={password}
									onChange={onPasswordChange}
									required
								/>
							</div>
						</div>

						<div className="mb-3">
							<label htmlFor="nama_guru" className="form-label">
								Nama Lengkap & Gelar
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-person-fill"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="nama_guru"
									placeholder="Contoh: Dr. Nama, M.Pd."
									value={fullname}
									onChange={onFullnameChange}
									required
								/>
							</div>
						</div>
					</form>
				</div>
				<div className="card-footer bg-body text-end">
					<Link to={"/admin/home"} className="btn btn-secondary me-2">
						Batal
					</Link>
					<button
						type="submit"
						className="btn btn-primary"
						form="form-tambah-guru">
						<i className="bi bi-save me-2"></i>
						{loading ? "Menyimpan..." : "Simpan Data"}
					</button>
				</div>
			</div>
		</div>
	);
}
