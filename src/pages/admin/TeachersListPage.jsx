import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as api from "../../utils/api"; // Pastikan path ini sesuai

export default function TeachersList() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Mengambil data guru saat komponen dimuat
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        // Memanggil API untuk mendapatkan pengguna dengan peran 'teacher'
        const response = await api.getUsers({ role: "guru" });
        if (response.status === "success") {
          setTeachers(response.data.users || []);
          setFilteredTeachers(response.data.users || []);
        } else {
          throw new Error("Gagal mengambil data dari server.");
        }
      } catch (err) {
        setError("Gagal memuat data guru. Silakan coba lagi nanti.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // 2. Efek untuk memfilter guru berdasarkan input pencarian
  useEffect(() => {
    const results = teachers.filter(
      (teacher) =>
        teacher.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.username && teacher.username.includes(searchTerm)) // Asumsi username adalah NIP
    );
    setFilteredTeachers(results);
  }, [searchTerm, teachers]);

  // 3. Fungsi untuk menangani penghapusan data guru
  const handleDelete = async (teacherId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
      try {
        const response = await api.deleteUser(teacherId);
        if (response.status === "success") {
          setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
          alert("Data guru berhasil dihapus.");
        } else {
          throw new Error(response.message || "Gagal menghapus data guru.");
        }
      } catch (err) {
        alert(err.message || "Gagal menghapus data guru.");
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

    if (filteredTeachers.length === 0) {
      return (
        <tr>
          {/* Mengubah colSpan menjadi 4 */}
          <td colSpan="4" className="text-center p-4">
            {searchTerm ? "Guru tidak ditemukan." : "Belum ada data guru."}
          </td>
        </tr>
      );
    }

    return filteredTeachers.map((teacher, index) => (
      <tr key={teacher.id}>
        <th scope="row">{index + 1}</th>
        <td>{teacher.fullname}</td>
        <td>{teacher.username}</td>
        {/* Kolom Mata Pelajaran dihapus dari sini */}
        <td className="text-end">
          {/* <Link
            to={`/admin/edit/teacher/${teacher.id}`}
            className="btn btn-sm btn-outline-primary me-2"
            title="Edit"
          >
            <i className="bi bi-pencil-square"></i>
          </Link> */}
          <button
            onClick={() => handleDelete(teacher.id)}
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
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Daftar Guru</h2>
        <Link to={"/admin/add/teacher"} className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>Tambah Guru
        </Link>
      </div>

      <div className="input-group mb-4 shadow-sm">
        <span className="input-group-text bg-white">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Cari nama atau NIP guru..."
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
                <th scope="col">Nama Guru</th>
                <th scope="col">NIP</th>
                {/* Kolom header Mata Pelajaran dihapus */}
                <th scope="col" className="text-end">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
