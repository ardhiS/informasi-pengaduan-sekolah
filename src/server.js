require('dotenv').config();

const Hapi = require('@hapi/hapi');
const guru = require('./api/guru');
const GuruService = require('./services/postgres/guru/GuruService');
const GuruValidator = require('./validator/guru');

const siswa = require('./api/siswa');
const SiswaService = require('./services/postgres/siswa/SiswaService');
const SiswaValidator = require('./validator/siswa');

const ClientError = require('./exceptions/ClientError');
const NotFoundError = require('./exceptions/NotFoudError');

const init = async () => {
  const guruService = new GuruService();
  const siswaService = new SiswaService();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: guru,
      options: {
        service: new GuruService(),
        validator: GuruValidator,
      },
    },
    {
      plugin: siswa,
      options: {
        service: new SiswaService(),
        validator: SiswaValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    // Penanganan error duplicate username
    if (
      response instanceof Error &&
      response.message &&
      response.message.includes('Username sudah digunakan')
    ) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Gagal menambahkan user. Username sudah digunakan.',
      });
      newResponse.code(400);
      return newResponse;
    }

    // Penanganan error validasi user (InvariantError atau Joi)
    if (
      (response instanceof Error && response.name === 'InvariantError') ||
      (response && response.isJoi)
    ) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Gagal menambahkan user. Username sudah digunakan.',
      });
      newResponse.code(400);
      return newResponse;
    }

    // Penanganan client error secara internal
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    } else if (response instanceof NotFoundError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
