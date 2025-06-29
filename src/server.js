require('dotenv').config();

const Hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');

// Import existing modules
const guru = require('./api/guru');
const GuruService = require('./services/postgres/guru/GuruService');
const GuruValidator = require('./validator/guru');

const siswa = require('./api/siswa');
const SiswaService = require('./services/postgres/siswa/SiswaService');
const SiswaValidator = require('./validator/siswa');

// Import authentication modules
const auth = require('./api/auth');
const authentications = require('./api/authentications');
const AuthService = require('./services/postgres/AuthService');
const RefreshTokenService = require('./services/postgres/RefreshTokenService');
const AuthValidator = require('./validator/auth');
const AuthenticationsValidator = require('./validator/authentications');

// Import new modules for OpenMusic-like features
const subjects = require('./api/subjects');
const SubjectsService = require('./services/postgres/SubjectsService');
const SubjectsValidator = require('./validator/subjects');

const classes = require('./api/classes');
const ClassesService = require('./services/postgres/ClassesService');
const ClassesValidator = require('./validator/classes');

const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const ActivitiesService = require('./services/postgres/ActivitiesService');

const ClientError = require('./exceptions/ClientError');
const NotFoundError = require('./exceptions/NotFoudError');
const AuthenticationError = require('./exceptions/AuthenticationError');
const AuthorizationError = require('./exceptions/AuthorizationError');

const init = async () => {
  const guruService = new GuruService();
  const siswaService = new SiswaService();
  const authService = new AuthService();
  const refreshTokenService = new RefreshTokenService();
  const subjectsService = new SubjectsService();
  const activitiesService = new ActivitiesService();
  const collaborationsService = new CollaborationsService();
  const classesService = new ClassesService(
    collaborationsService,
    activitiesService
  );

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Register JWT plugin
  await server.register(jwt);

  // JWT authentication strategy sesuai kriteria (menggunakan ACCESS_TOKEN_KEY)
  server.auth.strategy('school_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: 1800, // 30 minutes
    },
    validate: async (artifacts, request, h) => {
      const { decoded } = artifacts;

      try {
        const user = await authService.getUserById(decoded.payload.userId);
        return {
          isValid: true,
          credentials: {
            userId: user.id,
            username: user.username,
            role: user.role,
          },
        };
      } catch (error) {
        return {
          isValid: false,
        };
      }
    },
  });

  // Tidak menggunakan default auth strategy agar endpoint register/login bisa diakses tanpa token
  // Setiap route yang memerlukan authentication harus menambahkan options: { auth: 'jwt' }
  // server.auth.default('jwt');

  await server.register([
    {
      plugin: auth,
      options: {
        service: authService,
        validator: AuthValidator,
        refreshTokenService,
      },
    },
    {
      plugin: authentications,
      options: {
        authService,
        usersService: authService,
        refreshTokenService,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: subjects,
      options: {
        service: subjectsService,
        validator: SubjectsValidator,
      },
    },
    {
      plugin: classes,
      options: {
        service: classesService,
        validator: ClassesValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        classesService,
        validator: ClassesValidator,
      },
    },
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

    // Penanganan error authentication (401)
    if (response.isBoom && response.output.statusCode === 401) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Token tidak valid atau sudah expired',
      });
      newResponse.code(401);
      return newResponse;
    }

    // Penanganan error authorization (403)
    if (response instanceof AuthorizationError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(403);
      return newResponse;
    }

    // Penanganan error authentication dari service
    if (response instanceof AuthenticationError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(401);
      return newResponse;
    }

    // Penanganan error validasi (400 Bad Request)
    if (
      (response instanceof Error && response.name === 'InvariantError') ||
      (response && response.isJoi)
    ) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message || 'Data tidak valid',
      });
      newResponse.code(400);
      return newResponse;
    }

    // Penanganan error duplicate username
    if (
      response instanceof Error &&
      response.message &&
      response.message.includes('Username sudah digunakan')
    ) {
      const newResponse = h.response({
        status: 'fail',
        message: 'Username sudah digunakan',
      });
      newResponse.code(400);
      return newResponse;
    }

    // Penanganan client error (400, 404)
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // Penanganan not found error (404)
    if (response instanceof NotFoundError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    // Penanganan server error (500)
    if (response.isBoom && response.output.statusCode === 500) {
      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
