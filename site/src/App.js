import './App.css';
import { Amplify } from '@aws-amplify/core';
import { API } from 'aws-amplify';
import { config } from './Config';
import React, { useState, useEffect } from 'react';

Amplify.Logger.LOG_LEVEL = 'DEBUG';

function App() {
  const [randomNumber, setRandomNumber] = useState([]);
  useEffect(() => {
    async function getDemo() {
      const apiConfig = await config();
      API.configure(apiConfig);
      const randomNumberResult = await API.post('demoApi', 'demo', {
        body: {},
      });
      setRandomNumber(randomNumberResult);
    }
    getDemo();
  }, []);

  return (
    <div className="App">Your randomly generated number: {randomNumber}</div>
  );
}

export default App;
