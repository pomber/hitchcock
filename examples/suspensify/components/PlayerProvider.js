import React from "react";

export const PlayerContext = React.createContext(null);

class PlayerProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isPlaying: false,
      play: this.play.bind(this),
      pause: this.pause.bind(this)
    };
  }
  pause() {
    return () => {
      this.audio.pause();
      this.setState({ isPlaying: false });
    };
  }

  play(currentTrack) {
    return () => {
      if (currentTrack !== this.state.currentTrack) {
        this.setState({ isLoading: true, currentTrack });
        if (this.audio) {
          this.audio.pause();
          this.setState({ isPlaying: false });
        }
        this.audio = new Audio(currentTrack.preview_url);
        this.audio.onloadeddata = () => {
          this.setState({
            isLoading: false,
            currentTrack,
            isPlaying: true
          });
          this.audio.play();
        };
        document.body.appendChild(this.audio);
      } else {
        this.audio.play();
        this.setState({ isPlaying: true, isLoading: false });
      }
    };
  }

  render() {
    return (
      <PlayerContext.Provider value={this.state}>
        {this.props.children}
      </PlayerContext.Provider>
    );
  }
}

export default PlayerProvider;
