import jwt from 'jsonwebtoken';  // Default import for jsonwebtoken
import dotenv from 'dotenv';  // Import dotenv
dotenv.config();  // Load environment variables from the .env file

 export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];  // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Use the verify method from jsonwebtoken
    req.user = decoded;  // Attach user data to the request object
    next();  // Proceed to the next middleware/route handler
  } catch (err) {
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
};

export default authenticate;
