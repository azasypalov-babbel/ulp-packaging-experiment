import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PlayButton from './PlayButton';
import { audioPropTypes } from './withAudio';

const NORMAL_SPEED = 1;
const SLOW_SPEED = 0.7;

const initialState = {
  userPlayCount: 0,
  playbackSpeed: NORMAL_SPEED
};

/**
 * @deprecated in favour of `useSoundPlayer`.
 */
export class SoundPlayer extends Component {
  constructor() {
    super();
    this.state = initialState;

    this.playSound = this.playSound.bind(this);
    this.triggerSound = this.triggerSound.bind(this);
    this.toggleSpeed = this.toggleSpeed.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(initialState);
    }
  }

  componentDidMount() {
    if (this.props.playOnMount) {
      this.playSound();
    }
  }

  toggleSpeed() {
    const { userPlayCount } = this.state;
    const { audio, onUserTriggeredSound } = this.props;

    onUserTriggeredSound && onUserTriggeredSound();

    const isOddPlayback = (userPlayCount % 2) > 0;
    const shouldSwitchToSlow = audio.isEnded && isOddPlayback;
    const nextPlaybackSpeed = shouldSwitchToSlow ? SLOW_SPEED : NORMAL_SPEED;

    return new Promise((resolve) => {
      this.setState({
        playbackSpeed: nextPlaybackSpeed,
        userPlayCount: userPlayCount + 1
      }, resolve);
    });
  }

  playSound() {
    const { onEnded, onError, url, audio } = this.props;

    audio.playSoundWithState(url, {
      playbackRate: this.state.playbackSpeed,
      onEnded,
      onError
    });
  }

  triggerSound() {
    if (!this.props.audio.isPlaying) {
      this.toggleSpeed().then(this.playSound);
    }
  }

  render() {
    const { render, audio } = this.props;
    const isSlowPlayback = audio.playbackRate === SLOW_SPEED;

    if (render) {
      return (
        render({
          triggerSound: this.triggerSound,
          isSlowPlayback,
          ...audio
        })
      );
    }

    return (
      <PlayButton
        onClick={this.triggerSound}
        isSlowPlayback={isSlowPlayback}
        {...audio}
      />
    );
  }
}

SoundPlayer.propTypes = {
  url: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  render: PropTypes.func,
  playOnMount: PropTypes.bool,
  audio: audioPropTypes,
  onEnded: PropTypes.func,
  onError: PropTypes.func,
  onUserTriggeredSound: PropTypes.func
};

export default SoundPlayer;
