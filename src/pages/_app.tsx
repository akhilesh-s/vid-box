import "@vb/styles/globals.css";
import type { AppProps } from "next/app";
import { PlaylistProvider } from "@vb/context/playlistProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlaylistProvider>
      <Component {...pageProps} />
    </PlaylistProvider>
  );
}
