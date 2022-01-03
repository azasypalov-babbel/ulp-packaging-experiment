import rollbar from './rollbarService';

const INACTIVE = 'inactive';
let mediaRecorder;

const stop = () => {
  if (mediaRecorder) {
    if (mediaRecorder.state !== INACTIVE) {
      mediaRecorder.stop();
    }
    // Cleanup up streams so that browser does not indicate recording happening
    mediaRecorder.stream.getTracks().forEach((track) => track.stop());
  }
};

const start = () => new Promise((resolve, reject) => {
  if (!navigator.mediaDevices.getUserMedia) reject();

  let chunks = [];
  const constraints = { audio: true };

  stop();

  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };
      mediaRecorder.onerror = (error) => {
        chunks = [];
        reject(error);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        chunks = [];
        resolve({ src: window.URL.createObjectURL(blob), format: 'ogg' });
      };

      mediaRecorder.start();
    }).catch(reject);
}).catch(({ stack, message, name }) => {
  rollbar.debug(
    `recordingService start Error: ${name}`,
    { name, stack, message }
  );
});

export default {
  start,
  stop
};
