const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'school_management',
  password: process.env.PGPASSWORD || 'password',
  port: process.env.PGPORT || 5432,
});

// Sample subjects data
const subjects = [
  {
    name: 'Mathematics Advanced',
    code: 'MATH101',
    description: 'Advanced mathematics covering calculus and algebra',
  },
  {
    name: 'Physics Fundamentals',
    code: 'PHYS101',
    description: 'Basic principles of physics and mechanics',
  },
  {
    name: 'Chemistry Basics',
    code: 'CHEM101',
    description: 'Introduction to chemical reactions and elements',
  },
  {
    name: 'Biology Essentials',
    code: 'BIO101',
    description: 'Study of living organisms and life processes',
  },
  {
    name: 'English Literature',
    code: 'ENG101',
    description: 'Classic and modern literature analysis',
  },
  {
    name: 'World History',
    code: 'HIST101',
    description: 'Comprehensive study of world civilizations',
  },
  {
    name: 'Geography Studies',
    code: 'GEO101',
    description: 'Physical and human geography concepts',
  },
  {
    name: 'Computer Science',
    code: 'CS101',
    description: 'Programming fundamentals and algorithms',
  },
  {
    name: 'Art & Design',
    code: 'ART101',
    description: 'Creative expression through various art mediums',
  },
  {
    name: 'Music Theory',
    code: 'MUS101',
    description: 'Understanding musical composition and theory',
  },
  {
    name: 'Physical Education',
    code: 'PE101',
    description: 'Sports, fitness, and health education',
  },
  {
    name: 'Economics Basics',
    code: 'ECON101',
    description: 'Principles of micro and macroeconomics',
  },
  {
    name: 'Psychology Intro',
    code: 'PSY101',
    description: 'Human behavior and mental processes',
  },
  {
    name: 'Sociology Studies',
    code: 'SOC101',
    description: 'Society, culture, and social interactions',
  },
  {
    name: 'Philosophy Ethics',
    code: 'PHIL101',
    description: 'Ethical reasoning and philosophical thinking',
  },
  {
    name: 'Statistics Math',
    code: 'STAT101',
    description: 'Data analysis and statistical methods',
  },
  {
    name: 'Environmental Science',
    code: 'ENV101',
    description: 'Ecology and environmental sustainability',
  },
  {
    name: 'Political Science',
    code: 'POLI101',
    description: 'Government systems and political theory',
  },
  {
    name: 'Anthropology',
    code: 'ANTH101',
    description: 'Human cultures and societies',
  },
  {
    name: 'Astronomy Basics',
    code: 'ASTR101',
    description: 'Study of celestial objects and space',
  },
  {
    name: 'Geology Earth',
    code: 'GEOL101',
    description: 'Earth structure and geological processes',
  },
  {
    name: 'Foreign Language',
    code: 'LANG101',
    description: 'Introduction to second language learning',
  },
  {
    name: 'Creative Writing',
    code: 'WRIT101',
    description: 'Fiction, poetry, and narrative techniques',
  },
  {
    name: 'Drama Theatre',
    code: 'DRAM101',
    description: 'Acting, directing, and theatrical arts',
  },
  {
    name: 'Health Sciences',
    code: 'HLTH101',
    description: 'Human anatomy and health principles',
  },
  {
    name: 'Business Studies',
    code: 'BUS101',
    description: 'Entrepreneurship and business management',
  },
  {
    name: 'Engineering Tech',
    code: 'ENG101',
    description: 'Technical design and engineering principles',
  },
  {
    name: 'Culinary Arts',
    code: 'CULI101',
    description: 'Cooking techniques and food preparation',
  },
  {
    name: 'Photography',
    code: 'PHOTO101',
    description: 'Digital and film photography techniques',
  },
  {
    name: 'Web Development',
    code: 'WEB101',
    description: 'HTML, CSS, and JavaScript fundamentals',
  },
];

