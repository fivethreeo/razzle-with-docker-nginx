import './App.css';

if (process.env.BUILD_TARGET==='client') {
const Worker = require('./test.worker');

const worker = new Worker();
worker.postMessage({ a: 1 });

}

import React from 'react';
const App = () => <div>Welcome to Razzle.</div>;

export default App;
