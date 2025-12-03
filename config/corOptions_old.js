// config/corsOptions.js
const allowedOrigins = [
   'http://localhost:5173',
   'http://localhost:5174',
   'http://localhost:5175',
   'http://192.168.29.162:5000'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin ||
  allowedOrigins.includes(origin) ||
  origin.startsWith('http://localhost')
) {
  callback(null, true);
} else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  // Include OPTIONS to allow preflight for Socket.IO polling and credentials
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
};

export default corsOptions;