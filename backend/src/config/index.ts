import dotenv from "dotenv";

dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

interface ServerConfig {
  host: string;
  port: number;
  url: string;
}

interface CrawlerConfig {
  threads: number;
  timeoutHours: number;
  randomDelayMs: number;
  userAgent: string;
}

interface Config {
  env: string;
  database: DatabaseConfig;
  server: ServerConfig;
  session: {
    secret: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  crawler: CrawlerConfig;
  cors: {
    origin: string;
  };
}

const config: Config = {
  env: process.env.NODE_ENV || "development",

  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    database: process.env.DB_NAME || "audit_pro_seo",
    user: process.env.DB_USER || "audit_pro_seo",
    password: process.env.DB_PASSWORD || "audit_pro_seo",
  },

  server: {
    host: process.env.SERVER_HOST || "0.0.0.0",
    port: parseInt(process.env.PORT || "3000", 10),
    url: process.env.SERVER_URL || "http://localhost:3000",
  },

  session: {
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "your-jwt-secret-change-this",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  crawler: {
    threads: parseInt(process.env.CRAWLER_THREADS || "2", 10),
    timeoutHours: parseInt(process.env.CRAWLER_TIMEOUT_HOURS || "2", 10),
    randomDelayMs: parseInt(process.env.CRAWLER_RANDOM_DELAY_MS || "1500", 10),
    userAgent:
      process.env.CRAWLER_USER_AGENT ||
      "AuditProSEO/1.0 (+https://auditproseo.com)",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
};

export default config;
