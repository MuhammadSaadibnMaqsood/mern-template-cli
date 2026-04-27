import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";


// 1. Rate limiter 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes"
});

// 2. Data Sanitization: Prevents NoSQL Injection (e.g., {"$gt": ""})
const sanitizeData = mongoSanitize();

// 3. Helmet: Sets various HTTP headers for security
const securityHeaders = helmet();

export { limiter, sanitizeData, securityHeaders };

