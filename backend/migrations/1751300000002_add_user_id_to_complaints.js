const up = (pgm) => {
  // Add user_id column to complaints table
  pgm.addColumns('complaints', {
    user_id: {
      type: 'VARCHAR(50)',
      references: 'users(id)',
      onDelete: 'SET NULL',
    },
  });

  // Create index for performance
  pgm.createIndex('complaints', ['user_id']);

  // Update existing data - set user_id based on reporter info
  // This is a temporary solution, you may need to adjust based on your data
  pgm.sql(`
    UPDATE complaints 
    SET user_id = (
      SELECT u.id 
      FROM users u 
      WHERE u.username = complaints.reporter_name 
      LIMIT 1
    )
    WHERE user_id IS NULL;
  `);
};

const down = (pgm) => {
  // Drop index and column
  pgm.dropIndex('complaints', ['user_id']);
  pgm.dropColumns('complaints', ['user_id']);
};

module.exports = { up, down };
