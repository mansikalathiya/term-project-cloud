// components/RightContent.js
import React from 'react';
import MusicPlayer from './MusicPlayer';

function RightContent({ songs, currentSongIndex, setCurrentSongIndex }) {
  return (
    <div className="right-content">
      <MusicPlayer 
        songs={songs} 
        currentSongIndex={currentSongIndex} 
        setCurrentSongIndex={setCurrentSongIndex} 
      />
    </div>
  );
}

export default RightContent;
