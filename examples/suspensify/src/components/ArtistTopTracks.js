import React from "react";
import { Track } from "./Track";
import { fetchArtistTopTracksJSON } from "../api";

import { unstable_createResource } from "hitchcock";

const ArtistTopTracksResource = unstable_createResource(
  fetchArtistTopTracksJSON,
  id => `/artists/${id}/top-tracks`
);

function ArtistTopTracks({ id }) {
  const tracks = ArtistTopTracksResource.read(id);
  // console.log(tracks);
  return (
    <div className="topTracks">
      <h3>Top Tracks</h3>
      {tracks.slice(0, 3).map(track => (
        <Track key={track.id} track={track} />
      ))}
    </div>
  );
}

export default ArtistTopTracks;
