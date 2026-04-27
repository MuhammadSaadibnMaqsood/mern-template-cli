import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(" ");
  // #region agent log
  fetch('http://127.0.0.1:7505/ingest/ecd13297-541e-4abf-8993-df10bd5bd0af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'06cae8'},body:JSON.stringify({sessionId:'06cae8',runId:'pre-fix',hypothesisId:'H2',location:'backend/middleware/authMiddleware.js:5',message:'Auth header parse result',data:{authorizationPresent:Boolean(req.headers.authorization),tokenType:typeof token,isArray:Array.isArray(token),tokenPreview:Array.isArray(token)?token[0]:token},timestamp:Date.now()})}).catch(()=>{});
  // #endregion

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // #region agent log
    fetch('http://127.0.0.1:7505/ingest/ecd13297-541e-4abf-8993-df10bd5bd0af',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'06cae8'},body:JSON.stringify({sessionId:'06cae8',runId:'pre-fix',hypothesisId:'H2',location:'backend/middleware/authMiddleware.js:13',message:'Before jwt.verify',data:{tokenValueType:typeof token,isArray:Array.isArray(token)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user ID to the request object
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

export { protect };
