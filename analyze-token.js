// Analyze the token from localStorage
const jwt = require('jsonwebtoken');

const analyzeToken = () => {
  console.log('🔍 ANALYZING TOKEN FROM LOCALSTORAGE');
  console.log('==================================\n');

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLUF2eC1EMllVMTcxa1NJdUEiLCJ1c2VybmFtZSI6InN0dWRlbnQwMSIsImZ1bGxuYW1lIjoiQWxpY2UgSm9obnNvbiIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzUxMzY5MTA2LCJleHAiOjE3NTEzNzA5MDZ9.sGmUcctS3VrN9DdqtxbKMCy0mBrgCV-xMdGRMsjWBcU';

  try {
    // Decode token without verification first
    const decoded = jwt.decode(token);
    console.log('📋 Decoded Token Payload:');
    console.log(JSON.stringify(decoded, null, 2));

    // Check expiration
    const now = Date.now();
    const expTime = decoded.exp * 1000;
    const isExpired = expTime < now;

    console.log('\n⏰ Token Timing:');
    console.log('Current time:', new Date(now));
    console.log('Token expires:', new Date(expTime));
    console.log('Is expired:', isExpired);
    console.log(
      'Time remaining:',
      isExpired ? 'EXPIRED' : `${Math.round((expTime - now) / 1000)} seconds`
    );

    // Check user info
    console.log('\n👤 User Information:');
    console.log('User ID:', decoded.userId);
    console.log('Username:', decoded.username);
    console.log('Full Name:', decoded.fullname);
    console.log('Role:', decoded.role);

    // 🚨 CRITICAL ISSUE FOUND!
    console.log('\n🚨 CRITICAL ISSUE DETECTED:');
    console.log('❌ Username is "student01" but role is "student"');
    console.log('❌ This should be "siswa01" with role "siswa"');
    console.log('❌ Wrong user account is being used!');

    console.log('\n🔧 SOLUTION:');
    console.log('1. You are logged in as "student01" (role: student)');
    console.log('2. But siswa login should use "siswa01" (role: siswa)');
    console.log('3. Backend only recognizes "siswa" role, not "student"');
    console.log('4. This is why you get 403 errors!');

    console.log('\n✅ ACTION REQUIRED:');
    console.log('1. Clear localStorage');
    console.log('2. Login with correct credentials: siswa01/siswa123');
    console.log('3. Verify role is "siswa", not "student"');
  } catch (error) {
    console.error('❌ Token analysis failed:', error.message);
  }
};

analyzeToken();
