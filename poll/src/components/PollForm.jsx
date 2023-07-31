import React, { useState } from 'react'
import axios from 'axios'

const PollForm = ({ socket }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleCreatePoll = async () => {
    try {
      const response = await axios.post('/api/polls', { question, options });
      if (response.status === 201) {
        setQuestion('');
        setOptions(['', '']);
        socket.emit('newPollCreated');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <div>
      <h2>Create New Poll</h2>
      <div>
        <label>Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>
      {options.map((option, index) => (
        <div key={index}>
          <label>{`Option ${index + 1}:`}</label>
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleAddOption}>Add Option</button>
      <button onClick={handleCreatePoll}>Create Poll</button>
    </div>
  );
};

export default PollForm
