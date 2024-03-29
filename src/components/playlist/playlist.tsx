import React, { useState } from "react";
import { IVideo } from "@vb/types/video";
import Video from "../video/video";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import dynamic from "next/dynamic";
import { usePlaylist } from "@vb/context/playlistProvider";
const Droppable = dynamic(
  () => import("react-beautiful-dnd").then((res) => res.Droppable),
  { ssr: false }
);

interface IPlaylist {
  playVideo: (id: number) => void;
  onReorder?: (videos: IVideo[]) => void;
}

const Playlist = (props: IPlaylist): JSX.Element => {
  const { playVideo, onReorder } = props;
  const { playlist, setPlaylist } = usePlaylist();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(playlist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlaylist(items);
    if (onReorder) onReorder(items);
  };

  const handleClick = (id: number) => {
    playVideo(id);
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="playlist">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {playlist.map((video, index) => (
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
    </>
  );
};

export default Playlist;
