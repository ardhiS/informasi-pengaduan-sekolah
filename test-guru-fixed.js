const axios = require('axios');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:5000/api';

async function testGuruComplaintNoImage() {
  console.log('🧪 Testing guru complaint creation without image...\n');

  try {
    // 1. Login as guru01 with correct password
    console.log('🔑 1. Logging in as guru01...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'guru01',
      password: 'guru123',
    });

    if (loginResponse.data.status !== 'success') {
      throw new Error('Login failed');
    }

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login successful');

    // 2. Create complaint without image using multipart/form-data
    console.log('📝 2. Creating complaint without image...');

    const formData = new FormData();
    formData.append('title', 'Test Complaint Guru - No Image');
    formData.append(
      'description',
      'This is a test complaint created by guru without any image attachment.'
    );
    formData.append('category', 'fasilitas');
    formData.append('priority', 'medium');
    formData.append('reporter_name', 'Guru Test');
    formData.append('reporter_type', 'guru');

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

    console.log('📊 Response status:', complaintResponse.status);
    console.log(
      '📊 Response data:',
      JSON.stringify(complaintResponse.data, null, 2)
    );

    if (complaintResponse.data.status === 'success') {
      console.log('✅ Complaint created successfully without image!');
      console.log('🆔 Complaint ID:', complaintResponse.data.data.complaintId);
      return true;
    } else {
      console.log('❌ Failed to create complaint');
      return false;
    }
  } catch (error) {
    console.log('❌ Error occurred:');

    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));

      // If it's the known image constraint error, report it
      if (
        error.response.data.message &&
        error.response.data.message.includes('filename')
      ) {
        console.log(
          '🔍 This appears to be the image constraint error that was fixed'
        );
      }
    } else {
      console.log('Error:', error.message);
    }

    return false;
  }
}

// Run the test
testGuruComplaintNoImage()
  .then((success) => {
    console.log(
      '\n============================================================'
    );
    console.log(
      '📊 TEST RESULT:',
      success ? '✅ PASS - Backend fixed!' : '❌ FAIL - Still needs work'
    );
    console.log('============================================================');
  })
  .catch(console.error);
