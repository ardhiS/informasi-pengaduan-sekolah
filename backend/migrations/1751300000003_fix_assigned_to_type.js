const up = (pgm) => {
  // First, remove any existing foreign key constraints on assigned_to
  pgm.sql(`
    ALTER TABLE complaints 
    DROP CONSTRAINT IF EXISTS complaints_assigned_to_fkey;
  `);

  // Change assigned_to column type to match users.id (VARCHAR(50))
  pgm.sql(`
    ALTER TABLE complaints 
    ALTER COLUMN assigned_to TYPE VARCHAR(50);
  `);

  // Add foreign key constraint with proper type
  pgm.addConstraint('complaints', 'complaints_assigned_to_fkey', {
    foreignKeys: {
      columns: 'assigned_to',
      references: 'users(id)',
      onDelete: 'SET NULL',
    },
  });
};

const down = (pgm) => {
  // Remove foreign key constraint
  pgm.dropConstraint('complaints', 'complaints_assigned_to_fkey');

  // Revert assigned_to column type back to integer
  pgm.sql(`
    ALTER TABLE complaints 
    ALTER COLUMN assigned_to TYPE INTEGER USING assigned_to::INTEGER;
  `);
};

module.exports = { up, down };
