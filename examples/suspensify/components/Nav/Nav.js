import React from "react";
import { PlayerContext } from "../PlayerProvider";
import { Spinner } from "../Spinner";
import IconPause from "../Icon/IconPause";
import IconPlay from "../Icon/IconPlay";
import { IconSuspensify } from "../Icon/IconSuspensify";

function Nav(props) {
  return (
    <div>
      {props.pageName === "artist" && (
        <div
          className="nav row"
          style={{ justifyContent: "space-between", zIndex: 9999 }}
        >
          <a onClick={props.goHome} className="logo">
            <IconSuspensify style />
          </a>{" "}
          <PlayerContext.Consumer>
            {({ currentTrack, play, pause, isPlaying, isLoading }) => {
              return currentTrack ? (
                <div
                  className="row"
                  role="button"
                  onClick={isPlaying ? pause(currentTrack) : play(currentTrack)}
                >
                  {isPlaying ? (
                    isLoading ? (
                      <Spinner className="small" />
                    ) : (
                      <IconPause height="16" width="16" />
                    )
                  ) : (
                    <IconPlay height="16" width="16" />
                  )}
                  <div
                    style={{
                      marginLeft: 8,
                      fontSize: 12,
                      lineHeight: 1
                    }}
                  >
                    {currentTrack.name}
                  </div>
                </div>
              ) : (
                <div />
              );
            }}
          </PlayerContext.Consumer>
        </div>
      )}
      <div className="main">{props.children}</div>
    </div>
  );
}

export default Nav;
