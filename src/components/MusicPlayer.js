// components/MusicPlayer.js
import React, { useState, useRef, useEffect } from 'react';
import './Music.css';

function MusicPlayer({ songs, currentSongIndex, setCurrentSongIndex }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const S3 = process.env.REACT_APP_S3_BUCKET;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
      audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      return () => {
        audio.removeEventListener('loadedmetadata', () => setDuration(audio.duration));
        audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      };
    }
  }, [songs, currentSongIndex]);

  const playPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (e) => {
    const audio = audioRef.current;
    audio.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const nextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  if (songs.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="music-player-bar">
      <div className="song-info">
        <img src={`https://`+S3+`.s3.amazonaws.com/${songs[currentSongIndex].tKey}`} alt="" />
        <div className="song-details">
          <h2>{songs[currentSongIndex].title}</h2>
          <p>{songs[currentSongIndex].name}</p>
        </div>
      </div>

      <div className="controls">
        <button className="backward" onClick={prevSong}>
          <i className="fa-solid fa-backward"></i>
        </button>
        <button className="play-pause-btn" onClick={playPause}>
          <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`} id="controlIcon"></i>
        </button>
        <button className="forward" onClick={nextSong}>
          <i className="fa-solid fa-forward"></i>
        </button>
      </div>

      <input
        type="range"
        value={currentTime}
        max={duration}
        onChange={handleProgress}
        id="progress"
        className="progress-bar"
      />

      <audio ref={audioRef} src={`https://`+S3+`.s3.amazonaws.com/${songs[currentSongIndex].mKey}`}></audio>
    </div>
  );
}

export default MusicPlayer;
