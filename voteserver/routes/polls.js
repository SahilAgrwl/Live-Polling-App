// routes/polls.js
import express from 'express';
import Poll from '../models/Poll';

const router = express.Router();

// Create a new poll
router.post('/', async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({ question, options });
    await poll.save();
    io.emit('updateResults', await getPollResults());
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
