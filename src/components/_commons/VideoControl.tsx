// components/VideoControl.js
"use client"

import React, { useState, useRef, useEffect } from "react";

const VideoControl = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (value) => {
    if (videoRef.current) {
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percentage);

    }
  };

  const handleProgressChange = (e) => {
    if (videoRef.current) {
      const time = (e.target.value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setTimeout(() => {
        console.log('set', time, videoRef.current.currentTime);
      }, 100);
      setProgress(e.target.value);
    }
  };


  const handleVolumeChange = (e) => {
    if (videoRef.current) {
      setVolume(e.target.value / 100);
      videoRef.current.volume = e.target.value / 100;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
      videoRef.current.muted = !isMuted;
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!isFullScreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullScreen(!isFullScreen);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  return (
    <div className="relative w-full bg-black" style={{ paddingTop: "56.25%" }}>
      <video
        className="absolute top-0 left-0 w-full h-full object-contain"
        ref={videoRef}
        src={videoSrc}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-2 flex items-center">
        <button onClick={togglePlay} className="text-white px-2">
          {isPlaying ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="flex-grow mx-2"
        />
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
          className="w-20 mx-2"
        />
        <button onClick={toggleMute} className="text-white px-2">
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button onClick={toggleFullScreen} className="text-white px-2">
          {isFullScreen ? "Fullscreen" : "Exit Fullscreen"}
        </button>
      </div>
    </div>
  );
};

export default VideoControl;
