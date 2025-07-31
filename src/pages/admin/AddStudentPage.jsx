import useInput from "../../hooks/useInput";
import useFormSubmit from "../../hooks/useFormSubmit";
import { addUser } from "../../utils/api";

export default function AddStudentPage() {
	const [nisn, onNisnChange] = useInput();
	const [password, onPasswordChange] = useInput();
	const [fullname, onFullnameChange] = useInput();
	const [loading, handleSubmit] = useFormSubmit();

	const submitHandler = async (event) => {
		event.preventDefault();

		await handleSubmit(async () => {
			const { error } = await addUser({
				identifierNumber: nisn,
				password,
				fullname,
				role: "siswa",
			});
			if (error) {
				alert("Gagal menambahkan user");
				return;
			}

			alert(`Guru dengan NISN ${nisn} berhasil ditambahkan`);
		});
	};

	return (
		<div className="container py-4">
			<div className="card shadow-sm">
				<div className="card-header">
					<h5 className="mb-0">Formulir Data Siswa</h5>
				</div>
				<div className="card-body">
					<form id="form-tambah-siswa" onSubmit={submitHandler}>
						<div className="mb-3">
							<label htmlFor="nisn" className="form-label">
								NISN
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-hash"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="nisn"
									placeholder="Masukkan NISN siswa"
									value={nisn}
									onChange={onNisnChange}
									required
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="nama" className="form-label">
								Password
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-person-fill"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="nama"
									placeholder="Masukkan nama lengkap"
									value={password}
									onChange={onPasswordChange}
									required
								/>
							</div>
						</div>
						<div className="mb-3">
							<label htmlFor="nama" className="form-label">
								Nama Lengkap
							</label>
							<div className="input-group">
								<span className="input-group-text">
									<i className="bi bi-person-fill"></i>
								</span>
								<input
									type="text"
									className="form-control"
									id="nama"
									placeholder="Masukkan nama lengkap"
									value={fullname}
									onChange={onFullnameChange}
									required
								/>
							</div>
						</div>
					</form>
				</div>
				<div className="card-footer bg-white text-end">
					<a href="list-siswa.html" className="btn btn-secondary me-2">
						Batal
					</a>
					<button
						type="submit"
						form="form-tambah-siswa"
						className="btn btn-primary">
						<i className="bi bi-save me-2"></i>
						{loading ? "menyimpan..." : "Simpan Data"}
					</button>
				</div>
			</div>
		</div>
	);
}
