// auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';

const router = express.Router();

// Mock user data for demonstration purposes
const users = [
  {
    id: 1,
    username: 'user1',
    password: '$2b$10$27WU4ix2veXC2uYxMvFRuujbm37LLJYpT1wy8OKxqbp/XJ4yBamTS', // hashed password: "password123"
  },
];

// Function to generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, {
    expiresIn: config.jwtExpiration,
  });
}

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find((user) => user.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Generate and send JWT token
  const token = generateToken(user);
  res.json({ token });
});

module.exports = router;
