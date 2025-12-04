const allowedOrigins = [
  // Frontend DEV
  "http://localhost",
  "https://localhost",
  "http://localhost:5173",
  "https://localhost:5173",
  "http://localhost:5174",
  "https://localhost:5174",
  "http://localhost:5175",
  "https://localhost:5175",

  // Android Emulator
  "http://10.0.2.2",
  "https://10.0.2.2",
  "http://10.0.2.2:5173",
  "https://10.0.2.2:5173",

  // LAN
  "http://192.168.29.162:5000",
  "https://192.168.29.162:5000",
  "http://192.168.29.162:5173",
  "https://192.168.29.162:5173",

  // Mobile / Capacitor
  "capacitor://localhost",
  "ionic://localhost",
  "file://",
  "null",

  // Production
  "https://haleem-medicose-backend.onrender.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS request from:", origin);

    // mobile apps / postman
    if (!origin || origin === "null") {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // DO NOT BREAK APP - allow but log
    console.warn("CORS allowed (not in list):", origin);
    return callback(null, true);
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

export default corsOptions;
