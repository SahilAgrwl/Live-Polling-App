import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import mongoose from 'mongoose';
import Poll from '../models/Poll';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 5000;

mongoose.connect('mongodb://sahil45637:ouZY5iDURkYnGZ4j@ac-shumvql-shard-00-00.hyesnuw.mongodb.net:27017,ac-shumvql-shard-00-01.hyesnuw.mongodb.net:27017,ac-shumvql-shard-00-02.hyesnuw.mongodb.net:27017/?ssl=true&replicaSet=atlas-owypdi-shard-0&authSource=admin&retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('newPollCreated', async () => {
    // Emit event to all connected clients to update poll results
    io.emit('updateResults', await getPollResults());
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

app.use(express.json());

app.post('/api/polls', async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({ question, options });
    await poll.save();

    // Emit event to all connected clients to update poll results
    io.emit('updateResults', await getPollResults());

    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/polls', async (req, res) => {
  try {
    const polls = await Poll.find({});
    res.status(200).json(polls);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/poll-results', async (req, res) => {
  try {
    const pollResults = await getPollResults();
    res.status(200).json(pollResults);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/polls/:id/vote', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const { optionIndex } = req.body;
    if (!poll.options[optionIndex]) {
      return res.status(400).json({ error: 'Invalid option index' });
    }

    poll.options[optionIndex].votes += 1;
    await poll.save();

    // Emit event to all connected clients to update poll results
    io.emit('updateResults', await getPollResults());

    res.status(200).json(poll);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

async function getPollResults() {
  const polls = await Poll.find({});
  return polls.map((poll) => ({
    id: poll._id,
    question: poll.question,
    options: poll.options.map((option) => ({
      optionText: option.optionText,
      votes: option.votes,
    })),
  }));
}

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
