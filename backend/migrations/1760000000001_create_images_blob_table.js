exports.up = (pgm) => {
    pgm.createTable('images_blob', {
        id: {
            type: 'serial',
            primaryKey: true,
        },
        filename: { 
            type: 'text', 
            notNull: true 
        },
        data: { 
            type: 'bytea', 
            notNull: true 
        },
        uploaded_by: { type: 'text' },
        uploaded_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('images_blob');
};
