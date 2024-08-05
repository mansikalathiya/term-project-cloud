// App.js
import React from 'react';
import SignupForm from './components/SignUp';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import ProfilePic from './components/ProfilePic';
import './App.css';
import Otp from './components/Otp';
import LandingPage from './Pages/LandingPage';
import Login from './components/Login';
import UploadMusic from './Pages/UploadMusic';
import { Auth } from './context/AuthContext';

function App() {
  return (
    <main>
    <Auth>
    <Router>
    <Routes>
    <Route path='/' element={<SignupForm/>}/>
    <Route path='/otp' element={<Otp/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/landing-page' element={<LandingPage/>}/>
    <Route path='/profile-pic' element={<ProfilePic/>}/>
    <Route path='/upload' element={<UploadMusic/>}/>
     </Routes>
    </Router>
    </Auth>
    </main>
  );
}

export default App;