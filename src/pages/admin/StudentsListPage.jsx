import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../../utils/api";

export default function StudentsListPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Mengambil data siswa saat komponen dimuat
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Memanggil API untuk mendapatkan pengguna dengan peran 'siswa'
        const response = await api.getUsers({ role: "siswa" });
        if (response.status === "success") {
          setStudents(response.data.users || []);
          setFilteredStudents(response.data.users || []);
        } else {
          throw new Error("Gagal mengambil data dari server.");
        }
      } catch (err) {
        setError("Gagal memuat data siswa. Silakan coba lagi nanti.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // 2. Efek untuk memfilter daftar siswa berdasarkan input pencarian
  useEffect(() => {
    const results = students.filter(
      (student) =>
        student.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.username && student.username.includes(searchTerm)) // Asumsi username adalah NISN
    );
    setFilteredStudents(results);
  }, [searchTerm, students]);

  // 3. Fungsi untuk menangani penghapusan siswa dengan feedback
  const handleDelete = async (studentId) => {
    // Menampilkan dialog konfirmasi sebelum menghapus
    if (window.confirm("Apakah Anda yakin ingin menghapus data siswa ini?")) {
      try {
        // Memanggil fungsi deleteUser dari api.js
        const response = await api.deleteUser(studentId);

        // Memeriksa apakah API call berhasil
        if (response.status === "success") {
          // Menghapus siswa dari state lokal untuk memperbarui UI secara langsung
          setStudents((prev) => prev.filter((s) => s.id !== studentId));
          alert("Data siswa berhasil dihapus."); // Notifikasi sukses
        } else {
          // Jika status dari API bukan 'success', lemparkan error
          throw new Error(
            response.message || "Gagal menghapus data dari server."
          );
        }
      } catch (err) {
        // Menampilkan pesan error kepada pengguna
        alert(err.message || "Gagal menghapus data siswa.");
        console.error(err);
      }
    }
  };

  // 4. Fungsi untuk merender isi tabel secara dinamis
  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tr>
          {/* Mengubah colSpan menjadi 4 */}
          <td colSpan="4" className="text-center p-4">
            Memuat data...
          </td>
        </tr>
      );
    }

    if (error) {
      return (
        <tr>
          {/* Mengubah colSpan menjadi 4 */}
          <td colSpan="4" className="text-center text-danger p-4">
            {error}
          </td>
        </tr>
      );
    }

    if (filteredStudents.length === 0) {
      return (
        <tr>
          {/* Mengubah colSpan menjadi 4 */}
          <td colSpan="4" className="text-center p-4">
            {searchTerm ? "Siswa tidak ditemukan." : "Belum ada data siswa."}
          </td>
        </tr>
      );
    }

    return filteredStudents.map((student, index) => (
      <tr key={student.id}>
        <th scope="row">{index + 1}</th>
        <td>{student.fullname}</td>
        <td>{student.username}</td>
        {/* Kolom Kelas dihapus dari sini */}
        <td className="text-end">
          {/* <Link
            to={`/admin/edit/student/${student.id}`}
            className="btn btn-sm btn-outline-primary me-2"
            title="Edit"
          >
            <i className="bi bi-pencil-square"></i>
          </Link> */}
          <button
            onClick={() => handleDelete(student.id)}
            className="btn btn-sm btn-outline-danger"
            title="Hapus"
          >
            <i className="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <main className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Daftar Siswa</h2>
        <Link to={"/admin/add/student"} className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Tambah Siswa
        </Link>
      </div>

      <div className="input-group mb-4 shadow-sm">
        <span className="input-group-text bg-white">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Cari nama atau NISN siswa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nama Siswa</th>
                <th scope="col">NISN</th>
                {/* Kolom header Kelas dihapus */}
                <th scope="col" className="text-end">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
