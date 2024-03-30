/* eslint-disable @next/next/no-img-element */
import React from "react";
import { IVideo } from "@vb/types/video";
import { Utils } from "@vb/utils/utils";
import { BsGripVertical } from "react-icons/bs";

const Video = (props: IVideo) => {
  const { thumb, duration, title, description, playOnClick, id } = props;

  const handleClick = () => {
    if (playOnClick) playOnClick(id);
  };

  return (
    <div className="w-auto m-[20px] flex items-center p-4 [box-shadow:rgba(0,_0,_0,_0.12)_0px_1px_3px,_rgba(0,_0,_0,_0.24)_0px_1px_2px] hover:shadow-lg border-r-4">
      <div style={{ fontSize: "40px" }}>
        <BsGripVertical />
      </div>
      <div
        className="cursor-pointer rounded-lg overflow-hidden flex flex-col md:flex-row"
        onClick={handleClick}
      >
        <img
          className="w-auto h-[200px] object-cover sm:w-auto sm:h-[150px]"
          src={Utils.getAssetPath(`sample/${thumb}`)}
          alt="thumbnail"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-700 mb-2 whitespace-nowrap overflow-hidden overflow-ellipsis md:w-full">
            {description}
          </p>
          <p className="text-sm text-gray-600">{duration}</p>
        </div>
      </div>
    </div>
  );
};

export default Video;
