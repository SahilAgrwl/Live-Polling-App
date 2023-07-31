import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect } from 'react'
import io from 'socket.io-client'
import PollForm from './components/PollForm'
import PollList from './components/PollList'
import PollResult from './components/PollResult'

const socket = io('http://localhost:5000');

function App() {
    const [polls, setPolls] = useState([]);
  const [pollResults, setPollResults] = useState([]);

  useEffect(() => {
    // Fetch all polls and poll results on component mount
    fetchPolls();
    fetchPollResults();

    // Listen for real-time updates
    socket.on('updateResults', (updatedResults) => {
      setPollResults(updatedResults);
    });
  }, []);

  async function fetchPolls() {
    try {
      const response = await fetch('/api/polls');
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      console.error('Error fetching polls:', error);
    }
  }

  async function fetchPollResults() {
    try {
      const response = await fetch('/api/poll-results');
      const data = await response.json();
      setPollResults(data);
    } catch (error) {
      console.error('Error fetching poll results:', error);
    }
  }

  return (
       <div className="App">
      <h1>Real-Time Polling App</h1>
      <PollForm socket={socket} />
      <PollList polls={polls} />
      <PollResult pollResults={pollResults} />
    </div>
  )
}

export default App
