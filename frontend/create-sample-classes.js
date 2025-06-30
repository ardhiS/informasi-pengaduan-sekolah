// Script untuk membuat sample classes dan subjects di database
const createSampleClassesAndSubjects = async () => {
  try {
    console.log('Creating sample subjects and classes...');

    // Login untuk mendapatkan token
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:5000/authentications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123',
      }),
    });

    if (!loginResponse.ok) {
      console.log('❌ Could not login');
      return;
    }

    const loginData = await loginResponse.json();
    const token = loginData.data.accessToken;
    console.log('✅ Login successful');

    // Sample subjects
    const sampleSubjects = [
      {
        name: 'Matematika',
        description: 'Mata pelajaran matematika untuk semua tingkat',
      },
      {
        name: 'Bahasa Indonesia',
        description: 'Mata pelajaran bahasa Indonesia dan sastra',
      },
      {
        name: 'Bahasa Inggris',
        description: 'Mata pelajaran bahasa Inggris dan komunikasi',
      },
      {
        name: 'Fisika',
        description: 'Mata pelajaran fisika dan eksperimen',
      },
      {
        name: 'Kimia',
        description: 'Mata pelajaran kimia dan laboratorium',
      },
    ];

    const createdSubjects = [];

    // Create subjects
    console.log('\n2. Creating subjects...');
    for (const subject of sampleSubjects) {
      try {
        const response = await fetch('http://localhost:5000/subjects', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subject),
        });

        if (response.ok) {
          const data = await response.json();
          createdSubjects.push(data.data.subjectId);
          console.log(`✅ Created subject: ${subject.name}`);
        } else {
          const errorText = await response.text();
          console.log(`⚠️  ${subject.name}: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ Error creating ${subject.name}:`, error.message);
      }
    }

    // Wait a bit for subjects to be created
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get all subjects to get their IDs
    console.log('\n3. Getting subjects list...');
    const subjectsResponse = await fetch('http://localhost:5000/subjects', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    let subjectsList = [];
    if (subjectsResponse.ok) {
      const subjectsData = await subjectsResponse.json();
      subjectsList = subjectsData.data.subjects || [];
      console.log('✅ Retrieved subjects:', subjectsList.length);
    }

    // Sample classes
    const sampleClasses = [
      {
        name: 'Kelas X-A',
        description: 'Kelas 10 A untuk mata pelajaran umum',
        subject_id: subjectsList[0]?.id || '',
      },
      {
        name: 'Kelas X-B',
        description: 'Kelas 10 B untuk mata pelajaran umum',
        subject_id: subjectsList[1]?.id || '',
      },
      {
        name: 'Kelas XI IPA-1',
        description: 'Kelas 11 IPA program sains',
        subject_id: subjectsList[2]?.id || '',
      },
      {
        name: 'Kelas XI IPA-2',
        description: 'Kelas 11 IPA program sains',
        subject_id: subjectsList[3]?.id || '',
      },
      {
        name: 'Kelas XII IPS',
        description: 'Kelas 12 IPS program sosial',
        subject_id: subjectsList[4]?.id || '',
      },
    ];

    // Create classes
    console.log('\n4. Creating classes...');
    for (const classData of sampleClasses) {
      try {
        const response = await fetch('http://localhost:5000/classes', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(classData),
        });

        if (response.ok) {
          console.log(`✅ Created class: ${classData.name}`);
        } else {
          const errorText = await response.text();
          console.log(`⚠️  ${classData.name}: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ Error creating ${classData.name}:`, error.message);
      }
    }

    console.log('\n✅ Sample classes and subjects creation completed!');
    console.log(
      'You can now refresh the Classes and Subjects pages to see the data.'
    );
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
};

createSampleClassesAndSubjects();
