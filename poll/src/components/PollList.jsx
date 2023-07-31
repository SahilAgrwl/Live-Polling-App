import React from 'react'

const PollList = ({ polls }) => {
  return (
    <div>
      <h2>Active Polls</h2>
      <ul>
        {polls.map((poll) => (
          <li key={poll._id}>
            <strong>{poll.question}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollList
