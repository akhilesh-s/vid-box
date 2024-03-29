import Playlist from "@vb/components/playlist/playlist";
import { usePlaylist } from "@vb/context/playlistProvider";
import { IVideo } from "@vb/types/video";
import Router from "next/router";

export default function Home() {
  const { setPlaylist } = usePlaylist();

  const handleClick = (id: number) => {
    Router.push(`/watch/${id}`);
  };

  const handleReorder = (updatedPlaylist: IVideo[]) => {
    setPlaylist(updatedPlaylist);
  };

  return (
    <main>
      <div>
        <Playlist playVideo={handleClick} onReorder={handleReorder} />
      </div>
    </main>
  );
}
