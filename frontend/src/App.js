import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';
import { initializeApp } from "firebase/app";

function App() {

const firebaseConfig = {
  apiKey: "AIzaSyBUbMsNxAhGJK5YH74yduRr541hTGzYweI",
  authDomain: "tourism-app-fd1ae.firebaseapp.com",
  projectId: "tourism-app-fd1ae",
  storageBucket: "tourism-app-fd1ae.firebasestorage.app",
  messagingSenderId: "873999589760",
  appId: "1:873999589760:web:12ad72d61db5851dfd2165"
};

const app = initializeApp(firebaseConfig);

    const [name, setName] = useState("");
    useEffect(() => {
    fetch("/getDetails")
   .then(response => response.json())
   .then(data => {
        setName(data["name"]);
    })
    .catch(err => {
        console.log("error:" + err);
    })
    }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>{name}</p>
      </header>
    </div>
  );
}

export default App;
