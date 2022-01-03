const noOp = () => { };

export const startMuteDetection = ({ onChange = noOp }) =>
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((userMediaStream) => {
      const context = new AudioContext();
      context.createMediaStreamSource(userMediaStream);
      const mediaTrack = userMediaStream.getAudioTracks()[0];

      onChange({ target: mediaTrack });

      mediaTrack.addEventListener('mute', onChange);
      mediaTrack.addEventListener('unmute', onChange);

      return () => {
        const mediaTracks = userMediaStream.getTracks();
        mediaTracks.forEach((track) => {
          track.removeEventListener('mute', onChange);
          track.removeEventListener('unmute', onChange);
          track.stop();
        });
      };
    });
