import Playlist from "@vb/components/playlist/playlist";
import { mediaJSON } from "@vb/data/mediaData";
import Router from "next/router";

export default function Home() {
  const handleClick = (id: number) => {
    Router.push(`/watch/${id}`);
  };

  return (
    <main>
      <div>
        <Playlist videos={mediaJSON.videos} playVideo={handleClick} />
      </div>
    </main>
  );
}
