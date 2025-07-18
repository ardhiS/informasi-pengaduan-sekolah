const up = (pgm) => {
  pgm.createTable('siswa', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    nama: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    nis: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    kelas: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    password: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

const down = (pgm) => {
  pgm.dropTable('siswa');
};

module.exports = { up, down };
