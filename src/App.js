import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HomePage from "./HomePage/HomePage";
import Modal from 'react-modal';



// Modal.setAppElement('#root')

function App() {
  return (
    <div className="App">
        <HomePage></HomePage>
    </div>
  );
}

export default App;
