require('dotenv').config();
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const pool = new Pool();

async function addSimpleTestData() {
  try {
    console.log('Adding a test teacher user...');

    // Add a teacher user first
    const teacherId = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash('teacher123', 10);

    await pool.query(
      'INSERT INTO users (id, username, password, fullname) VALUES ($1, $2, $3, $4)',
      [teacherId, 'teacher01', hashedPassword, 'John Teacher']
    );
    console.log('Added teacher user: teacher01');

    console.log('Adding test classes...');

    // Get one subject ID
    const subjectsResult = await pool.query('SELECT id FROM subjects LIMIT 1');
    if (subjectsResult.rows.length === 0) {
      console.log('No subjects found. Please run add-test-data.js first.');
      return;
    }
    const subjectId = subjectsResult.rows[0].id;

    // Add some simple classes
    const classes = [
      {
        name: 'Math Grade 10A',
        description: 'Advanced mathematics for grade 10 students',
      },
      {
        name: 'Math Grade 10B',
        description: 'Mathematics for grade 10 students',
      },
      {
        name: 'Math Grade 11A',
        description: 'Advanced mathematics for grade 11 students',
      },
    ];

    for (const cls of classes) {
      const id = `class-${nanoid(16)}`;
      await pool.query(
        'INSERT INTO classes (id, name, description, subject_id, teacher_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [id, cls.name, cls.description, subjectId, teacherId]
      );
      console.log(`Added class: ${cls.name}`);
    }

    console.log('Simple test data added successfully!');

    // Verify data
    const subjectsCount = await pool.query(
      'SELECT COUNT(*) as count FROM subjects'
    );
    const classesCount = await pool.query(
      'SELECT COUNT(*) as count FROM classes'
    );
    const usersCount = await pool.query('SELECT COUNT(*) as count FROM users');

    console.log(`Total subjects: ${subjectsCount.rows[0].count}`);
    console.log(`Total classes: ${classesCount.rows[0].count}`);
    console.log(`Total users: ${usersCount.rows[0].count}`);
  } catch (error) {
    console.error('Error adding simple test data:', error);
  } finally {
    await pool.end();
  }
}

addSimpleTestData();
