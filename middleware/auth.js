const jwt = require("jsonwebtoken");

// Middleware to handle user authentication
const authenticate = (req, res, next) => {
  // Extract the Authorization header
  const authHeader = req.headers.authorization;

  // Check for the presence of the Authorization header
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization header is required" });
  }

  // Ensure the header format is "Bearer <token>"
  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header must start with 'Bearer '" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;  // Attach the decoded user data to the request
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle token verification errors
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate;
