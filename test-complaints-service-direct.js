// Direct test of ComplaintsService to isolate the issue
const ComplaintsService = require('./src/services/postgres/complaints/ComplaintsService');

const testComplaintsService = async () => {
  console.log('🔍 Testing ComplaintsService directly...\n');

  try {
    // Create service instance
    const service = new ComplaintsService();
    console.log('✅ Service instance created');

    // Test the getComplaints method with no filters
    console.log('\n📋 Testing getComplaints with no filters...');
    const complaints = await service.getComplaints();
    console.log(`✅ Got ${complaints.length} complaints`);
    console.log(
      'First complaint:',
      complaints[0] ? complaints[0].title : 'No complaints'
    );

    // Test with filters
    console.log('\n📋 Testing getComplaints with filters...');
    const filteredComplaints = await service.getComplaints({
      status: undefined,
      category: undefined,
      priority: undefined,
      limit: 10,
      offset: 0,
    });
    console.log(`✅ Got ${filteredComplaints.length} filtered complaints`);
  } catch (error) {
    console.error('❌ Error in ComplaintsService test:', error);
    console.error('Stack:', error.stack);
  }
};

testComplaintsService();
