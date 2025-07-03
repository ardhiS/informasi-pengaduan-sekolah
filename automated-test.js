const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

// Helper function to create multipart form data
function createMultipartData(fields, boundary) {
  let data = '';

  for (const [key, value] of Object.entries(fields)) {
    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
    data += `${value}\r\n`;
  }

  data += `--${boundary}--\r\n`;
  return data;
}

// Base configuration
const API_BASE = 'http://localhost:5000/api';
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

// Simple HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlParts = new URL(url);
    const isHttps = urlParts.protocol === 'https:';
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlParts.hostname,
      port: urlParts.port || (isHttps ? 443 : 80),
      path: urlParts.pathname + urlParts.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ data: jsonData, status: res.statusCode });
        } catch (e) {
          resolve({ data, status: res.statusCode });
        }
      });
    });

    req.on('error', reject);

    if (options.data) {
      req.write(options.data);
    }

    req.end();
  });
}

// Create multipart form data
function createMultipartData(fields, boundary) {
  let data = '';

  for (const [key, value] of Object.entries(fields)) {
    data += `--${boundary}\r\n`;
    data += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
    data += `${value}\r\n`;
  }

  data += `--${boundary}--\r\n`;
  return data;
}

class AutomatedTester {
  constructor() {
    this.tokens = {};
    this.testResults = [];
    this.complaints = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    let color = colors.reset;
    let prefix = 'ℹ️';

    switch (type) {
      case 'success':
        color = colors.green;
        prefix = '✅';
        break;
      case 'error':
        color = colors.red;
        prefix = '❌';
        break;
      case 'warning':
        color = colors.yellow;
        prefix = '⚠️';
        break;
      case 'info':
        color = colors.blue;
        prefix = 'ℹ️';
        break;
      case 'debug':
        color = colors.yellow;
        prefix = '🔍';
        break;
    }

    console.log(`${color}${prefix} [${timestamp}] ${message}${colors.reset}`);
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Test 1: Create test users
  async createTestUsers() {
    this.log('🔧 Creating test users...', 'info');

    const users = [
      {
        username: 'admin01',
        password: 'admin123',
        fullname: 'Administrator Test',
        role: 'admin',
      },
      {
        username: 'guru01',
        password: 'guru123',
        fullname: 'Guru Test',
        role: 'guru',
      },
      {
        username: 'siswa01',
        password: 'siswa123',
        fullname: 'Siswa Test',
        role: 'siswa',
      },
    ];

    for (const user of users) {
      try {
        const response = await makeRequest(`${API_BASE}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify(user),
        });

        if (response.status >= 200 && response.status < 300) {
          this.log(`Created user: ${user.username} (${user.role})`, 'success');
          this.testResults.push({
            test: `Create ${user.role} user`,
            status: 'PASS',
          });
        } else {
          throw new Error(
            `HTTP ${response.status}: ${
              response.data.message || 'Unknown error'
            }`
          );
        }
      } catch (error) {
        if (
          error.message?.includes('already exists') ||
          error.message?.includes('duplicate') ||
          error.message?.includes('sudah digunakan')
        ) {
          this.log(`User ${user.username} already exists, skipping`, 'warning');
          this.testResults.push({
            test: `Create ${user.role} user`,
            status: 'SKIP',
          });
        } else {
          this.log(
            `Failed to create ${user.username}: ${error.message}`,
            'error'
          );
          this.testResults.push({
            test: `Create ${user.role} user`,
            status: 'FAIL',
          });
        }
      }
      await this.sleep(500);
    }
  }

  // Test 2: Login all users and store tokens
  async loginAllUsers() {
    this.log('🔑 Testing login for all users...', 'info');

    const credentials = [
      { username: 'admin01', password: 'admin123', role: 'admin' },
      { username: 'guru01', password: 'guru123', role: 'guru' },
      { username: 'siswa01', password: 'siswa123', role: 'siswa' },
    ];

    for (const cred of credentials) {
      try {
        const response = await makeRequest(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({
            username: cred.username,
            password: cred.password,
          }),
        });

        if (response.status >= 200 && response.status < 300) {
          this.tokens[cred.role] = response.data.data.accessToken;
          this.log(
            `Login successful for ${cred.username} (${cred.role})`,
            'success'
          );
          this.log(
            `Token stored for ${cred.role}: ${this.tokens[cred.role].substring(
              0,
              20
            )}...`,
            'debug'
          );
          this.testResults.push({ test: `Login ${cred.role}`, status: 'PASS' });
        } else {
          throw new Error(
            `HTTP ${response.status}: ${
              response.data.message || 'Login failed'
            }`
          );
        }
      } catch (error) {
        this.log(
          `Login failed for ${cred.username}: ${error.message}`,
          'error'
        );
        this.testResults.push({ test: `Login ${cred.role}`, status: 'FAIL' });
      }
      await this.sleep(500);
    }
  }

  // Test 3: Create simple complaint (without image for now)
  async testCreateComplaint() {
    this.log('📝 Testing create complaint...', 'info');

    if (!this.tokens.siswa) {
      this.log(
        'No siswa token available, skipping complaint creation',
        'error'
      );
      return;
    }

    try {
      const boundary = `----formdata-${Math.random().toString(36)}`;
      const complaintData = {
        title: 'Test Pengaduan Automated',
        description:
          'Ini adalah pengaduan test yang dibuat secara otomatis untuk menguji API.',
        category: 'fasilitas',
        priority: 'medium',
        reporter_name: 'Siswa Test',
        reporter_type: 'siswa',
        reporter_class: '8A',
      };

      const formData = createMultipartData(complaintData, boundary);

      const response = await makeRequest(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          Authorization: `Bearer ${this.tokens.siswa}`,
        },
        data: formData,
      });

      if (response.status >= 200 && response.status < 300) {
        this.complaints.push(response.data.data.complaintId);
        this.log('Complaint created successfully', 'success');
        this.testResults.push({
          test: 'Create complaint',
          status: 'PASS',
        });
      } else {
        throw new Error(
          `HTTP ${response.status}: ${response.data.message || 'Create failed'}`
        );
      }
    } catch (error) {
      this.log(`Failed to create complaint: ${error.message}`, 'error');
      this.testResults.push({
        test: 'Create complaint',
        status: 'FAIL',
      });
    }
  }

  // Test 4: Test role-based complaint visibility
  async testRoleBasedVisibility() {
    this.log('👁️ Testing role-based complaint visibility...', 'info');

    for (const role of ['admin', 'guru', 'siswa']) {
      if (!this.tokens[role]) continue;

      try {
        this.log(
          `Testing complaints endpoint for ${role} with token: ${this.tokens[
            role
          ].substring(0, 20)}...`,
          'debug'
        );

        const response = await makeRequest(`${API_BASE}/complaints`, {
          headers: { Authorization: `Bearer ${this.tokens[role]}` },
        });

        this.log(`Response for ${role}: Status ${response.status}`, 'debug');

        if (response.status >= 200 && response.status < 300) {
          const complaints = response.data.data.complaints;
          this.log(`${role} can see ${complaints.length} complaints`, 'info');

          // Check if reporter info is hidden for non-admin
          if (role !== 'admin' && complaints.length > 0) {
            const hasHiddenReporter = complaints.some(
              (c) =>
                !c.reporter_name ||
                c.reporter_name === 'Informasi disembunyikan'
            );
            if (hasHiddenReporter) {
              this.log(`Reporter info correctly hidden for ${role}`, 'success');
              this.testResults.push({
                test: `Hidden reporter info for ${role}`,
                status: 'PASS',
              });
            } else {
              this.log(`Reporter info NOT hidden for ${role}`, 'warning');
              this.testResults.push({
                test: `Hidden reporter info for ${role}`,
                status: 'FAIL',
              });
            }
          } else if (role === 'admin') {
            this.log(`Admin can see full complaint details`, 'success');
            this.testResults.push({
              test: `Full access for admin`,
              status: 'PASS',
            });
          }
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        this.log(
          `Failed to get complaints for ${role}: ${error.message}`,
          'error'
        );
        this.testResults.push({
          test: `Get complaints for ${role}`,
          status: 'FAIL',
        });
      }
    }
  }

  // Test 5: Test admin approval workflow
  async testAdminApprovalWorkflow() {
    this.log('⚖️ Testing admin approval workflow...', 'info');

    if (!this.tokens.admin || this.complaints.length === 0) {
      this.log(
        'No admin token or complaints available for approval testing',
        'warning'
      );
      return;
    }

    const complaintId = this.complaints[0];

    try {
      // Test approve
      const approveResponse = await makeRequest(
        `${API_BASE}/complaints/${complaintId}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.tokens.admin}`,
          },
          data: JSON.stringify({}),
        }
      );

      if (approveResponse.status >= 200 && approveResponse.status < 300) {
        this.log('Complaint approved successfully', 'success');
        this.testResults.push({
          test: 'Admin approve complaint',
          status: 'PASS',
        });
      } else {
        throw new Error(`HTTP ${approveResponse.status}`);
      }
    } catch (error) {
      this.log(`Failed to approve complaint: ${error.message}`, 'error');
      this.testResults.push({
        test: 'Admin approve complaint',
        status: 'FAIL',
      });
    }

    // Create another complaint for rejection test
    await this.createSimpleComplaint();
    if (this.complaints.length > 1) {
      try {
        const rejectResponse = await makeRequest(
          `${API_BASE}/complaints/${this.complaints[1]}/reject`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.tokens.admin}`,
            },
            data: JSON.stringify({ reason: 'Test rejection reason' }),
          }
        );

        if (rejectResponse.status >= 200 && rejectResponse.status < 300) {
          this.log('Complaint rejected successfully', 'success');
          this.testResults.push({
            test: 'Admin reject complaint',
            status: 'PASS',
          });
        } else {
          throw new Error(`HTTP ${rejectResponse.status}`);
        }
      } catch (error) {
        this.log(`Failed to reject complaint: ${error.message}`, 'error');
        this.testResults.push({
          test: 'Admin reject complaint',
          status: 'FAIL',
        });
      }
    }
  }

  // Test 6: Test guru status updates
  async testGuruStatusUpdates() {
    this.log('👨‍🏫 Testing guru status updates...', 'info');

    if (!this.tokens.guru || this.complaints.length === 0) {
      this.log(
        'No guru token or complaints available for status testing',
        'warning'
      );
      return;
    }

    const complaintId = this.complaints[0];

    try {
      const response = await makeRequest(
        `${API_BASE}/complaints/${complaintId}/progress`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.tokens.guru}`,
          },
          data: JSON.stringify({
            status: 'in_progress',
            notes: 'Sedang ditindaklanjuti oleh guru',
          }),
        }
      );

      if (response.status >= 200 && response.status < 300) {
        this.log('Complaint status updated by guru', 'success');
        this.testResults.push({ test: 'Guru update status', status: 'PASS' });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      this.log(`Failed to update status: ${error.message}`, 'error');
      this.testResults.push({ test: 'Guru update status', status: 'FAIL' });
    }
  }

  // Test 7: Test "My Complaints" endpoint
  async testMyComplaints() {
    this.log('📋 Testing My Complaints endpoint...', 'info');

    for (const role of ['guru', 'siswa']) {
      if (!this.tokens[role]) continue;

      try {
        const response = await makeRequest(`${API_BASE}/complaints/my`, {
          headers: { Authorization: `Bearer ${this.tokens[role]}` },
        });

        if (response.status >= 200 && response.status < 300) {
          this.log(`${role} can access their own complaints`, 'success');
          this.testResults.push({
            test: `My complaints for ${role}`,
            status: 'PASS',
          });
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        this.log(
          `Failed to get my complaints for ${role}: ${error.message}`,
          'error'
        );
        this.testResults.push({
          test: `My complaints for ${role}`,
          status: 'FAIL',
        });
      }
    }
  }

  // Helper method to create simple complaint
  async createSimpleComplaint() {
    if (!this.tokens.siswa) return;

    try {
      const boundary = `----formdata-${Math.random().toString(36)}`;
      const complaintData = {
        title: 'Simple Test Complaint',
        description: 'Test complaint for rejection',
        category: 'lainnya',
        priority: 'low',
        reporter_name: 'Test User',
        reporter_type: 'siswa',
      };

      const formData = createMultipartData(complaintData, boundary);

      const response = await makeRequest(`${API_BASE}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          Authorization: `Bearer ${this.tokens.siswa}`,
        },
        data: formData,
      });

      if (response.status >= 200 && response.status < 300) {
        this.complaints.push(response.data.data.complaintId);
      }
    } catch (error) {
      this.log(
        `Failed to create simple complaint: ${error.message}`,
        'warning'
      );
    }
  }

  // Generate test report
  generateReport() {
    this.log('📊 Generating test report...', 'info');

    const passed = this.testResults.filter((r) => r.status === 'PASS').length;
    const failed = this.testResults.filter((r) => r.status === 'FAIL').length;
    const skipped = this.testResults.filter((r) => r.status === 'SKIP').length;
    const total = this.testResults.length;

    console.log('\n' + '='.repeat(60));
    console.log('🧪 AUTOMATED TEST REPORT');
    console.log('='.repeat(60));
    console.log(`📊 Total Tests: ${total}`);
    console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
    console.log(`${colors.yellow}⏭️ Skipped: ${skipped}${colors.reset}`);
    console.log('='.repeat(60));

    console.log('\n📋 Detailed Results:');
    this.testResults.forEach((result, index) => {
      let statusColor = colors.reset;
      let statusIcon = '❓';

      switch (result.status) {
        case 'PASS':
          statusColor = colors.green;
          statusIcon = '✅';
          break;
        case 'FAIL':
          statusColor = colors.red;
          statusIcon = '❌';
          break;
        case 'SKIP':
          statusColor = colors.yellow;
          statusIcon = '⏭️';
          break;
      }

      console.log(
        `${statusColor}${statusIcon} ${index + 1}. ${result.test}${
          colors.reset
        }`
      );
    });

    const successRate = ((passed / total) * 100).toFixed(1);
    console.log(`\n🎯 Success Rate: ${successRate}%`);

    if (failed === 0) {
      console.log(
        `${colors.green}🎉 ALL TESTS PASSED! System is working correctly.${colors.reset}`
      );
    } else {
      console.log(
        `${colors.red}⚠️ Some tests failed. Please check the implementation.${colors.reset}`
      );
    }

    console.log('='.repeat(60));
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Automated Testing...\n');

    try {
      await this.createTestUsers();
      await this.sleep(1000);

      await this.loginAllUsers();
      await this.sleep(1000);

      await this.testCreateComplaint();
      await this.sleep(1000);

      await this.testRoleBasedVisibility();
      await this.sleep(1000);

      await this.testMyComplaints();
      await this.sleep(1000);

      await this.testAdminApprovalWorkflow();
      await this.sleep(1000);

      await this.testGuruStatusUpdates();
      await this.sleep(1000);

      this.generateReport();
    } catch (error) {
      this.log(`Unexpected error during testing: ${error.message}`, 'error');
    }
  }
}

// Create and run tester
const tester = new AutomatedTester();
tester.runAllTests().catch(console.error);
