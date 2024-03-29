import React, { useState } from "react";
import { mediaJSON } from "@vb/data/mediaData";
import Player from "@vb/components/player/player";
import Router from "next/router";
import Playlist from "@vb/components/playlist/playlist";
import { IVideo } from "@vb/types/video";
import { useRouter } from "next/router";
import { usePlaylist } from "@vb/context/playlistProvider";
import { Utils } from "@vb/utils/utils";

interface IWatch {
  videoData: IVideo;
}

export default function Watch({ videoData }: IWatch) {
  const router = useRouter();
  const [video, setVideo] = useState({ videoData });
  const { playlist, setPlaylist } = usePlaylist();

  const handleClick = async (id: number) => {
    const newVideoData = mediaJSON.videos[id - 1];
    setVideo({ videoData: newVideoData });
    await router.push(`/watch/${newVideoData.id}`);
    window.location.reload();
  };

  const getNextVideo = (currentVideoIndex: number): number => {
    const currentIndexInPlaylist = playlist.findIndex(
      (video) => video.id === currentVideoIndex
    );

    if (currentIndexInPlaylist === -1) return 1;

    const nextIndex = (currentIndexInPlaylist + 1) % playlist.length;
    return playlist[nextIndex].id;
  };

  const handleVideoEnd = async () => {
    const currentVideoIndex = video.videoData.id;

    const nextVideoIndex = getNextVideo(currentVideoIndex);
    await router.push(`/watch/${nextVideoIndex}`);
    window.location.reload();
  };

  const handleReorder = (updatedPlaylist: IVideo[]) => {
    setPlaylist(updatedPlaylist);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/2 m-[20px]">
        <Player
          videoData={video.videoData}
          width="800"
          height="500"
          id={video.videoData.id}
          onVideoEnd={handleVideoEnd}
        />
        <p className="font-semibold mb-2 text-2xl mt-2 md:text-3xl">
          {video.videoData.title}
        </p>
        <p className="mb-2 text-md mt-2 md:text-xl">
          {video.videoData.subtitle}
        </p>
        <p className="text-gray-700">{video.videoData.description}</p>
      </div>
      <div className="md:w-1/2">
        <Playlist playVideo={handleClick} onReorder={handleReorder} />
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
