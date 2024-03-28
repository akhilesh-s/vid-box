import React, { useState } from "react";
import { mediaJSON } from "@vb/data/mediaData";
import Player from "@vb/components/player/player";
import Router from "next/router";
import Playlist from "@vb/components/playlist/playlist";
import { IVideo } from "@vb/types/video";

interface IWatch {
  videoData: IVideo;
}

export default function Watch({ videoData }: IWatch) {
  const [video, setVideo] = useState({ videoData });

  const handleClick = (id: number) => {
    const newVideoData = mediaJSON.videos[id];
    setVideo({ videoData: newVideoData });
    Router.push(`/watch/${newVideoData.id - 1}`);
  };

  return (
    <div>
      <Player
        videoData={video.videoData}
        width="500"
        height="500"
        id={video.videoData.id}
      />
      <Playlist videos={mediaJSON.videos} playVideo={handleClick} />
    </div>
  );
}

export async function getServerSideProps({
  params,
}: {
  params: { watchId: string };
}) {
  const videoIndex = parseInt(params.watchId);
  const videoData = mediaJSON.videos[videoIndex - 1];

  return {
    props: {
      videoData,
    },
  };
}
