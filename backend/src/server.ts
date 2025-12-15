import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import multer from "multer";
import { pino } from "pino";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { panoramaRouter } from "@/api/panorama/panoramaRouter";
import { userRouter } from "@/api/user/userRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { connectDB } from "@/db/db";

const logger = pino({ name: "Server Start" });
const upload = multer({ storage: multer.memoryStorage() });
const app: Express = express();

connectDB();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/users", userRouter);
app.use("/panoramas", panoramaRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app, logger };
