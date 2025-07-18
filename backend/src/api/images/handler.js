const { Pool } = require('pg');
const pool = new Pool();

const uploadImageHandler = async (request, h) => {
    const { image } = request.payload;
    const filename = image.hapi.filename;

    const chunks = [];
    for await (const chunk of image) {
        chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    await pool.query(
        'INSERT INTO images_blob (filename, data, uploaded_by) VALUES ($1, $2, $3)',
        [filename, buffer, 'siswa'] // Ganti dengan identitas user login jika ada
    );

    return h.response({ message: 'Upload ke DB berhasil', filename }).code(201);
};

const getImageHandler = async (request, h) => {
    const { filename } = request.params;
    const result = await pool.query('SELECT data FROM images_blob WHERE filename = $1', [filename]);

    if (result.rows.length === 0) {
        return h.response({ message: 'Gambar tidak ditemukan' }).code(404);
    }

    return h.response(result.rows[0].data).type('image/jpeg');
};

module.exports = { uploadImageHandler, getImageHandler };
