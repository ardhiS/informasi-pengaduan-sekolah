// Test ComplaintsValidator import
const ComplaintsValidator = require('./src/validator/complaints');

console.log('ComplaintsValidator:', ComplaintsValidator);
console.log(
  'validateComplaintQuery:',
  ComplaintsValidator.validateComplaintQuery
);

// Test the function exists
if (ComplaintsValidator && ComplaintsValidator.validateComplaintQuery) {
  console.log('✅ validateComplaintQuery exists');
  try {
    ComplaintsValidator.validateComplaintQuery({});
    console.log('✅ validateComplaintQuery works with empty query');
  } catch (error) {
    console.log('❌ validateComplaintQuery error:', error.message);
  }
} else {
  console.log('❌ validateComplaintQuery does not exist');
}
