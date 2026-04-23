require("dotenv").config();

const express = require("express");
const {
  securityHeaders,
  sanitizeData,
  limiter,
} = require("./middleware/security");
const swaggerSpec = require("./utils/swagger");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const connectDb = require("./config/db");
const app = express();

app.use(securityHeaders);
app.use(sanitizeData);
app.use(express.json());
app.use("/api", limiter);
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
if (process.env.REDIS_URL) connectRedis();
connectDb();

// Routs
app.get("/", (req, res) => res.send("API Shield Active 🛡️"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SERVER RUNNING ON ${PORT}`));
