const up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    fullname: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    role: {
      type: 'VARCHAR(20)',
      notNull: true,
      default: 'user',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

const down = (pgm) => {
  pgm.dropTable('users');
};

module.exports = { up, down };
