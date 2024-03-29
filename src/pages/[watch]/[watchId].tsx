import React, { useState } from "react";
import { mediaJSON } from "@vb/data/mediaData";
import Player from "@vb/components/player/player";
import Router from "next/router";
import Playlist from "@vb/components/playlist/playlist";
import { IVideo } from "@vb/types/video";
import { useRouter } from "next/router";

interface IWatch {
  videoData: IVideo;
}

export default function Watch({ videoData }: IWatch) {
  const router = useRouter();
  const [video, setVideo] = useState({ videoData });
  const [playlistVideos, setPlaylistVideos] = useState<IVideo[]>(
    mediaJSON.videos
  );

  const handleClick = async (id: number) => {
    const newVideoData = mediaJSON.videos[id - 1];
    setVideo({ videoData: newVideoData });
    await router.push(`/watch/${newVideoData.id}`);
    router.reload();
  };

  const handleVideoEnd = () => {
    const currentVideoIndex = video.videoData.id;
    const nextVideoIndex = (currentVideoIndex % mediaJSON.videos.length) + 1;
    router.push(`/watch/${nextVideoIndex - 1}`);
    router.reload();
  };

  const handleReorder = (updatedPlaylist: IVideo[]) => {
    setPlaylistVideos(updatedPlaylist);
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
        <p className="text-xl font-semibold mb-2">{video.videoData.title}</p>
        <p className="text-gray-700">{video.videoData.description}</p>
      </div>
      <div className="md:w-1/2">
        <Playlist
          videos={playlistVideos}
          playVideo={handleClick}
          onReorder={handleReorder}
        />
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
