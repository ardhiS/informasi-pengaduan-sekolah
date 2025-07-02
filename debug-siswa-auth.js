// Clear all auth data and force fresh login for siswa
console.log('🧹 FORCE CLEAR AUTH DATA FOR SISWA DEBUG');
console.log('==========================================\n');

console.log('⚠️  IMPORTANT: Copy and paste this into browser console:');
console.log('-----------------------------------------------------');

console.log('');
console.log('// Clear all authentication data');
console.log('localStorage.clear();');
console.log('sessionStorage.clear();');
console.log('');
console.log('// Clear any cached auth headers');
console.log('delete window.axios?.defaults?.headers?.common?.Authorization;');
console.log('');
console.log('// Force reload page');
console.log('window.location.reload(true);');
console.log('');

console.log('📋 Manual Test Steps After Clearing:');
console.log('1. Clear all browser data (see commands above)');
console.log('2. Navigate to: http://localhost:3000/login/siswa');
console.log('3. Open DevTools Network tab');
console.log('4. Login with: siswa01 / siswa123');
console.log('5. Watch for token in localStorage');
console.log('6. Navigate to /complaints');
console.log('7. Check Network tab for 403 errors\n');

console.log('🔍 Debug Checklist:');
console.log('- ✅ Backend running on port 5000');
console.log('- ✅ Frontend running on port 3000');
console.log('- ✅ User siswa01 exists in database');
console.log('- ⚠️  Need to verify: Token format and expiration');
console.log('- ⚠️  Need to verify: Frontend token handling\n');

console.log('🐛 Expected Debug Output in Browser Console:');
console.log('After login, you should see:');
console.log('- ✅ Token decoded successfully');
console.log('- ✅ User info set');
console.log('- ✅ API Request with valid token');
console.log('- ❌ NO 403 errors\n');

console.log('🔧 If 403 Still Occurs:');
console.log('1. Check token structure in browser console');
console.log('2. Verify token exp time is in future');
console.log('3. Check if backend middleware accepts the token');
console.log('4. Compare working guru token vs siswa token\n');

console.log('Ready to debug! Browser should be on localhost:3000');
