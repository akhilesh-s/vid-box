import React, { useState } from "react";
import { IVideo } from "@vb/types/video";
import Video from "../video/video";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface IPlaylist {
  videos: IVideo[];
  playVideo: (id: number) => void;
}

const Playlist = (props: IPlaylist): JSX.Element => {
  const { videos, playVideo } = props;
  const [playlistVideos, setPlaylistVideos] = useState(videos);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(playlistVideos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlaylistVideos(items);
  };

  const handleClick = (id: number) => {
    playVideo(id);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="playlist">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {playlistVideos.map((video, index) => (
              <Draggable
                key={video.id}
                draggableId={video.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Video
                      id={video.id}
                      thumb={video.thumb}
                      source={video.source}
                      duration={video.duration}
                      playOnClick={handleClick}
                      title={video.title}
                      description={video.description}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Playlist;
