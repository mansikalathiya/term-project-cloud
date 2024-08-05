// components/LeftContent.js
import React from 'react';
import './LeftContent.css'; // Make sure to import the CSS file

function LeftContent({ songs, setCurrentSongIndex }) {
  return (
    <div className="left-content">
      {songs.map((song, index) => (
        <div
          key={index}
          className="song-card"
          onClick={() => setCurrentSongIndex(index)}
        >
          <img src={`https://mansimusic.s3.amazonaws.com/${song.tKey}`} alt={song.title} />
          <h3>{song.title}</h3>
          <p>{song.name}</p>
        </div>
      ))}
    </div>
  );
}

export default LeftContent;
