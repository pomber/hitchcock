import React from "react";
import { createResource } from "hitchcock";

const imageResource = createResource(
  src =>
    new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.src = src;
    })
);

const Img = props => {
  const src = imageResource.read(props.src);
  return <img {...props} src={src} alt={props.alt} />;
};

export default Img;
