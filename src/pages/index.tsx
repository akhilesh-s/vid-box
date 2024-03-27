import VideoPlayer from "@vb/components/videoPlayer/videoPlayer";

export default function Home() {
  return (
    <main>
      <div>
        <VideoPlayer
          source="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          width="500"
          height="500"
        />
      </div>
    </main>
  );
}
