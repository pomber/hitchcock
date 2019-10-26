import React from "react";
import { Spinner } from "./Spinner";
import Img from "./Img";

function ListItem({ item, to, onClick, currentId }) {
  return (
    <a
      className="name"
      onClick={() => {
        if (onClick) {
          onClick(item.id);
        }
      }}
    >
      <div className="item" key={item.id}>
        {/* Instead of placing fallback here, better to wait for all the images to be ready */}
        <React.Suspense
          fallback={
            <img
              className="artwork preview"
              src={`/img/${item.id}/avatar.jpeg`}
              alt={item.name}
            />
          }
        >
          <Img
            className="artwork loaded"
            src={`/img/${item.id}/avatar-hd.jpeg`}
            alt={item.name}
          />
        </React.Suspense>
        <div className="col flex-1">
          <div className="name">{item.name}</div>
        </div>
        <div>{currentId === item.id ? <Spinner /> : null}</div>
      </div>
    </a>
  );
}

export default ListItem;
