import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { securityHeaders, sanitizeData, limiter } from "./middleware/security.js";
import swaggerSpec from "./utils/swagger.js";
import connectDb from "./config/db.js";
import { connectRedis } from "./config/redis.js";
const app = express();

// #region agent log
fetch('http://127.0.0.1:7505/ingest/ecd13297-541e-4abf-8993-df10bd5bd0af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'06cae8'},body:JSON.stringify({sessionId:'06cae8',runId:'pre-fix',hypothesisId:'H1_H4',location:'backend/server.js:15',message:'Server bootstrap state',data:{hasConnectRedisImport:typeof connectRedis!=='undefined',nodeVersion:process.version,hasFetch:typeof fetch==='function',redisUrlPresent:Boolean(process.env.REDIS_URL)},timestamp:Date.now()})}).catch(()=>{});
// #endregion

app.use(securityHeaders);
app.use(sanitizeData);
app.use(express.json());
app.use("/api", limiter);
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// #region agent log
fetch('http://127.0.0.1:7505/ingest/ecd13297-541e-4abf-8993-df10bd5bd0af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'06cae8'},body:JSON.stringify({sessionId:'06cae8',runId:'pre-fix',hypothesisId:'H1',location:'backend/server.js:24',message:'Before Redis connect branch',data:{redisUrlPresent:Boolean(process.env.REDIS_URL),canCallConnectRedis:typeof connectRedis==='function'},timestamp:Date.now()})}).catch(()=>{});
// #endregion
if (process.env.REDIS_URL) connectRedis();
connectDb();

// Routs
app.get("/", (req, res) => res.send("API Shield Active 🛡️"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SERVER RUNNING ON ${PORT}`));
