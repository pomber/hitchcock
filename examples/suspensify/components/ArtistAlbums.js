import React from "react";
import { fetchArtistAlbumsJSON } from "../api";
import IconPerson from "./Icon/IconPerson";
import Img from "./Img";
import { createResource } from "hitchcock";

const ArtistAlbumsResource = createResource(
  fetchArtistAlbumsJSON,
  id => `/artists/${id}/albums`
);

class ArtistAlbums extends React.Component {
  render() {
    return (
      <>
        <h3>Albums</h3>
        <AlbumGrid albums={ArtistAlbumsResource.read(this.props.id)} />
      </>
    );
  }
}

function AlbumGrid({ albums }) {
  return (
    <div className="album-grid">
      {albums &&
        albums
          .slice(0, 6)
          .map(album => <AlbumItem album={album} key={album.id} />)}
    </div>
  );
}

function AlbumItem({ album }) {
  return (
    <span key={album.id}>
      {album.images && album.images.length > 0 ? (
        <div className="album-artwork">
          <React.Suspense
            fallback={
              <img
                className="album-image preview"
                src={album.images[2].url}
                alt={album.name}
              />
            }
          >
            <Img
              className="album-image loaded"
              src={album.images[0].url}
              alt={album.name}
            />
          </React.Suspense>
          <div className="album-title center">{album.name}</div>
          <div className="album-meta center">
            {album.total_tracks} Songs • {album.release_date.slice(0, 4)}
          </div>
        </div>
      ) : (
        <div className="album-artwork">
          <IconPerson />
        </div>
      )}
    </span>
  );
}

export default ArtistAlbums;
