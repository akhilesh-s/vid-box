/* eslint-disable react-hooks/exhaustive-deps */
import { usePlaylist } from "@vb/context/playlistProvider";
import { IVideo } from "@vb/types/video";
import React, { useState, useRef, useEffect } from "react";
import {
  AiFillPlayCircle,
  AiFillPauseCircle,
  AiOutlineFullscreenExit,
  AiOutlineFullscreen,
} from "react-icons/ai";
import {
  BsFillVolumeMuteFill,
  BsFillVolumeUpFill,
  BsFillVolumeDownFill,
} from "react-icons/bs";

interface IVideoPlayer {
  videoData: IVideo;
  width: string;
  height: string;
  id?: number;
  onVideoEnd: () => void;
}

interface HTMLVideoElementRef extends HTMLVideoElement {
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
  }
}

const Player = (props: IVideoPlayer): JSX.Element => {
  const { videoData, width, height, onVideoEnd } = props;
  const videoRef = useRef<HTMLVideoElementRef | null>(null);
  const { playlist, setPlaylist, autoplay } = usePlaylist();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const handlePlayPause = () => {
    if (videoRef?.current?.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef?.current?.pause();
      setIsPlaying(false);
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef?.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const increaseVolume = () => {
    if (volume < 100) {
      setVolume(volume + 10);
    }
  };

  const decreaseVolume = () => {
    if (volume > 0) {
      setVolume(volume - 10);
    }
  };

  const goFullscreen = () => {
    if (!isFullScreen && videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef?.current?.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef?.current?.webkitRequestFullscreen) {
        videoRef.current?.webkitRequestFullscreen();
      } else if (videoRef?.current?.msRequestFullscreen) {
        videoRef.current?.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(100);
    }
  };

  useEffect(() => {
    const videoElement = videoRef?.current;

    if (videoElement) {
      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
        setDuration(videoElement.duration);
      };

      const handleDurationChange = async () => {
        setDuration(videoElement.duration);
        // if (videoData.progress) setCurrentTime(videoData.progress);
      };

      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("loadedmetadata", handleDurationChange);

      return () => {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener(
          "loadedmetadata",
          handleDurationChange
        );
      };
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (autoplay) {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  }, [autoplay]);

  useEffect(() => {
    setTimeout(() => {
      const updatedPlaylistWithProgress = playlist.map((video) => {
        if (video.id === videoData.id) {
          return { ...video, progress };
        }
        return video;
      });

      setPlaylist(updatedPlaylistWithProgress);
    }, 10000);
  }, [progress]);

  useEffect(() => {
    const handleKeyboardEvents = (event: KeyboardEvent) => {
      switch (event.key) {
        case " ":
          event.preventDefault();
          handlePlayPause();
          break;
        case "ArrowRight":
          skipTime(10);
          break;
        case "ArrowLeft":
          skipTime(-10);
          break;
        case "ArrowUp":
          event.preventDefault();
          increaseVolume();
          break;
        case "ArrowDown":
          event.preventDefault();
          decreaseVolume();
          break;
        case "f":
        case "F":
          goFullscreen();
          break;
        case "M":
        case "m":
          toggleMute();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyboardEvents);

    return () => {
      document.removeEventListener("keydown", handleKeyboardEvents);
    };
  }, [
    handlePlayPause,
    skipTime,
    increaseVolume,
    decreaseVolume,
    toggleMute,
    goFullscreen,
  ]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleVideoEnd = () => {
    if (onVideoEnd) {
      const updatedPlaylistWithProgress = playlist.map((video) => {
        if (video.id === videoData.id) {
          return { ...video, progress: 0 };
        }
        return video;
      });

      setPlaylist(updatedPlaylistWithProgress);
      onVideoEnd();
    }
  };

  const handleMouseEnter = () => {
    setShowControls(true);
  };

  const handleMouseExit = () => {
    setShowControls(false);
  };

  const handleProgress = (e: React.ChangeEvent<HTMLVideoElement>) => {
    const percentage = e.target.currentTime;

    setProgress(percentage);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const newTime = (parseFloat(e.target.value) * duration) / 100;

    setIsPlaying(false);
    const newTime = parseFloat(e.target.value);

    setCurrentTime(newTime);
    if (videoRef.current) videoRef.current.currentTime = newTime;
    setIsPlaying(true);
  };

  const getVolumeIcon = (): JSX.Element => {
    if (isMuted || volume === 0) return <BsFillVolumeMuteFill />;
    if (volume < 50) return <BsFillVolumeDownFill />;
    return <BsFillVolumeUpFill />;
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const options = [
    { value: 0.5, label: "0.5x" },
    { value: 0.75, label: "0.75x" },
    { value: 1, label: "1x" },
    { value: 1.25, label: "1.25x" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSpeed = parseFloat(e.target.value);
    handlePlaybackSpeedChange(selectedSpeed);
  };

  return (
    <div
      style={{ width: "auto", height: "auto" }}
      className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseExit}
      tabIndex={0}
    >
      <video
        id="video-element"
        ref={videoRef}
        width={width}
        height={height}
        muted={isMuted}
        onTimeUpdate={handleProgress}
        className="cursor-pointer w-full h-full object-cover"
        onEnded={handleVideoEnd}
        autoPlay
      >
        <source src={videoData.source} type="video/mp4" />
        <p>Your Browser does not support .mp4 video</p>
      </video>
      {showControls && (
        <div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="text-5xl text-white transition duration-300 ease-in-out hover:text-gray-300 focus:outline-none"
              onClick={handlePlayPause}
            >
              {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
            </button>
          </div>
          <div className="flex gap-1 items-center absolute left-0 bottom-0 w-full justify-center mb-2 p-1">
            <input
              id="default-range"
              type="range"
              step={1}
              className="w-full h-2 bg-gray-200 rounded-lg  cursor-pointer dark:bg-gray-700"
              max={duration}
              value={progress}
              onChange={handleSliderChange}
            ></input>

            <div className="p-1 text-white">
              <p className="flex flex-nowrap justify-center">
                {formatTime(currentTime)}/{formatTime(duration)}
              </p>
            </div>
            <div className="flex items-center">
              <button className="text-white" onClick={toggleMute}>
                {getVolumeIcon()}
              </button>
            </div>
            <div className="w-auto">
              <input
                type="range"
                max={100}
                step={1}
                className="w-full h-2 bg-gray-200 rounded-lg  cursor-pointer dark:bg-gray-700"
                value={volume}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setVolume(value);
                  setIsMuted(value === 0);
                }}
              />
            </div>
            <div className="relative">
              <select
                onChange={handleChange}
                value={playbackSpeed}
                className="rounded bg-slate-600 text-white"
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                className=" p-2 text-white transition duration-300 ease-in-out hover:text-gray-300 focus:outline-none"
                onClick={goFullscreen}
              >
                {!isFullScreen ? (
                  <AiOutlineFullscreen />
                ) : (
                  <AiOutlineFullscreenExit />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
