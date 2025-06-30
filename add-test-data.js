require('dotenv').config();
const { Pool } = require('pg');
const { nanoid } = require('nanoid');

const pool = new Pool();

async function addTestData() {
  try {
    console.log('Adding test subjects...');

    // Add some subjects first
    const subjects = [
      {
        name: 'Mathematics',
        code: 'MTK',
        description: 'Basic mathematics including algebra and geometry',
      },
      {
        name: 'English',
        code: 'ENG',
        description: 'English language and literature',
      },
      {
        name: 'Science',
        code: 'SCI',
        description: 'General science covering physics, chemistry, and biology',
      },
      {
        name: 'History',
        code: 'HIS',
        description: 'World history and local history',
      },
      {
        name: 'Art',
        code: 'ART',
        description: 'Visual arts and creative expression',
      },
    ];

    const subjectIds = [];
    for (const subject of subjects) {
      const id = `subject-${nanoid(16)}`;
      await pool.query(
        'INSERT INTO subjects (id, name, code, description, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [id, subject.name, subject.code, subject.description]
      );
      subjectIds.push(id);
      console.log(`Added subject: ${subject.name}`);
    }

    console.log('Adding test classes...');

    // Add some classes
    const classes = [
      {
        name: 'Math Grade 10A',
        description: 'Advanced mathematics for grade 10 students',
        subject_id: subjectIds[0],
      },
      {
        name: 'Math Grade 10B',
        description: 'Mathematics for grade 10 students',
        subject_id: subjectIds[0],
      },
      {
        name: 'English Literature',
        description: 'English literature and composition',
        subject_id: subjectIds[1],
      },
      {
        name: 'Physics Lab',
        description: 'Hands-on physics experiments',
        subject_id: subjectIds[2],
      },
      {
        name: 'World History',
        description: 'Survey of world civilizations',
        subject_id: subjectIds[3],
      },
      {
        name: 'Art Workshop',
        description: 'Creative art projects and techniques',
        subject_id: subjectIds[4],
      },
    ];

    for (const cls of classes) {
      const id = `class-${nanoid(16)}`;
      await pool.query(
        'INSERT INTO classes (id, name, description, subject_id, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [id, cls.name, cls.description, cls.subject_id]
      );
      console.log(`Added class: ${cls.name}`);
    }

    console.log('Test data added successfully!');

    // Verify data
    const subjectsResult = await pool.query(
      'SELECT COUNT(*) as count FROM subjects'
    );
    const classesResult = await pool.query(
      'SELECT COUNT(*) as count FROM classes'
    );

    console.log(`Total subjects: ${subjectsResult.rows[0].count}`);
    console.log(`Total classes: ${classesResult.rows[0].count}`);
  } catch (error) {
    console.error('Error adding test data:', error);
  } finally {
    await pool.end();
  }
}

addTestData();
