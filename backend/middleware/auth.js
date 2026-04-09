const { admin } = require('../firebaseAdmin');
const { sendError } = require('../utils/http');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Unauthorized: No token provided');
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token, true);
    req.user = decodedToken; // Make the user data available to our routes
    return next();
  } catch (error) {
    console.error("Error verifying auth token:", error);
    if (error?.code === 'auth/id-token-revoked') {
      return sendError(res, 401, 'Unauthorized: Token revoked');
    }

    if (error?.code === 'auth/id-token-expired') {
      return sendError(res, 401, 'Unauthorized: Token expired');
    }

    return sendError(res, 401, 'Unauthorized: Invalid token');
  }
};

module.exports = verifyToken;
