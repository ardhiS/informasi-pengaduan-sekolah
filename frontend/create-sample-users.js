// Script untuk membuat sample users di database
const createSampleUsers = async () => {
  try {
    console.log('Creating sample users...');

    const sampleUsers = [
      {
        username: 'admin',
        password: 'admin123',
        fullname: 'Administrator',
        role: 'admin',
      },
      {
        username: 'guru001',
        password: 'guru123',
        fullname: 'Budi Santoso',
        role: 'guru',
      },
      {
        username: 'guru002',
        password: 'guru123',
        fullname: 'Siti Nurhaliza',
        role: 'guru',
      },
      {
        username: 'siswa001',
        password: 'siswa123',
        fullname: 'Ahmad Rizki',
        role: 'siswa',
      },
      {
        username: 'siswa002',
        password: 'siswa123',
        fullname: 'Putri Anggraini',
        role: 'siswa',
      },
      {
        username: 'siswa003',
        password: 'siswa123',
        fullname: 'Mohammad Farhan',
        role: 'siswa',
      },
    ];

    for (const user of sampleUsers) {
      try {
        console.log(`Creating user: ${user.username}`);
        const response = await fetch('http://localhost:5000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          console.log(`✅ Created: ${user.username}`);
        } else {
          const errorText = await response.text();
          console.log(`⚠️  ${user.username}: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ Error creating ${user.username}:`, error.message);
      }
    }

    console.log('\n✅ Sample users creation completed!');
    console.log('You can now refresh the Users page to see the data.');
  } catch (error) {
    console.error('❌ Error creating sample users:', error);
  }
};

createSampleUsers();
