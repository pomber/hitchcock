import React from "react";
import { Spinner } from "./Spinner";
import { fetchMovieDetails, fetchMovieReviews } from "./api";
import { unstable_createResource as createResource } from "../../../src/index";

const detailsResource = createResource(
  id => fetchMovieDetails(id),
  id => `/movies/${id}/details`
);

const reviewResource = createResource(
  id => fetchMovieReviews(id),
  id => `/movies/${id}/reviews`
);

const imageResource = createResource(
  src =>
    new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.src = src;
    })
);

const MoviePage = ({ id }) => (
  <div>
    <MovieDetails id={id} />
    <div className="MovieReviews">
      <React.Suspense maxDuration={100} fallback={<Spinner size="medium" />}>
        <MovieReviews id={id} />
      </React.Suspense>
    </div>
  </div>
);

const MovieDetails = ({ id }) => {
  const movie = detailsResource.read(id);
  return (
    <div className="MovieDetails">
      <MoviePoster src={movie.poster} />
      <h1>{movie.title}</h1>
      <MovieMetrics {...movie} />
    </div>
  );
};

const Img = props => {
  const src = imageResource.read(props.src);
  return <img {...props} src={src} />;
};

const MoviePoster = ({ src }) => (
  <div className="MoviePoster">
    <Img src={src} alt="poster" />
  </div>
);

const MovieMetrics = movie => (
  <div>
    <div>
      <h3>Tomatometer</h3>
      {movie.rating > 70 ? "🍅" : "🤢"}
      {movie.rating}%
    </div>
    <div>
      <h3>Critics Consensus</h3>
      {movie.consensus}
    </div>
  </div>
);

const MovieReviews = ({ id }) => {
  const reviews = reviewResource.read(id);
  return (reviews || []).map((review, index) => (
    <div className="review" key={index}>
      <div className="summary">{review.summary}</div>
      <div className="author">{review.author}</div>
    </div>
  ));
};

export default MoviePage;
