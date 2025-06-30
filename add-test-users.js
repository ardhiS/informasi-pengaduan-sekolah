require('dotenv').config();
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const pool = new Pool();

async function addTestUsers() {
  try {
    console.log('Adding test users with different roles...');

    const users = [
      {
        username: 'admin01',
        password: 'admin123',
        fullname: 'System Administrator',
        role: 'admin',
      },
      {
        username: 'teacher02',
        password: 'teacher123',
        fullname: 'Jane Smith',
        role: 'teacher',
      },
      {
        username: 'student01',
        password: 'student123',
        fullname: 'Alice Johnson',
        role: 'student',
      },
      {
        username: 'staff01',
        password: 'staff123',
        fullname: 'Bob Wilson',
        role: 'staff',
      },
      {
        username: 'principal01',
        password: 'principal123',
        fullname: 'Dr. Sarah Davis',
        role: 'principal',
      },
    ];

    for (const userData of users) {
      const id = `user-${nanoid(16)}`;
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      try {
        await pool.query(
          'INSERT INTO users (id, username, password, fullname, role) VALUES ($1, $2, $3, $4, $5)',
          [
            id,
            userData.username,
            hashedPassword,
            userData.fullname,
            userData.role,
          ]
        );
        console.log(
          `✅ Added ${userData.role}: ${userData.username} (${userData.fullname})`
        );
      } catch (error) {
        if (error.constraint === 'users_username_key') {
          console.log(
            `⚠️  User ${userData.username} already exists, skipping...`
          );
        } else {
          console.error(`❌ Error adding ${userData.username}:`, error.message);
        }
      }
    }

    console.log('\n✅ Test users creation completed!');
    console.log('\nYou can now login with:');
    console.log('- admin01 / admin123 (System Administrator)');
    console.log('- teacher02 / teacher123 (Jane Smith - Teacher)');
    console.log('- student01 / student123 (Alice Johnson - Student)');
    console.log('- staff01 / staff123 (Bob Wilson - Staff)');
    console.log('- principal01 / principal123 (Dr. Sarah Davis - Principal)');
  } catch (error) {
    console.error('❌ Error adding test users:', error);
  } finally {
    await pool.end();
  }
}

addTestUsers();
