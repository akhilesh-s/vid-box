import { IVideo } from "@vb/types/video";
import React, { useContext, createContext, useState, useEffect } from "react";
import { mediaJSON } from "@vb/data/mediaData";
import { Utils } from "@vb/utils/utils";

interface PlaylistContextType {
  autoplay?: boolean;
  playlist: IVideo[];
  setPlaylist: (playlist: IVideo[]) => void;
  setAutoplay: (autoplay: boolean) => void;
}

const PlaylistContext = createContext<PlaylistContextType>({
  autoplay: true,
  playlist: mediaJSON.videos,
  setPlaylist: () => {},
  setAutoplay: () => {},
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
  const [autoplay, setAutoplay] = useState<boolean>(true);

  useEffect(() => {
    if (Utils.isBrowser()) {
      localStorage.setItem("playlist", JSON.stringify(playlist));
    }
  }, [playlist]);

  useEffect(() => {
    if (Utils.isBrowser()) {
      const storedAutoplay = localStorage.getItem("autoplay");
      if (storedAutoplay !== null) {
        setAutoplay(storedAutoplay === "true");
      }
    }
  }, []);

  useEffect(() => {
    if (Utils.isBrowser()) {
      localStorage.setItem("autoplay", autoplay.toString());
    }
  }, [autoplay]);

  return (
    <PlaylistContext.Provider
      value={{ playlist, setPlaylist, autoplay, setAutoplay }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};
