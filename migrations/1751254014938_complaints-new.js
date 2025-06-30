const up = (pgm) => {
  pgm.createTable('complaints', {
    id: { type: 'serial', primaryKey: true },
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', notNull: true },
    category: { type: 'varchar(100)', notNull: true },
    status: { type: 'varchar(50)', default: 'pending' },
    priority: { type: 'varchar(20)', default: 'medium' },
    reporter_name: { type: 'varchar(255)', notNull: true },
    reporter_email: { type: 'varchar(255)' },
    reporter_phone: { type: 'varchar(20)' },
    reporter_type: { type: 'varchar(50)', notNull: true },
    reporter_class: { type: 'varchar(100)' },
    assigned_to: { type: 'integer' },
    admin_notes: { type: 'text' },
    resolution: { type: 'text' },
    attachments: { type: 'json' },
    reported_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    resolved_at: { type: 'timestamp' },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  // Create indexes
  pgm.createIndex('complaints', ['status']);
  pgm.createIndex('complaints', ['category']);
  pgm.createIndex('complaints', ['priority']);
  pgm.createIndex('complaints', ['reporter_type']);
  pgm.createIndex('complaints', ['reported_at']);
};

const down = (pgm) => {
  pgm.dropTable('complaints');
};

module.exports = { up, down };
