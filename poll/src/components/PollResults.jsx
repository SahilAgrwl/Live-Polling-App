import React from 'react'

const PollResult = ({ pollResults }) => {
  return (
    <div>
      <h2>Live Results</h2>
      <ul>
        {pollResults.map((poll) => (
          <li key={poll.id}>
            <strong>{poll.question}</strong>
            <ul>
              {poll.options.map((option, index) => (
                <li key={index}>
                  {option.optionText}: {option.votes}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollResult
