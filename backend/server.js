import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { securityHeaders, sanitizeData, limiter } from "./middleware/security.js";
import swaggerSpec from "./utils/swagger.js";
import connectDb from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
const app = express();

app.use(securityHeaders);
app.use(sanitizeData);
app.use(express.json());
app.use("/api", limiter);
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
if (process.env.REDIS_URL) connectRedis();
connectDb();

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => res.send("API Shield Active 🛡️"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SERVER RUNNING ON ${PORT}`));
