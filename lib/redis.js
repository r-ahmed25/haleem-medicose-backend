import Redis from "ioredis"
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });



const redis = new Redis(process.env.UPSTASH_URL, { tls: {},maxRetriesPerRequest: null,});
redis.on('error', (err) => {
  console.error('Redis error:', err);
});


export default redis;