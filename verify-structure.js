#!/usr/bin/env node

// Verification script for School Complaints System v2.0
const fs = require('fs');
const path = require('path');

const checkFile = (filePath, description) => {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
};

const checkDirectory = (dirPath, description) => {
  const exists = fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  console.log(`${exists ? '✅' : '❌'} ${description}: ${dirPath}`);
  return exists;
};

console.log('🔍 School Complaints System v2.0 - Structure Verification\n');

let allGood = true;

// Check backend structure
console.log('📡 Backend Structure:');
allGood &= checkDirectory('./backend', 'Backend directory');
allGood &= checkDirectory('./backend/src', 'Backend source');
allGood &= checkDirectory('./backend/src/api', 'API directory');
allGood &= checkDirectory('./backend/src/api/auth', 'Auth module');
allGood &= checkDirectory('./backend/src/api/users', 'Users module');
allGood &= checkDirectory('./backend/src/api/complaints', 'Complaints module');
allGood &= checkDirectory('./backend/src/api/data', 'Data module');
allGood &= checkDirectory('./backend/src/services', 'Services directory');
allGood &= checkFile('./backend/src/server.js', 'Backend server');
allGood &= checkFile('./backend/package.json', 'Backend package.json');
allGood &= checkDirectory('./backend/migrations', 'Backend migrations');

console.log('\n🌐 Frontend Structure:');
allGood &= checkDirectory('./frontend', 'Frontend directory');
allGood &= checkDirectory('./frontend/src', 'Frontend source');
allGood &= checkDirectory('./frontend/src/components', 'Components directory');
allGood &= checkDirectory('./frontend/src/pages', 'Pages directory');
allGood &= checkDirectory('./frontend/src/services', 'Frontend services');
allGood &= checkFile('./frontend/src/components/index.js', 'Component exports');
allGood &= checkFile('./frontend/package.json', 'Frontend package.json');

console.log('\n🔧 Configuration Files:');
allGood &= checkFile('./start.js', 'Unified start script');
allGood &= checkFile('./package.json', 'Root package.json');
allGood &= checkFile('./.env.example', 'Environment template');
allGood &= checkFile('./README.md', 'Main documentation');
allGood &= checkFile('./docs/SETUP.md', 'Setup guide');
allGood &= checkDirectory('./docs', 'Documentation directory');

console.log('\n📚 Key API Files:');
allGood &= checkFile('./backend/src/api/auth/handler.js', 'Auth handler');
allGood &= checkFile('./backend/src/api/users/handler.js', 'Users handler');
allGood &= checkFile(
  './backend/src/api/complaints/handler.js',
  'Complaints handler'
);
allGood &= checkFile('./backend/src/services/AuthService.js', 'Auth service');
allGood &= checkFile('./backend/src/services/UsersService.js', 'Users service');

console.log('\n🎯 Frontend Core Files:');
allGood &= checkFile('./frontend/src/services/apiService.js', 'API service');
allGood &= checkFile('./frontend/src/App.jsx', 'Main App component');

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log(
    '🎉 VERIFICATION PASSED: All core files and directories are in place!'
  );
  console.log(
    '✅ School Complaints System v2.0 structure is complete and ready.'
  );
  console.log('\n🚀 To start development:');
  console.log('   npm run install:all    # Install all dependencies');
  console.log('   npm run start:full     # Start both servers');
} else {
  console.log(
    '❌ VERIFICATION FAILED: Some required files or directories are missing.'
  );
  console.log(
    '🔧 Please check the missing items above and ensure the restructuring is complete.'
  );
}

console.log('\n📖 For detailed setup instructions, see docs/SETUP.md');
console.log('📋 For complete documentation, see docs/README.md');
