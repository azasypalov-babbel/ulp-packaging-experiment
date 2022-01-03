import demoOverrides from './demo.overrides';
import webviewOverrides from './webview.overrides';
import speechRecognitionOverrides from './speechRecognition.overrides';

export default [...webviewOverrides, ...demoOverrides, ...speechRecognitionOverrides];
