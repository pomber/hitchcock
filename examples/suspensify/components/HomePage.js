import React from "react";
import ListItem from "./ListItem";
import { fetchArtistListJSON } from "../api";
import { Logo } from "./Icon/Logo";
import { createResource } from "hitchcock";
import { Spinner } from "./Spinner";

const ArttistListResource = createResource(
  fetchArtistListJSON,
  () => "/artists"
);

function HomePage({ goToArtist }) {
  const [currentId, setCurrentId] = React.useState(null);
  const [startTransition] = React.useTransition({
    timeoutMs: 3000
  });
  return (
    <div className="search">
      <Logo />
      <React.Suspense fallback={<Spinner size="large" />}>
        {ArttistListResource.read().map(item => (
          <ListItem
            onClick={currentId => {
              setCurrentId(currentId);
              startTransition(() => {
                goToArtist(item.id);
              });
            }}
            key={item.id}
            item={item}
            currentId={currentId}
          />
        ))}
      </React.Suspense>
    </div>
  );
}

export default HomePage;
