// utils.js
import Poll from './models/Poll';

// Function to get all poll results
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

module.exports = { getPollResults };
