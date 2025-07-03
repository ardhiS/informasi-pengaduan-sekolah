/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  // Create subjects table (mata pelajaran)
  pgm.createTable('subjects', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    code: {
      type: 'VARCHAR(20)',
      notNull: true,
      unique: true,
    },
    description: {
      type: 'TEXT',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create classes table (kelas)
  pgm.createTable('classes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    subject_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    teacher_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    description: {
      type: 'TEXT',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add foreign key constraints
  pgm.addConstraint(
    'classes',
    'fk_classes.subject_id_subjects.id',
    'FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'classes',
    'fk_classes.teacher_id_users.id',
    'FOREIGN KEY(teacher_id) REFERENCES users(id) ON DELETE CASCADE'
  );

  // Create class_collaborators table (guru pendamping)
  pgm.createTable('class_collaborators', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    class_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add foreign key constraints for collaborators
  pgm.addConstraint(
    'class_collaborators',
    'fk_class_collaborators.class_id_classes.id',
    'FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'class_collaborators',
    'fk_class_collaborators.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );

  // Create unique constraint for class-user combination
  pgm.addConstraint(
    'class_collaborators',
    'unique_class_user',
    'UNIQUE(class_id, user_id)'
  );

  // Create class_activities table (aktivitas kelas)
  pgm.createTable('class_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    class_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    target_type: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    target_name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add foreign key constraints for activities
  pgm.addConstraint(
    'class_activities',
    'fk_class_activities.class_id_classes.id',
    'FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'class_activities',
    'fk_class_activities.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('class_activities');
  pgm.dropTable('class_collaborators');
  pgm.dropTable('classes');
  pgm.dropTable('subjects');
};
