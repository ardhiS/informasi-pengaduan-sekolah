const up = (pgm) => {
  pgm.createTable('guru', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    nama: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    nip: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    mapel: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
  });
};

const down = (pgm) => {
  pgm.dropTable('guru');
};

module.exports = { up, down };