// Sample classes data (will use first 10 subjects)
const classesData = [
  {
    name: 'Advanced Calculus Class A',
    description: 'Morning session for advanced mathematics',
  },
  { name: 'Physics Lab Session', description: 'Hands-on physics experiments' },
  { name: 'Chemistry Workshop', description: 'Interactive chemistry learning' },
  { name: 'Biology Field Study', description: 'Outdoor biology exploration' },
  {
    name: 'Literature Discussion',
    description: 'Book club and analysis sessions',
  },
  { name: 'History Seminar', description: 'Deep dive into historical events' },
  { name: 'Geography Expedition', description: 'Local geography field trips' },
  { name: 'Programming Bootcamp', description: 'Intensive coding sessions' },
  {
    name: 'Art Studio Time',
    description: 'Creative art projects and exhibitions',
  },
  { name: 'Music Ensemble', description: 'Group music performance practice' },
  { name: 'Sports Training', description: 'Athletic skills development' },
  {
    name: 'Economics Forum',
    description: 'Current economic issues discussion',
  },
  {
    name: 'Psychology Workshop',
    description: 'Mental health awareness sessions',
  },
  { name: 'Sociology Project', description: 'Community research projects' },
  { name: 'Philosophy Debate', description: 'Ethical dilemma discussions' },
  { name: 'Statistics Lab', description: 'Data analysis practical sessions' },
  {
    name: 'Environmental Club',
    description: 'Sustainability projects and activities',
  },
  { name: 'Model UN', description: 'International relations simulation' },
  {
    name: 'Cultural Studies',
    description: 'Cross-cultural learning experiences',
  },
  { name: 'Astronomy Club', description: 'Stargazing and space exploration' },
  {
    name: 'Geology Field Trip',
    description: 'Rock and mineral identification',
  },
  { name: 'Language Exchange', code: 'Conversational practice sessions' },
  { name: 'Writing Workshop', description: 'Creative writing and editing' },
  {
    name: 'Drama Production',
    description: 'School play rehearsals and performance',
  },
  { name: 'Health & Wellness', description: 'Nutrition and fitness education' },
  { name: 'Business Incubator', description: 'Student startup development' },
  { name: 'Engineering Design', description: 'Prototype building and testing' },
  { name: 'Cooking Class', description: 'International cuisine preparation' },
  {
    name: 'Photo Exhibition',
    description: 'Photography showcase and critique',
  },
  { name: 'Web Dev Project', description: 'Build real-world websites' },
];

async function createSampleData() {
  try {
    console.log('Creating sample subjects...');

    // Insert subjects
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      const id = `subject-${Date.now()}-${i}`;

      await pool.query(
        'INSERT INTO subjects (id, name, code, description, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [id, subject.name, subject.code, subject.description]
      );

      console.log(`✓ Created subject: ${subject.name}`);
    }

    console.log('\nCreating sample classes...');

    // Get all subjects to use their IDs
    const subjectsResult = await pool.query(
      'SELECT id FROM subjects ORDER BY created_at LIMIT 30'
    );
    const subjectIds = subjectsResult.rows.map((row) => row.id);

    // Get a user ID to use as teacher (assuming there's at least one user)
    const usersResult = await pool.query('SELECT id FROM users LIMIT 1');
    if (usersResult.rows.length === 0) {
      console.log('No users found. Creating a sample teacher...');
      const teacherId = `user-${Date.now()}`;
      await pool.query(
        'INSERT INTO users (id, username, email, password, fullname, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [
          teacherId,
          'sample_teacher',
          'teacher@school.com',
          'hashedpassword',
          'Sample Teacher',
        ]
      );
      console.log('✓ Created sample teacher');
    }

    const teacherResult = await pool.query('SELECT id FROM users LIMIT 1');
    const teacherId = teacherResult.rows[0].id;

    // Insert classes
    for (let i = 0; i < classesData.length; i++) {
      const classData = classesData[i];
      const classId = `class-${Date.now()}-${i}`;
      const subjectId = subjectIds[i % subjectIds.length]; // Cycle through subjects

      await pool.query(
        'INSERT INTO classes (id, name, subject_id, teacher_id, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())',
        [classId, classData.name, subjectId, teacherId, classData.description]
      );

      console.log(`✓ Created class: ${classData.name}`);
    }

    console.log('\n🎉 Sample data created successfully!');
    console.log(
      `📊 Created ${subjects.length} subjects and ${classesData.length} classes`
    );
  } catch (error) {
    console.error('Error creating sample data:', error);
  } finally {
    await pool.end();
  }
}

createSampleData();
