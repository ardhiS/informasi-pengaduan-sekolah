// School Complaints System v2.0 - Unified Development Starter
const { exec, spawn } = require('child_process');
const path = require('path');

const startDevelopment = () => {
  console.log('🚀 Starting School Complaints System v2.0...\n');

  // Start backend
  console.log('📡 Starting backend server...');
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true,
  });

  // Wait 3 seconds then start frontend
  setTimeout(() => {
    console.log('🌐 Starting frontend server...');
    const frontend = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'frontend'),
      stdio: 'inherit',
      shell: true,
    });

    console.log('\n✅ Development servers started!');
    console.log('📡 Backend: http://localhost:5000');
    console.log('🌐 Frontend: http://localhost:5173');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });
  }, 3000);
};

// Check if user wants to run migrations first
const args = process.argv.slice(2);
if (args.includes('--with-migrate')) {
  console.log('📁 Running database migrations...');
  exec(
    'npm run migrate:up',
    { cwd: path.join(__dirname, 'backend') },
    (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Migration failed:', error);
        return;
      }
      console.log('✅ Migrations completed!');
      startDevelopment();
    }
  );
} else {
  startDevelopment();
}
