import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [createResult, setCreateResult] = useState('');

  // Fetch data from the GetData service
  useEffect(() => {
    axios({
      method: 'post',
      url: '/DataService/GetData',
      headers: {
        'Content-Type': 'application/grpc-web-text',
      },
      data: '', // Empty message for the Empty request
    })
      .then((response) => {
        const decodedMessage = atob(response.data).split('\n')[1];
        const jsonMessage = JSON.parse(decodedMessage);
        setMessage(jsonMessage.message);
      })
      .catch((error) => {
        console.error('Error fetching data from gRPC server:', error);
      });
  }, []);

  // Call the CreateData service
  const handleCreateData = () => {
    const requestMessage = btoa(JSON.stringify({
      data: "Hello from Vite + React"
    }));

    axios({
      method: 'post',
      url: 'http://localhost:8080/AnotherService/CreateData',
      headers: {
        'Content-Type': 'application/grpc-web-text',
      },
      data: requestMessage,
    })
      .then((response) => {
        const decodedMessage = atob(response.data).split('\n')[1];
        const jsonMessage = JSON.parse(decodedMessage);
        setCreateResult(jsonMessage.result);
      })
      .catch((error) => {
        console.error('Error creating data:', error);
      });
  };

  return (
    <div className="App">
      <h1>gRPC + Vite + React</h1>
      <p>Message from GetData: {message}</p>
      <button onClick={handleCreateData}>Call CreateData</button>
      <p>Result from CreateData: {createResult}</p>
    </div>
  );
}

export default App;
