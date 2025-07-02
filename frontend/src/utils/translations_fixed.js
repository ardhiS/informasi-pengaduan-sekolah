// Translation utility for the application
export const translations = {
  id: {
    // Navigation & Common
    dashboard: 'Dashboard',
    complaints: 'Pengaduan',
    users: 'Pengguna',
    classes: 'Kelas',
    subjects: 'Mata Pelajaran',
    profile: 'Profil',
    logout: 'Keluar',
    login: 'Masuk',
    home: 'Beranda',
    welcome: 'Selamat Datang',

    // Auth & User
    username: 'Nama Pengguna',
    password: 'Kata Sandi',
    fullname: 'Nama Lengkap',
    role: 'Peran',
    loginSuccess: 'Login berhasil',
    loginFailed: 'Login gagal',
    logoutSuccess: 'Logout berhasil',

    // Roles
    admin: 'Administrator',
    guru: 'Guru',
    siswa: 'Siswa',
    teacher: 'Guru',
    student: 'Siswa',

    // Dashboard
    totalUsers: 'Total Pengguna',
    totalClasses: 'Total Kelas',
    totalSubjects: 'Total Mata Pelajaran',
    recentActivities: 'Aktivitas Terbaru',
    statistics: 'Statistik',
    overview: 'Ringkasan',

    // Complaints
    complaintsManagement: 'Manajemen Pengaduan',
    addComplaint: 'Tambah Pengaduan',
    totalComplaints: 'Total Pengaduan',
    createComplaint: 'Buat Pengaduan',
    complaintTitle: 'Judul Pengaduan',
    complaintDescription: 'Deskripsi Pengaduan',
    category: 'Kategori',
    priority: 'Prioritas',
    status: 'Status',
    pending: 'Menunggu',
    inProgress: 'Dalam Proses',
    resolved: 'Selesai',
    closed: 'Ditutup',
    urgent: 'Mendesak',
    reporter: 'Pelapor',
    reporterName: 'Nama Pelapor',
    reporterEmail: 'Email Pelapor',
    reporterPhone: 'Telepon Pelapor',
    searchComplaints: 'Cari pengaduan...',
    allCategories: 'Semua Kategori',
    allStatuses: 'Semua Status',
    allPriorities: 'Semua Prioritas',

    // Dashboard additional
    apiEndpointsTesting: 'Pengujian API Endpoints',
    testAllEndpoints: 'Uji Semua Endpoint',
    runApiTests: 'Jalankan tes API komprehensif',
    createSampleData: 'Buat Data Contoh',
    generateTestData: 'Generate pengguna, kelas, dan mata pelajaran tes',
    viewApiLogs: 'Lihat Log API',
    monitorRequests: 'Monitor permintaan dan respons API',
    apiTestingHistory: 'Riwayat Pengujian API',
    apiHistoryPlaceholder:
      'Riwayat pengujian API akan muncul di sini saat Anda berinteraksi dengan endpoint yang berbeda...',
    refreshData: 'Refresh Data',
    active: 'Aktif',
    online: 'online',

    // Categories
    akademik: 'Akademik',
    fasilitas: 'Fasilitas',
    bullying: 'Bullying',
    lainnya: 'Lainnya',

    // Priorities
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',

    // Actions
    save: 'Simpan',
    cancel: 'Batal',
    edit: 'Edit',
    delete: 'Hapus',
    view: 'Lihat',
    create: 'Buat',
    update: 'Perbarui',
    submit: 'Kirim',
    search: 'Cari',
    filter: 'Filter',

    // Messages
    loading: 'Memuat...',
    noData: 'Tidak ada data',
    error: 'Terjadi kesalahan',
    success: 'Berhasil',
    confirmDelete: 'Yakin ingin menghapus?',
    dataLoaded: 'Data berhasil dimuat',

    // Theme & Language
    darkMode: 'Mode Gelap',
    lightMode: 'Mode Terang',
    language: 'Bahasa',
    indonesian: 'Indonesia',
    english: 'English',

    // School specific
    schoolName: 'SMP PLUS AT-THAHIRIN',
    complaintSystem: 'Sistem Informasi Pengaduan Sekolah',
    managementSystem: 'Sistem Manajemen Sekolah',

    // Profile - flattened
    'profile.title': 'Profil',
    'profile.profileInformation': 'Informasi Profil',
    'profile.editProfile': 'Edit Profil',
    'profile.fullName': 'Nama Lengkap',
    'profile.username': 'Nama Pengguna',
    'profile.email': 'Email',
    'profile.enterFullName': 'Masukkan nama lengkap',
    'profile.enterUsername': 'Masukkan nama pengguna',
    'profile.enterEmail': 'Masukkan alamat email',
    'profile.userName': 'Nama Pengguna',
    'profile.noEmail': 'Email tidak tersedia',
    'profile.memberSince': 'Anggota sejak',
    'profile.apiTestingInformation': 'Informasi Pengujian API',
    'profile.availableEndpoints': 'Endpoint Tersedia',
    'profile.listAllUsers': 'Daftar semua pengguna',
    'profile.getUserDetails': 'Dapatkan detail pengguna',
    'profile.updateUser': 'Perbarui pengguna',
    'profile.currentSession': 'Sesi Saat Ini',
    'profile.tokenStatus': 'Status Token',
    'profile.active': 'Aktif',
    'profile.role': 'Peran',
    'profile.session': 'Sesi',
    'profile.valid': 'Valid',
    'profile.profileUpdatedSuccess': 'Profil berhasil diperbarui!',
    'profile.failedToUpdateProfile': 'Gagal memperbarui profil',

    // Subjects - flattened
    'subjects.title': 'Manajemen Mata Pelajaran',
    'subjects.addSubject': 'Tambah Mata Pelajaran',
    'subjects.searchSubjects': 'Cari mata pelajaran...',
    'subjects.errorLoadingSubjects': 'Error Memuat Mata Pelajaran',
    'subjects.backendServerNote':
      'Pastikan server backend berjalan di http://localhost:5000',
    'subjects.subject': 'Mata Pelajaran',
    'subjects.description': 'Deskripsi',
    'subjects.created': 'Dibuat',
    'subjects.code': 'Kode',
    'subjects.noDescription': 'Tidak ada deskripsi',
    'subjects.updated': 'Diperbarui',

    // Classes - flattened
    'classes.title': 'Manajemen Kelas',
    'classes.addClass': 'Tambah Kelas',
    'classes.searchClasses': 'Cari kelas...',
    'classes.errorLoadingClasses': 'Error Memuat Kelas',
    'classes.backendServerNote':
      'Pastikan server backend berjalan di http://localhost:5000',
    'classes.noSubject': 'Tidak Ada Mata Pelajaran',
    'classes.students': '0 Siswa',
    'classes.created': 'Dibuat',
    'classes.updated': 'Diperbarui',

    // Users - flattened
    'users.title': 'Manajemen Pengguna',
    'users.refreshUsers': 'Perbarui Pengguna',
    'users.totalUsers': 'Total Pengguna',
    'users.teachers': 'Guru',
    'users.students': 'Siswa',
    'users.admins': 'Admin',
    'users.errorLoadingUsers': 'Error Memuat Pengguna',
    'users.backendServerNote':
      'Pastikan server backend berjalan di http://localhost:5000',
    'users.searchUsers': 'Cari pengguna...',
    'users.allRoles': 'Semua Peran',
    'users.user': 'Pengguna',
    'users.role': 'Peran',
    'users.email': 'Email',
    'users.created': 'Dibuat',
    'users.status': 'Status',
    'users.joined': 'Bergabung',
    'users.active': 'Aktif',
    'users.noEmail': 'Tidak ada email',
    'users.noUsersFound': 'Tidak ada pengguna ditemukan',
    'users.adjustSearchCriteria': 'Coba sesuaikan kriteria pencarian Anda.',
    'users.noUsersAvailable': 'Tidak ada pengguna tersedia.',
    'users.tryRefresh': 'Coba Refresh',

    // Roles - flattened
    'roles.admin': 'Administrator',
    'roles.teacher': 'Guru',
    'roles.student': 'Siswa',
    'roles.staff': 'Staff',
    'roles.principal': 'Kepala Sekolah',
    'roles.coordinator': 'Koordinator',
    'roles.guru': 'Guru',
    'roles.siswa': 'Siswa',

    // Common actions - flattened
    'common.actions': 'Aksi',
    'common.filter': 'Filter',
    'common.cancel': 'Batal',
    'common.saveChanges': 'Simpan Perubahan',

    // Auth - flattened
    'auth.login': 'Masuk',
    'auth.logout': 'Keluar',

    // Common UI elements
    new: 'BARU',
    version: 'Versi',
    systemAdministrator: 'Administrator Sistem',
    user: 'Pengguna',
    theme: 'Tema',
  },
  en: {
    // Navigation & Common
    dashboard: 'Dashboard',
    complaints: 'Complaints',
    users: 'Users',
    classes: 'Classes',
    subjects: 'Subjects',
    profile: 'Profile',
    logout: 'Logout',
    login: 'Login',
    home: 'Home',
    welcome: 'Welcome',

    // Auth & User
    username: 'Username',
    password: 'Password',
    fullname: 'Full Name',
    role: 'Role',
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    logoutSuccess: 'Logout successful',

    // Roles
    admin: 'Administrator',
    guru: 'Teacher',
    siswa: 'Student',
    teacher: 'Teacher',
    student: 'Student',

    // Dashboard
    totalUsers: 'Total Users',
    totalClasses: 'Total Classes',
    totalSubjects: 'Total Subjects',
    recentActivities: 'Recent Activities',
    statistics: 'Statistics',
    overview: 'Overview',

    // Complaints
    complaintsManagement: 'Complaints Management',
    addComplaint: 'Add Complaint',
    totalComplaints: 'Total Complaints',
    createComplaint: 'Create Complaint',
    complaintTitle: 'Complaint Title',
    complaintDescription: 'Complaint Description',
    category: 'Category',
    priority: 'Priority',
    status: 'Status',
    pending: 'Pending',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed',
    urgent: 'Urgent',
    reporter: 'Reporter',
    reporterName: 'Reporter Name',
    reporterEmail: 'Reporter Email',
    reporterPhone: 'Reporter Phone',
    searchComplaints: 'Search complaints...',
    allCategories: 'All Categories',
    allStatuses: 'All Statuses',
    allPriorities: 'All Priorities',

    // Dashboard additional
    apiEndpointsTesting: 'API Endpoints Testing',
    testAllEndpoints: 'Test All Endpoints',
    runApiTests: 'Run comprehensive API tests',
    createSampleData: 'Create Sample Data',
    generateTestData: 'Generate test users, classes, and subjects',
    viewApiLogs: 'View API Logs',
    monitorRequests: 'Monitor API requests and responses',
    apiTestingHistory: 'API Testing History',
    apiHistoryPlaceholder:
      'API testing history will appear here as you interact with different endpoints...',
    refreshData: 'Refresh Data',
    active: 'Active',
    online: 'online',

    // Categories
    akademik: 'Academic',
    fasilitas: 'Facilities',
    bullying: 'Bullying',
    lainnya: 'Others',

    // Priorities
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',

    // Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    create: 'Create',
    update: 'Update',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',

    // Messages
    loading: 'Loading...',
    noData: 'No data available',
    error: 'An error occurred',
    success: 'Success',
    confirmDelete: 'Are you sure you want to delete?',
    dataLoaded: 'Data loaded successfully',

    // Theme & Language
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    indonesian: 'Indonesia',
    english: 'English',

    // School specific
    schoolName: 'AT-THAHIRIN JUNIOR HIGH SCHOOL',
    complaintSystem: 'School Complaint Information System',
    managementSystem: 'School Management System',

    // Profile - flattened
    'profile.title': 'Profile',
    'profile.profileInformation': 'Profile Information',
    'profile.editProfile': 'Edit Profile',
    'profile.fullName': 'Full Name',
    'profile.username': 'Username',
    'profile.email': 'Email',
    'profile.enterFullName': 'Enter your full name',
    'profile.enterUsername': 'Enter username',
    'profile.enterEmail': 'Enter email address',
    'profile.userName': 'User Name',
    'profile.noEmail': 'No email provided',
    'profile.memberSince': 'Member since',
    'profile.apiTestingInformation': 'API Testing Information',
    'profile.availableEndpoints': 'Available Endpoints',
    'profile.listAllUsers': 'List all users',
    'profile.getUserDetails': 'Get user details',
    'profile.updateUser': 'Update user',
    'profile.currentSession': 'Current Session',
    'profile.tokenStatus': 'Token Status',
    'profile.active': 'Active',
    'profile.role': 'Role',
    'profile.session': 'Session',
    'profile.valid': 'Valid',
    'profile.profileUpdatedSuccess': 'Profile updated successfully!',
    'profile.failedToUpdateProfile': 'Failed to update profile',

    // Subjects - flattened
    'subjects.title': 'Subjects Management',
    'subjects.addSubject': 'Add Subject',
    'subjects.searchSubjects': 'Search subjects...',
    'subjects.errorLoadingSubjects': 'Error Loading Subjects',
    'subjects.backendServerNote':
      'Make sure backend server is running on http://localhost:5000',
    'subjects.subject': 'Subject',
    'subjects.description': 'Description',
    'subjects.created': 'Created',
    'subjects.code': 'Code',
    'subjects.noDescription': 'No description available',
    'subjects.updated': 'Updated',

    // Classes - flattened
    'classes.title': 'Classes Management',
    'classes.addClass': 'Add Class',
    'classes.searchClasses': 'Search classes...',
    'classes.errorLoadingClasses': 'Error Loading Classes',
    'classes.backendServerNote':
      'Make sure backend server is running on http://localhost:5000',
    'classes.noSubject': 'No Subject',
    'classes.students': '0 Students',
    'classes.created': 'Created',
    'classes.updated': 'Updated',

    // Users - flattened
    'users.title': 'Users Management',
    'users.refreshUsers': 'Refresh Users',
    'users.totalUsers': 'Total Users',
    'users.teachers': 'Teachers',
    'users.students': 'Students',
    'users.admins': 'Admins',
    'users.errorLoadingUsers': 'Error Loading Users',
    'users.backendServerNote':
      'Make sure backend server is running on http://localhost:5000',
    'users.searchUsers': 'Search users...',
    'users.allRoles': 'All Roles',
    'users.user': 'User',
    'users.role': 'Role',
    'users.email': 'Email',
    'users.created': 'Created',
    'users.status': 'Status',
    'users.joined': 'Joined',
    'users.active': 'Active',
    'users.noEmail': 'No email',
    'users.noUsersFound': 'No users found',
    'users.adjustSearchCriteria': 'Try adjusting your search criteria.',
    'users.noUsersAvailable': 'No users available.',
    'users.tryRefresh': 'Try Refresh',

    // Roles - flattened
    'roles.admin': 'Administrator',
    'roles.teacher': 'Teacher',
    'roles.student': 'Student',
    'roles.staff': 'Staff',
    'roles.principal': 'Principal',
    'roles.coordinator': 'Coordinator',
    'roles.guru': 'Teacher',
    'roles.siswa': 'Student',

    // Common actions - flattened
    'common.actions': 'Actions',
    'common.filter': 'Filter',
    'common.cancel': 'Cancel',
    'common.saveChanges': 'Save Changes',

    // Auth - flattened
    'auth.login': 'Login',
    'auth.logout': 'Logout',

    // Common UI elements
    new: 'NEW',
    version: 'Version',
    systemAdministrator: 'System Administrator',
    user: 'User',
    theme: 'Theme',
  },
};

export const useTranslation = (language) => {
  const t = (key, defaultValue = key) => {
    return translations[language]?.[key] || defaultValue;
  };

  return { t };
};
