import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import session from "express-session";
import { createServer } from "http";
import config from "./config";
import routes from "./routes";
import { errorHandler } from "./middleware/error.middleware";
import { initWsServer } from "./websocket/server";

const app: Application = express();
const httpServer = createServer(app);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(compression() as any);
app.use(morgan(config.env === "development" ? "dev" : "combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.env === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }) as any
);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api", routes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize WebSocket server
    initWsServer(httpServer);

    // Start listening
    httpServer.listen(config.server.port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   * Audit Pro SEO Backend Server is Running                ║
║                                                            ║
║   Environment: ${config.env.padEnd(37)}                    ║
║   Server URL:  ${config.server.url.padEnd(37)}             ║
║   Port:        ${config.server.port.toString().padEnd(37)} ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

// Start the server
startServer();

export default app;
