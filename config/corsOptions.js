const allowedOrigins = [
  "http://localhost",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://10.0.2.2",
  "http://10.0.2.2:5173",
  "capacitor://localhost",
  "ionic://localhost",
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS check for origin:", origin);

    // Allow mobile apps or Postman
    if (!origin || origin === "null") {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // IMPORTANT: DO NOT BLOCK — ALLOW IT
    return callback(null, true);
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
};

export default corsOptions;
