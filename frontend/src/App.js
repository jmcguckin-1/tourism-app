import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from 'react';
import { initializeApp } from "firebase/app";
import { Routes, Route } from 'react-router-dom';
import Profile from "./pages/Profile.js";
import BookingPlanner from "./pages/Bookings.js";
import FlightPlanner from "./pages/FlightPlanner.js";
import SignIn from "./pages/SignIn.js";
import Login from "./pages/Login.js";

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

  return (
        <Routes>
        <Route path='/' element={<SignIn/>} />
        <Route path='/login' element={<Login/>} />
    <Route path='/bookings' element={<BookingPlanner />} />
      <Route path='/flights' element={<FlightPlanner />}/>
    <Route path='/profile' element={<Profile />}/>
  </Routes>
  );
}

export default App;
