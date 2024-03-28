import { IVideo } from "@vb/types/video";
import React, { useState, useRef, useEffect } from "react";
import {
  AiFillPlayCircle,
  AiFillPauseCircle,
  AiOutlineFullscreenExit,
  AiOutlineFullscreen,
} from "react-icons/ai";

interface IVideoPlayer {
  videoData: IVideo;
  width: string;
  height: string;
  id?: number;
}

interface HTMLVideoElementRef extends HTMLVideoElement {
  mozRequestFullScreen?: () => Promise<void>;
  webkitRequestFullscreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

const Player = (props: IVideoPlayer): JSX.Element => {
  const { videoData, width, height } = props;
  const videoRef = useRef<HTMLVideoElementRef | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const videoElement = videoRef?.current;

    if (videoElement) {
      const handleTimeUpdate = () => {
        setCurrentTime(videoElement.currentTime);
      };

      const handleDurationChange = () => {
        // TODO: Need to make it synchronous
        setDuration(videoElement.duration);
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

  const handlePlayPause = () => {
    // if (videoRef?.current?.paused) {
    //   videoRef.current.play();
    //   setIsPlaying(true);
    // } else {
    //   videoRef?.current?.pause();
    //   setIsPlaying(false);
    // }
  };

  const goFullscreen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef?.current?.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef?.current?.webkitRequestFullscreen) {
        videoRef.current?.webkitRequestFullscreen();
      } else if (videoRef?.current?.msRequestFullscreen) {
        videoRef.current?.msRequestFullscreen();
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      style={{ width: width + "px", height: "auto" }}
      className={"relative"}
      onClick={handlePlayPause}
    >
      <video
        controls
        id="video-element"
        ref={videoRef}
        width={width}
        height={height}
        className="cursor-pointer"
      >
        <source src={videoData.source} type="video/mp4" />
        <p>Your Browser does not support .mp4 video</p>
      </video>
      <p>{videoData.title}</p>
      <button className="flex " onClick={handlePlayPause}>
        {isPlaying ? <AiFillPauseCircle /> : <AiFillPlayCircle />}
      </button>
      <button onClick={goFullscreen}>
        {!isFullScreen ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
      </button>
      <div className="absolute bottom-0 right-0 p-2 bg-gray-800 text-white">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default Player;
