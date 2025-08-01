import { Link } from "react-router-dom";

export default function FeaturesPage() {
  return (
    <div className="container py-4">
      <div className="p-4 mb-4 bg-white rounded-3 shadow-sm">
        <h1 className="display-6 fw-bold">Menu Fitur 🚀</h1>
        <p className="col-md-8 fs-5 text-muted">
          Kelola data guru dan siswa serta lakukan aksi cepat untuk menambah
          data baru melalui menu di bawah ini.
        </p>
      </div>

      <h2 className="pb-2 border-bottom mb-4">Manajemen Data</h2>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        <div className="col">
          <Link to="/admin/teachers/list" className="text-decoration-none">
            <div className="card h-100 text-dark text-center feature-card shadow-sm">
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="mb-3">
                  <i className="bi bi-person-lines-fill fs-1 text-primary"></i>
                </div>
                <h5 className="card-title">List Guru</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col">
          <Link to="/admin/students/list" className="text-decoration-none">
            <div className="card h-100 text-dark text-center feature-card shadow-sm">
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="mb-3">
                  <i className="bi bi-people-fill fs-1 text-info"></i>
                </div>
                <h5 className="card-title">List Siswa</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <h2 className="pb-2 border-bottom my-4">Aksi Cepat</h2>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
        <div className="col">
          <Link to="/admin/add/teacher" className="text-decoration-none">
            <div className="card h-100 text-dark text-center feature-card shadow-sm">
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="mb-3">
                  <i className="bi bi-person-plus-fill fs-1 text-success"></i>
                </div>
                <h5 className="card-title">Tambah Guru</h5>
              </div>
            </div>
          </Link>
        </div>
        <div className="col">
          <Link to="/admin/add/student" className="text-decoration-none">
            <div className="card h-100 text-dark text-center feature-card shadow-sm">
              <div className="card-body d-flex flex-column justify-content-center">
                <div className="mb-3">
                  <i className="bi bi-person-plus-fill fs-1 text-success"></i>
                </div>
                <h5 className="card-title">Tambah Siswa</h5>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
