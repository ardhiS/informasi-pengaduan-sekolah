const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000';

async function testGuruComplaint() {
  try {
    console.log('🧪 Testing Guru Create Complaint (No Images)...\n');

    // 1. Login sebagai guru
    console.log('1. Login sebagai guru...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'guru1',
      password: 'password123',
    });

    console.log('✅ Login berhasil');
    const token = loginResponse.data.data.accessToken;

    // 2. Buat complaint tanpa gambar menggunakan multipart/form-data
    console.log('\n2. Membuat complaint tanpa gambar...');

    const formData = new FormData();
    formData.append('title', 'Test Complaint dari Guru - No Images');
    formData.append(
      'description',
      'Ini adalah pengaduan test dari guru tanpa gambar untuk menguji fix backend'
    );
    formData.append('category', 'fasilitas');
    formData.append('reporter_name', 'Guru Test');
    formData.append('reporter_email', 'guru@test.com');
    formData.append('reporter_phone', '08123456789');
    formData.append('reporter_type', 'guru');
    formData.append('reporter_class', '');
    formData.append('priority', 'medium');
    // Tidak menambahkan field images

    const complaintResponse = await axios.post(
      `${BASE_URL}/complaints`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('✅ Complaint berhasil dibuat:', complaintResponse.data);

    // 3. Verifikasi complaint dibuat di database
    console.log('\n3. Mengecek complaint yang dibuat...');
    const complaintsResponse = await axios.get(`${BASE_URL}/complaints`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const latestComplaint = complaintsResponse.data.data.complaints[0];
    console.log('✅ Complaint ditemukan:', {
      id: latestComplaint.id,
      title: latestComplaint.title,
      reporter_type: latestComplaint.reporter_type,
      status: latestComplaint.status,
      approval_status: latestComplaint.approval_status,
      images_count: latestComplaint.images ? latestComplaint.images.length : 0,
    });

    console.log(
      '\n🎉 Test berhasil! Guru dapat membuat complaint tanpa gambar.'
    );
  } catch (error) {
    console.error('❌ Test gagal:', error.response?.data || error.message);
    if (error.response?.status === 500) {
      console.error(
        '💥 Internal server error - kemungkinan masalah di backend'
      );
    }
  }
}

// Jalankan test
testGuruComplaint();
