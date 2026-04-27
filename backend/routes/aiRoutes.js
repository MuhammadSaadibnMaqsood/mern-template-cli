import express from "express";
import { chat } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: AI
 *     description: AI assistant endpoints
 */

/**
 * @swagger
 * /api/ai/chat:
 *   post:
 *     summary: Send a prompt to OpenAI and get a reply
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [prompt]
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: Explain JWT in simple words
 *     responses:
 *       200:
 *         description: AI response generated
 *       400:
 *         description: Prompt missing or OpenAI key missing
 *       401:
 *         description: Missing or invalid token
 */
router.post("/chat", protect, chat);

export default router;
