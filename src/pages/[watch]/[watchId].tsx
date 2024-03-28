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
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 m-[20px]">
        <Player
          videoData={video.videoData}
          width="800"
          height="500"
          id={video.videoData.id}
        />
        <p className="text-xl font-semibold mb-2">{video.videoData.title}</p>
        <p className="text-gray-700">{video.videoData.description}</p>
      </div>
      <div className="md:w-1/2">
        <Playlist videos={mediaJSON.videos} playVideo={handleClick} />
      </div>
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
