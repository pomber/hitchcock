import React from "react";
import { Spinner } from "./Spinner";
import { fetchMovieDetails, fetchMovieReviews } from "./api";
import { Loader } from "../../../src/index";

const detailsSource = {
  getName: id => `/movies/${id}/details`,
  getValue: id => fetchMovieDetails(id)
};

const reviewsSource = {
  getName: id => `/movies/${id}/reviews`,
  getValue: id => fetchMovieReviews(id)
};

const imageSource = {
  getName: src => src,
  getValue: src =>
    new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(src);
      image.src = src;
    })
};

export const MoviePage = ({ id }) => (
  <div>
    <MovieDetails id={id} />
    <MovieReviews id={id} />
  </div>
);

const MovieDetails = ({ id }) => (
  <Loader source={detailsSource} params={id}>
    {movie => (
      <div className="MovieDetails">
        <MoviePoster src={movie.poster} />
        <h1>{movie.title}</h1>
        <MovieMetrics {...movie} />
      </div>
    )}
  </Loader>
);

const Img = props => (
  <Loader source={imageSource} params={props.src}>
    {src => <img {...props} src={src} />}
  </Loader>
);

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

const MovieReviews = ({ id }) => (
  <div className="MovieReviews">
    <Loader
      source={reviewsSource}
      params={id}
      wait={100}
      fallback={<Spinner size="medium" />}
    >
      {reviews =>
        (reviews || []).map((review, index) => (
          <div className="review" key={index}>
            <div className="summary">{review.summary}</div>
            <div className="author">{review.author}</div>
          </div>
        ))
      }
    </Loader>
  </div>
);
