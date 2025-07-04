const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Hapi = require('@hapi/hapi');
const jwt = require('@hapi/jwt');
const inert = require('@hapi/inert');
const fs = require('fs');

// Import only needed modules
const auth = require('./api/auth');
const users = require('./api/users');
const complaints = require('./api/complaints');

// Import only needed services
const AuthService = require('./services/AuthService');
const UsersService = require('./services/UsersService');
const ComplaintsService = require('./services/ComplaintsService');

// Import validators
const AuthValidator = require('./validator/auth');
const UsersValidator = require('./validator/users');
const ComplaintsValidator = require('./validator/complaints');

const ClientError = require('./exceptions/ClientError');
const NotFoundError = require('./exceptions/NotFoundError');
const AuthenticationError = require('./exceptions/AuthenticationError');
const AuthorizationError = require('./exceptions/AuthorizationError');

const init = async () => {
  console.log('🚀 Initializing School Complaints System v2.0...');

  // Initialize only needed services
  let authService, usersService, complaintsService;

  try {
    authService = new AuthService();
    console.log('✅ AuthService initialized');

    usersService = new UsersService();
    console.log('✅ UsersService initialized');

    complaintsService = new ComplaintsService();
    console.log('✅ ComplaintsService initialized');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
        additionalHeaders: ['cache-control', 'x-requested-with'],
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
    complaintsService,
    validator: {
      validateLoginPayload: AuthValidator.validateLoginPayload,
      validateRegisterPayload: AuthValidator.validateRegisterPayload,
      validateRefreshTokenPayload: AuthValidator.validateRefreshTokenPayload,
      validateUserPayload: UsersValidator.validateUserPayload,
      validateComplaintPayload: ComplaintsValidator.validateComplaintPayload,
    },
  };

  // Test database connection before continuing

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

  // Register only needed plugins
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
  console.log(`📡 Backend Server: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
