const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');
const inert = require('@hapi/inert');
const fs = require('fs');

// Import simplified modules
const auth = require('./api/auth');
const users = require('./api/users');
const complaints = require('./api/complaints');

// Import data modules (subjects, classes)
const subjects = require('./api/data/subjects');
const classes = require('./api/data/classes');

// Import simplified services
const AuthService = require('./services/AuthService');
const UsersService = require('./services/UsersService');
const DataService = require('./services/DataService');
const ComplaintsService = require('./services/ComplaintsService');

// Import legacy services
const SubjectsService = require('./services/postgres/SubjectsService');
const ClassesService = require('./services/postgres/ClassesService');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const ActivitiesService = require('./services/postgres/ActivitiesService');

// Import validators
const AuthValidator = require('./validator/auth');
const UsersValidator = require('./validator/users');
const ComplaintsValidator = require('./validator/complaints');
const SubjectsValidator = require('./validator/subjects');
const ClassesValidator = require('./validator/classes');

const ClientError = require('./exceptions/ClientError');
const NotFoundError = require('./exceptions/NotFoudError');
const AuthenticationError = require('./exceptions/AuthenticationError');
const AuthorizationError = require('./exceptions/AuthorizationError');

const init = async () => {
  // Initialize simplified services
  const authService = new AuthService();
  const usersService = new UsersService();
  const dataService = new DataService();
  const complaintsService = new ComplaintsService();

  // Initialize legacy services for data management
  const subjectsService = new SubjectsService();
  const activitiesService = new ActivitiesService();
  const collaborationsService = new CollaborationsService();
  const classesService = new ClassesService(
    collaborationsService,
    activitiesService
  );

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Make services available to handlers
  server.app = {
    authService,
    usersService,
    dataService,
    complaintsService,
    validator: {
      validateLoginPayload: AuthValidator.validateLoginPayload,
      validateRegisterPayload: AuthValidator.validateRegisterPayload,
      validateRefreshTokenPayload: AuthValidator.validateRefreshTokenPayload,
      validateUserPayload: UsersValidator.validateUserPayload,
      validateComplaintPayload: ComplaintsValidator.validateComplaintPayload,
    },
  };

  // Register JWT plugin
  await server.register([jwt, inert]);

  // JWT authentication strategy
  const accessTokenKey =
    process.env.ACCESS_TOKEN_KEY || 'fallback-secret-key-for-development';

  if (!process.env.ACCESS_TOKEN_KEY) {
    console.warn(
      '⚠️  Warning: ACCESS_TOKEN_KEY not found in environment variables. Using fallback key.'
    );
    console.warn('⚠️  This is NOT secure for production use!');
  }

  server.auth.strategy('school_jwt', 'jwt', {
    keys: accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: parseInt(process.env.ACCESS_TOKEN_AGE) || 1800, // 30 minutes
    },
    validate: async (artifacts, request, h) => {
      const { decoded } = artifacts;

      try {
        const user = await usersService.getUserById(decoded.payload.userId);
        return {
          isValid: true,
          credentials: {
            userId: user.id,
            username: user.username,
            fullname: user.fullname,
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

  // Register simplified plugins
  await server.register([
    auth,
    users,
    {
      plugin: complaints,
      options: {
        service: complaintsService,
        validator: ComplaintsValidator,
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
      console.error(response);
      return newResponse;
    }

    // Jika tidak ada error, lanjutkan response
    return response.continue || response;
  });

  await server.start();
  console.log(`🚀 SIMPLIFIED SCHOOL COMPLAINTS SYSTEM v2.0`);
  console.log(`📡 Backend Server: ${server.info.uri}`);
  console.log(`🔧 Available endpoints:`);
  console.log(`  - POST /api/auth/login`);
  console.log(`  - POST /api/auth/register`);
  console.log(`  - GET /api/users`);
  console.log(`  - POST /api/users`);
  console.log(`  - GET /api/complaints`);
  console.log(`  - POST /api/complaints`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
