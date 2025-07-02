const up = (pgm) => {
  // Add new columns for user tracking
  pgm.addColumns('complaints', {
    created_by: { type: 'varchar(50)' },
    created_by_role: { type: 'varchar(20)' },
    updated_by: { type: 'varchar(50)' },
    updated_by_role: { type: 'varchar(20)' },
    assigned_by: { type: 'varchar(50)' },
    assigned_at: { type: 'timestamp' },
    resolved_by: { type: 'varchar(50)' },
    resolved_by_role: { type: 'varchar(20)' },
  });

  // Create indexes for performance
  pgm.createIndex('complaints', ['created_by']);
  pgm.createIndex('complaints', ['assigned_to']);
  pgm.createIndex('complaints', ['created_by_role']);

  // Update existing data (optional - if there is old data)
  pgm.sql(`
    UPDATE complaints 
    SET created_by_role = 'siswa' 
    WHERE created_by_role IS NULL;
  `);
};

const down = (pgm) => {
  // Drop indexes
  pgm.dropIndex('complaints', ['created_by']);
  pgm.dropIndex('complaints', ['assigned_to']);
  pgm.dropIndex('complaints', ['created_by_role']);

  // Drop columns
  pgm.dropColumns('complaints', [
    'created_by',
    'created_by_role',
    'updated_by',
    'updated_by_role',
    'assigned_by',
    'assigned_at',
    'resolved_by',
    'resolved_by_role',
  ]);
};

module.exports = { up, down };
