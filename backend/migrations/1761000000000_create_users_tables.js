exports.up = (pgm) => {
    // Tabel Admin
    pgm.createTable('admins', {
        id: 'id',
        name: { type: 'text', notNull: true },
        email: { type: 'text', notNull: true, unique: true },
        password: { type: 'text', notNull: true },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });

    // Tabel Guru
    pgm.createTable('gurus', {
        id: 'id',
        name: { type: 'text', notNull: true },
        email: { type: 'text', notNull: true, unique: true },
        password: { type: 'text', notNull: true },
        subject: { type: 'text' },
        created_by: {
        type: 'integer',
        references: '"admins"',
        onDelete: 'SET NULL',
        },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });

    // Tabel Siswa
    pgm.createTable('siswas', {
        id: 'id',
        name: { type: 'text', notNull: true },
        email: { type: 'text', notNull: true, unique: true },
        password: { type: 'text', notNull: true },
        class: { type: 'text' },
        created_by: {
        type: 'integer',
        references: '"admins"',
        onDelete: 'SET NULL',
        },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('siswas');
    pgm.dropTable('gurus');
    pgm.dropTable('admins');
};
