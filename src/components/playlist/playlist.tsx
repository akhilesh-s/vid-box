import React from "react";
import { IVideo } from "@vb/types/video";
import Video from "../video/video";

interface IPlaylist {
  videos: IVideo[];
  playVideo: (id: number) => void;
}

const Playlist = (props: IPlaylist): JSX.Element => {
  const { videos, playVideo } = props;

  const handleClick = (id: number) => {
    playVideo(id);
  };

  return (
    <div>
      {videos.map((video, index) => (
        <Video
          id={video.id}
          key={index}
          thumb={video.thumb}
          source={video.source}
          duration={video.duration}
          playOnClick={handleClick}
          title={video.title}
          description={video.description}
        />
      ))}
    </div>
  );
};

export default Playlist;
