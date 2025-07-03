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
  });
};

const down = (pgm) => {
  pgm.dropTable('siswa');
};

module.exports = { up, down };
