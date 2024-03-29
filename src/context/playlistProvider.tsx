import { IVideo } from "@vb/types/video";
import React, { useContext, createContext, useState, useEffect } from "react";
import { mediaJSON } from "@vb/data/mediaData";
import { Utils } from "@vb/utils/utils";

interface PlaylistContextType {
  playlist: IVideo[];
  setPlaylist: (playlist: IVideo[]) => void;
}

const PlaylistContext = createContext<PlaylistContextType>({
  playlist: mediaJSON.videos,
  setPlaylist: () => {},
});

export const usePlaylist = () => {
  return useContext(PlaylistContext);
};

interface IPlaylistProviderProps {
  children: React.ReactNode;
}

//To Sync playlist across tabs
const getInitialPlaylist = () => {
  if (Utils.isBrowser()) {
    const playlist = localStorage.getItem("playlist");
    if (playlist) {
      return JSON.parse(playlist);
    } else {
      localStorage.setItem("playlist", JSON.stringify(mediaJSON.videos));
      return mediaJSON.videos;
    }
  }
  return mediaJSON.videos;
};
export const PlaylistProvider: React.FC<IPlaylistProviderProps> = ({
  children,
}) => {
  const [playlist, setPlaylist] = useState<IVideo[]>(getInitialPlaylist());

  useEffect(() => {
    if (Utils.isBrowser()) {
      localStorage.setItem("playlist", JSON.stringify(playlist));
    }
  }, [playlist]);

  return (
    <PlaylistContext.Provider value={{ playlist, setPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};
