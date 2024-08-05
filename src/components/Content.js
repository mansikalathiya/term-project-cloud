// components/MusicApp.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LeftContent from './LeftContent';
import RightContent from './RightContent';
import { AuthContext } from '../context/AuthContext';

function MusicApp() {
  const URL = process.env.REACT_APP_API_BASE_URL;
  const { getSession } = useContext(AuthContext);
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchMusic = async () => {
      try {
        const data = await getSession();
        console.log('Session Data:', data);
        const retrievedToken = data.getIdToken().getJwtToken(); 
        setToken(retrievedToken);

        const response = await axios.post(URL + '/music', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + retrievedToken
          }
        });
        console.log('Music Data:', response);

        const musicData = response.data.body;
        setSongs(musicData);
      } catch (error) {
        console.error('Error fetching music:', error);
      }
    };
    
    fetchMusic();
  }, [URL, getSession]);

  return (
    <div className="music-app">
      <LeftContent songs={songs} setCurrentSongIndex={setCurrentSongIndex} />
      <RightContent songs={songs} currentSongIndex={currentSongIndex} setCurrentSongIndex={setCurrentSongIndex} />
    </div>
  );
}

export default MusicApp;
