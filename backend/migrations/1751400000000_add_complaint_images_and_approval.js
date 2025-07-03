const up = (pgm) => {
  // Create images table for complaint attachments
  pgm.createTable('complaint_images', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    complaint_id: {
      type: 'integer',
      notNull: true,
      references: 'complaints(id)',
      onDelete: 'CASCADE',
    },
    filename: {
      type: 'varchar(255)',
      notNull: true,
    },
    original_name: {
      type: 'varchar(255)',
      notNull: true,
    },
    file_path: {
      type: 'varchar(500)',
      notNull: true,
    },
    file_size: {
      type: 'integer',
    },
    mime_type: {
      type: 'varchar(100)',
    },
    uploaded_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    },
  });

  // Add index for performance
  pgm.createIndex('complaint_images', ['complaint_id']);

  // Update status enum to match new requirements
  pgm.sql(`
    ALTER TABLE complaints 
    ALTER COLUMN status TYPE varchar(50);
  `);

  // Add approval status column for admin filtering
  pgm.addColumns('complaints', {
    approval_status: {
      type: 'varchar(50)',
      default: 'pending_approval',
    },
    approved_by: {
      type: 'varchar(50)',
      references: 'users(id)',
      onDelete: 'SET NULL',
    },
    approved_at: {
      type: 'timestamp',
    },
    rejection_reason: {
      type: 'text',
    },
  });

  // Update existing complaints to have proper default statuses
  pgm.sql(`
    UPDATE complaints 
    SET approval_status = 'pending_approval',
        status = 'pending_approval'
    WHERE status = 'pending';
  `);
};

const down = (pgm) => {
  // Drop new columns
  pgm.dropColumns('complaints', [
    'approval_status',
    'approved_by',
    'approved_at',
    'rejection_reason',
  ]);

  // Drop images table
  pgm.dropTable('complaint_images');
};

module.exports = { up, down };
