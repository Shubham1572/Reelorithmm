import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = (global as any).mongooseCache || { conn: null, promise: null };

if (!(global as any).mongooseCache) {
  (global as any).mongooseCache = cached;
}

function getMongoUri(): string | null {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;
  if (uri && uri.trim().length > 0) {
    const trimmed = uri.trim();
    // In Vercel or production environment, prevent pointing to localhost/127.0.0.1
    if ((process.env.VERCEL || process.env.NODE_ENV === "production") && (trimmed.includes("localhost") || trimmed.includes("127.0.0.1"))) {
      console.error("[Database] Error: Production MONGODB_URI points to localhost. A cloud database (such as MongoDB Atlas) is required in Vercel.");
      return null;
    }
    return trimmed;
  }
  // In Vercel or production environment, never guess or fall back to localhost
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return null;
  }
  // Local development default fallback
  return "mongodb://127.0.0.1:27017/reelorithmm";
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  const uri = getMongoUri();
  if (!uri) {
    console.error("[Database] Error: No MongoDB connection string found. Set MONGODB_URI (or MONGO_URI) in environment variables.");
    return null;
  }

  // Check if existing connection is alive and ready (readyState === 1: connected)
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If connection is in stale/disconnected state (0: disconnected, 3: disconnecting), reset cache
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 3) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // 10s cold-start tolerance for Atlas SRV/TLS
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    cached.conn = null;
    // Sanitize any potential URI/credentials from error output before logging
    const safeError = (e?.message || String(e)).replace(
      /mongodb(\+srv)?:\/\/[^@]+@/,
      "mongodb+srv://<credentials>@"
    );
    console.error("[Database] MongoDB connection failed:", safeError);
    return null;
  }

  return cached.conn;
}
