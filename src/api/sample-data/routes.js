const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');

const pool = new Pool();

const routes = [
  {
    method: 'POST',
    path: '/api/sample-data/users',
    handler: async (request, h) => {
      try {
        console.log('🔄 Sample-data API: Starting users generation...');
        console.log('📝 Request payload:', request.payload);

        const { count = { admin: 2, guru: 5, siswa: 20 } } = request.payload;
        console.log('📊 Users count to generate:', count);

        // Validate count structure for users
        if (!count || typeof count !== 'object') {
          console.error(
            '❌ Invalid count format - expected object with admin, guru, siswa properties'
          );
          const response = h.response({
            status: 'fail',
            message:
              'Invalid count format. Expected object with admin, guru, siswa properties.',
            example: { count: { admin: 2, guru: 5, siswa: 20 } },
          });
          response.code(400);
          return response;
        }

        if (
          typeof count.admin !== 'number' ||
          typeof count.guru !== 'number' ||
          typeof count.siswa !== 'number'
        ) {
          console.error(
            '❌ Invalid count values - admin, guru, siswa must be numbers'
          );
          const response = h.response({
            status: 'fail',
            message:
              'Invalid count values. admin, guru, siswa must be numbers.',
            received: count,
          });
          response.code(400);
          return response;
        }

        // Generate and insert sample users to database
        const createdUsers = [];

        // Generate admins
        for (let i = 1; i <= count.admin; i++) {
          const userId = `admin-${nanoid(16)}`;
          const hashedPassword = await bcrypt.hash('password123', 10);

          const query = {
            text: 'INSERT INTO users (id, username, fullname, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
            values: [
              userId,
              `admin${i}`,
              `Administrator ${i}`,
              `admin${i}@atthahirin.sch.id`,
              hashedPassword,
              'admin',
            ],
          };

          const result = await pool.query(query);
          if (result.rows.length > 0) {
            createdUsers.push(result.rows[0]);
            console.log(`✅ Created admin: ${result.rows[0].username}`);
          }
        }

        // Generate guru (teachers)
        for (let i = 1; i <= count.guru; i++) {
          const userId = `guru-${nanoid(16)}`;
          const hashedPassword = await bcrypt.hash('password123', 10);

          const query = {
            text: 'INSERT INTO users (id, username, fullname, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
            values: [
              userId,
              `guru${i}`,
              `Guru ${i}`,
              `guru${i}@atthahirin.sch.id`,
              hashedPassword,
              'guru',
            ],
          };

          const result = await pool.query(query);
          if (result.rows.length > 0) {
            createdUsers.push(result.rows[0]);
            console.log(`✅ Created guru: ${result.rows[0].username}`);
          }
        }

        // Generate siswa (students)
        for (let i = 1; i <= count.siswa; i++) {
          const userId = `siswa-${nanoid(16)}`;
          const hashedPassword = await bcrypt.hash('password123', 10);

          const query = {
            text: 'INSERT INTO users (id, username, fullname, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
            values: [
              userId,
              `siswa${i}`,
              `Siswa ${i}`,
              `siswa${i}@atthahirin.sch.id`,
              hashedPassword,
              'siswa',
            ],
          };

          const result = await pool.query(query);
          if (result.rows.length > 0) {
            createdUsers.push(result.rows[0]);
            console.log(`✅ Created siswa: ${result.rows[0].username}`);
          }
        }

        console.log(
          `✅ Sample-data API: Successfully created ${createdUsers.length} users`
        );

        const response = h.response({
          status: 'success',
          message: `Generated ${createdUsers.length} sample users`,
          data: {
            generated: createdUsers.length,
            breakdown: {
              admin: count.admin,
              guru: count.guru,
              siswa: count.siswa,
            },
          },
        });
        response.code(201);
        return response;
      } catch (error) {
        console.error('Error generating sample users:', error);
        const response = h.response({
          status: 'fail',
          message: 'Failed to generate sample users',
          error: error.message,
        });
        response.code(400);
        return response;
      }
    },
    options: {
      auth: false, // Disabled for development - sample data endpoint
    },
  },
  {
    method: 'POST',
    path: '/api/sample-data/classes',
    handler: async (request, h) => {
      try {
        console.log('🔄 Sample-data API: Starting classes generation...');
        console.log('📝 Request payload:', request.payload);

        const { count = 10 } = request.payload;
        console.log('📊 Classes count to generate:', count);

        // Validate count for classes
        if (typeof count !== 'number' || count <= 0 || count > 50) {
          console.error(
            '❌ Invalid count for classes - must be a number between 1 and 50'
          );
          const response = h.response({
            status: 'fail',
            message:
              'Invalid count for classes. Must be a number between 1 and 50.',
            received: count,
          });
          response.code(400);
          return response;
        }

        // First, check if we have any subjects and teachers
        const subjectsResult = await pool.query(
          'SELECT id FROM subjects LIMIT 1'
        );
        const teachersResult = await pool.query(
          'SELECT id FROM users WHERE role = $1 LIMIT 1',
          ['guru']
        );

        console.log('📚 Available subjects:', subjectsResult.rows.length);
        console.log('👩‍🏫 Available teachers:', teachersResult.rows.length);

        // Use existing subject/teacher IDs or create defaults
        let defaultSubjectId =
          subjectsResult.rows.length > 0 ? subjectsResult.rows[0].id : null;
        let defaultTeacherId =
          teachersResult.rows.length > 0 ? teachersResult.rows[0].id : null;

        // If no default subject exists, create one
        if (!defaultSubjectId) {
          const subjectId = `subject-${nanoid(16)}`;
          const subjectQuery = {
            text: 'INSERT INTO subjects (id, name, code, description, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING id',
            values: [
              subjectId,
              'Mata Pelajaran Umum',
              'MPU',
              'Default subject for sample classes',
            ],
          };
          const subjectResult = await pool.query(subjectQuery);
          defaultSubjectId = subjectResult.rows[0].id;
          console.log('✅ Created default subject:', defaultSubjectId);
        }

        // If no default teacher exists, create one
        if (!defaultTeacherId) {
          const teacherId = `teacher-${nanoid(16)}`;
          const hashedPassword = await bcrypt.hash('password123', 10);
          const teacherQuery = {
            text: 'INSERT INTO users (id, username, fullname, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id',
            values: [
              teacherId,
              'guru_default',
              'Guru Default',
              'guru.default@atthahirin.sch.id',
              hashedPassword,
              'guru',
            ],
          };
          const teacherResult = await pool.query(teacherQuery);
          defaultTeacherId = teacherResult.rows[0].id;
          console.log('✅ Created default teacher:', defaultTeacherId);
        }

        const classNames = [
          '7A',
          '7B',
          '7C',
          '7D',
          '8A',
          '8B',
          '8C',
          '8D',
          '9A',
          '9B',
          '9C',
          '9D',
          '10A',
          '10B',
          '10C',
          '11A',
          '11B',
          '11C',
          '12A',
          '12B',
          '12C',
        ];

        const actualCount = Math.min(count, classNames.length);
        const createdClasses = [];

        for (let i = 0; i < actualCount; i++) {
          const classId = `class-${nanoid(16)}`;
          const className = classNames[i];

          console.log(
            `📝 Creating class ${
              i + 1
            }/${actualCount}: ${className} with ID: ${classId}`
          );

          const query = {
            text: 'INSERT INTO classes (id, name, description, subject_id, teacher_id, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
            values: [
              classId,
              className,
              `Kelas ${className} - Semester Genap 2025`,
              defaultSubjectId, // Use default subject instead of null
              defaultTeacherId, // Use default teacher instead of null
            ],
          };

          console.log('🗄️ Executing query:', query.text);
          console.log('🗄️ Query values:', query.values);

          const result = await pool.query(query);
          console.log(
            '✅ Query result:',
            result.rows.length > 0 ? 'Success' : 'No rows returned'
          );

          if (result.rows.length > 0) {
            createdClasses.push(result.rows[0]);
            console.log(`✅ Created class: ${result.rows[0].name}`);
          }
        }

        console.log(
          `✅ Sample-data API: Successfully created ${createdClasses.length} classes`
        );

        const response = h.response({
          status: 'success',
          message: `Generated ${createdClasses.length} sample classes`,
          data: {
            generated: createdClasses.length,
            classes: createdClasses.map((c) => ({
              id: c.id,
              name: c.name,
              description: c.description,
            })),
          },
        });
        response.code(201);
        return response;
      } catch (error) {
        console.error(
          '❌ Sample-data API: Error generating sample classes:',
          error
        );
        const response = h.response({
          status: 'fail',
          message: 'Failed to generate sample classes',
          error: error.message,
        });
        response.code(400);
        return response;
      }
    },
    options: {
      auth: false, // Disabled for development - sample data endpoint
    },
  },
  {
    method: 'POST',
    path: '/api/sample-data/subjects',
    handler: async (request, h) => {
      try {
        console.log('🔄 Sample-data API: Starting subjects generation...');
        console.log('📝 Request payload:', request.payload);

        const { count = 8 } = request.payload;
        console.log('📊 Subjects count to generate:', count);

        // Validate count for subjects
        if (typeof count !== 'number' || count <= 0 || count > 20) {
          console.error(
            '❌ Invalid count for subjects - must be a number between 1 and 20'
          );
          const response = h.response({
            status: 'fail',
            message:
              'Invalid count for subjects. Must be a number between 1 and 20.',
            received: count,
          });
          response.code(400);
          return response;
        }

        const subjects = [
          {
            name: 'Matematika',
            code: 'MTK',
            description: 'Mata pelajaran Matematika',
          },
          {
            name: 'Bahasa Indonesia',
            code: 'BID',
            description: 'Mata pelajaran Bahasa Indonesia',
          },
          {
            name: 'Bahasa Inggris',
            code: 'BIG',
            description: 'Mata pelajaran Bahasa Inggris',
          },
          { name: 'IPA', code: 'IPA', description: 'Ilmu Pengetahuan Alam' },
          { name: 'IPS', code: 'IPS', description: 'Ilmu Pengetahuan Sosial' },
          {
            name: 'Pendidikan Agama Islam',
            code: 'PAI',
            description: 'Mata pelajaran PAI',
          },
          {
            name: 'Seni Budaya',
            code: 'SBD',
            description: 'Mata pelajaran Seni Budaya',
          },
          {
            name: 'Pendidikan Jasmani',
            code: 'PJK',
            description: 'Mata pelajaran PJOK',
          },
          {
            name: 'Prakarya',
            code: 'PKY',
            description: 'Mata pelajaran Prakarya',
          },
          {
            name: 'Bahasa Arab',
            code: 'BAR',
            description: 'Mata pelajaran Bahasa Arab',
          },
        ];

        const selectedSubjects = subjects.slice(0, count);
        const createdSubjects = [];

        for (let i = 0; i < selectedSubjects.length; i++) {
          const subject = selectedSubjects[i];
          const subjectId = `subject-${nanoid(16)}`;
          const uniqueCode = `${subject.code}-${nanoid(4)}`; // Make code unique to avoid duplicates

          console.log(
            `📝 Creating subject ${i + 1}/${selectedSubjects.length}: ${
              subject.name
            } with unique code: ${uniqueCode}`
          );

          const query = {
            text: 'INSERT INTO subjects (id, name, code, description, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *',
            values: [
              subjectId,
              subject.name,
              uniqueCode, // Use unique code instead of just subject.code
              subject.description,
            ],
          };

          console.log('🗄️ Executing subject query:', query.text);
          console.log('🗄️ Query values:', query.values);

          const result = await pool.query(query);
          console.log(
            '✅ Subject query result:',
            result.rows.length > 0 ? 'Success' : 'No rows returned'
          );

          if (result.rows.length > 0) {
            createdSubjects.push(result.rows[0]);
            console.log(
              `✅ Created subject: ${result.rows[0].name} (${result.rows[0].code})`
            );
          }
        }

        console.log(
          `✅ Sample-data API: Successfully created ${createdSubjects.length} subjects`
        );

        const response = h.response({
          status: 'success',
          message: `Generated ${createdSubjects.length} sample subjects`,
          data: {
            generated: createdSubjects.length,
            subjects: createdSubjects.map((s) => ({
              id: s.id,
              name: s.name,
              code: s.code,
              description: s.description,
            })),
          },
        });
        response.code(201);
        return response;
      } catch (error) {
        console.error('Error generating sample subjects:', error);
        const response = h.response({
          status: 'fail',
          message: 'Failed to generate sample subjects',
          error: error.message,
        });
        response.code(400);
        return response;
      }
    },
    options: {
      auth: false, // Disabled for development - sample data endpoint
    },
  },
  {
    method: 'POST',
    path: '/api/sample-data/complaints',
    handler: async (request, h) => {
      try {
        console.log('🔄 Sample-data API: Starting complaints generation...');
        console.log('📝 Request payload:', request.payload);

        const { count = 15 } = request.payload;
        console.log('📊 Complaints count to generate:', count);

        // Validate count for complaints
        if (typeof count !== 'number' || count <= 0 || count > 100) {
          console.error(
            '❌ Invalid count for complaints - must be a number between 1 and 100'
          );
          const response = h.response({
            status: 'fail',
            message:
              'Invalid count for complaints. Must be a number between 1 and 100.',
            received: count,
          });
          response.code(400);
          return response;
        }

        const complaintTemplates = [
          {
            title: 'Fasilitas Kelas Rusak',
            description:
              'Meja dan kursi di kelas 8A banyak yang rusak dan perlu diperbaiki.',
            category: 'fasilitas',
            priority: 'medium',
          },
          {
            title: 'Kantin Sekolah Tidak Bersih',
            description:
              'Kondisi kantin sekolah kurang bersih dan perlu perhatian lebih.',
            category: 'kebersihan',
            priority: 'high',
          },
          {
            title: 'Jadwal Pelajaran Berubah Tanpa Pemberitahuan',
            description:
              'Jadwal pelajaran sering berubah tanpa pemberitahuan sebelumnya.',
            category: 'akademik',
            priority: 'medium',
          },
          {
            title: 'Masalah Bullying di Sekolah',
            description:
              'Ada kasus bullying yang perlu ditangani dengan serius.',
            category: 'sosial',
            priority: 'high',
          },
          {
            title: 'Perpustakaan Buku Kurang Lengkap',
            description:
              'Koleksi buku di perpustakaan masih kurang lengkap untuk mendukung pembelajaran.',
            category: 'fasilitas',
            priority: 'low',
          },
        ];

        const createdComplaints = [];

        for (let i = 0; i < count; i++) {
          const template = complaintTemplates[i % complaintTemplates.length];
          const templateIndex = Math.floor(i / complaintTemplates.length) + 1;

          console.log(
            `📝 Creating complaint ${i + 1}/${count}: ${template.title}`
          );

          const query = {
            text: `INSERT INTO complaints (
              title, description, category, status, priority, 
              reporter_name, reporter_email, reporter_type, reporter_class,
              reported_at, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING *`,
            values: [
              `${template.title} ${templateIndex}`,
              template.description,
              template.category,
              ['pending', 'in_progress', 'resolved'][
                Math.floor(Math.random() * 3)
              ],
              template.priority,
              `Siswa Sample ${i + 1}`,
              `siswa${i + 1}@atthahirin.sch.id`,
              'siswa',
              ['7A', '7B', '8A', '8B', '9A', '9B'][
                Math.floor(Math.random() * 6)
              ],
              new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
            ],
          };

          const result = await pool.query(query);
          if (result.rows.length > 0) {
            createdComplaints.push(result.rows[0]);
            console.log(`✅ Created complaint: ${result.rows[0].title}`);
          }
        }

        console.log(
          `✅ Sample-data API: Successfully created ${createdComplaints.length} complaints`
        );

        const response = h.response({
          status: 'success',
          message: `Generated ${createdComplaints.length} sample complaints`,
          data: {
            generated: createdComplaints.length,
            categories: [...new Set(createdComplaints.map((c) => c.category))],
            statuses: [...new Set(createdComplaints.map((c) => c.status))],
          },
        });
        response.code(201);
        return response;
      } catch (error) {
        console.error('Error generating sample complaints:', error);
        const response = h.response({
          status: 'fail',
          message: 'Failed to generate sample complaints',
          error: error.message,
        });
        response.code(400);
        return response;
      }
    },
    options: {
      auth: false, // Disabled for development - sample data endpoint
    },
  },
  {
    method: 'DELETE',
    path: '/api/sample-data/all',
    handler: async (request, h) => {
      try {
        // This would clear all sample data from database
        // Implementation depends on your database structure

        const response = h.response({
          status: 'success',
          message: 'All sample data cleared successfully',
          data: {
            cleared: ['users', 'classes', 'subjects', 'complaints'],
          },
        });
        response.code(200);
        return response;
      } catch (error) {
        console.error('Error clearing sample data:', error);
        const response = h.response({
          status: 'fail',
          message: 'Failed to clear sample data',
          error: error.message,
        });
        response.code(400);
        return response;
      }
    },
    options: {
      auth: false, // Disabled for development - sample data endpoint
    },
  },
  {
    method: 'GET',
    path: '/api/sample-data/status',
    handler: async (request, h) => {
      try {
        // Check current sample data status
        const response = h.response({
          status: 'success',
          message: 'Sample data status retrieved',
          data: {
            users: { total: 0, admin: 0, guru: 0, siswa: 0 },
            classes: { total: 0 },
            subjects: { total: 0 },
            complaints: { total: 0, pending: 0, resolved: 0 },
            last_generated: null,
          },
        });
        response.code(200);
        return response;
      } catch (error) {
        console.error('Error getting sample data status:', error);
        const response = h.response({
          status: 'fail',
          message: 'Failed to get sample data status',
          error: error.message,
        });
        response.code(400);
        return response;
      }
    },
    options: {
      auth: false, // Disabled for development - sample data endpoint
    },
  },
];

module.exports = routes;
