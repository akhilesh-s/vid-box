/* eslint-disable @next/next/no-img-element */
import React from "react";
import { IVideo } from "@vb/types/video";
import { Utils } from "@vb/utils/utils";

const Video = (props: IVideo) => {
  const { thumb, duration, title, source, description, playOnClick, id } =
    props;

  const handleClick = () => {
    if (playOnClick) playOnClick(id);
  };

  return (
    <div onClick={handleClick}>
      <img
        src={Utils.getAssetPath(`sample/${thumb}`)}
        alt="thumbnail"
        width={200}
        height={200}
      />
      <p>{duration}</p>
      <p>{title}</p>
      <p>{description}</p>
    </div>
  );
};

export default Video;
