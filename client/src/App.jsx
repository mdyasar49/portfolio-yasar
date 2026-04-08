import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Server, Database, Globe } from 'lucide-react';
import './App.css';

function App() {
  const [serverMsg, setServerMsg] = useState('Checking server...');

  useEffect(() => {
    axios.get('http://localhost:5000/')
      .then(res => setServerMsg(res.data))
      .catch(err => setServerMsg('Server Offline'));
  }, []);

  return (
    <div className="container">
      <header>
        <h1>MERN Stack Boilerplate</h1>
        <p className="subtitle">Everything you need for React, Node, Express, and MongoDB.</p>
      </header>

      <section className="stack-grid">
        <div className="card">
          <Database className="icon" size={40} />
          <h3>MongoDB</h3>
          <p>Database - Use MongoDB URI to persist your data.</p>
        </div>
        <div className="card">
          <Server className="icon" size={40} />
          <h3>Express & Node</h3>
          <p>The backend server for your API routes.</p>
        </div>
        <div className="card">
          <Layout className="icon" size={40} />
          <h3>React JS</h3>
          <p>Vite-powered frontend for a seamless experience.</p>
        </div>
      </section>

      <div className="status">
        <Globe className="status-icon" size={20} />
        <span>Backend Status: <strong>{serverMsg}</strong></span>
      </div>

      <footer className="footer">
        <p>Built for a MERN Stack Developer</p>
      </footer>
    </div>
  );
}

export default App;
