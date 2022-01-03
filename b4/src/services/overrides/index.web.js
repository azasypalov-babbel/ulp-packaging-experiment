import demoOverrides from './demo.overrides';
import webOverrides from './web.overrides';
import speechRecognitionOverrides from './speechRecognition.overrides';

export default [...webOverrides, ...demoOverrides, ...speechRecognitionOverrides];
