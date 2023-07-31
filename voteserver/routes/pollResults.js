// routes/pollResults.js
import express from 'express';
import { getPollResults } from '../utils';

const router = express.Router();

// Get all poll results
router.get('/', async (req, res) => {
  try {
    const pollResults = await getPollResults();
    res.status(200).json(pollResults);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
