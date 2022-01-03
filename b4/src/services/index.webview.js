import commonServices from './barrels/common';
import { applyOverrides } from './overrides/factory';
import webviewOverrides from './overrides/index.webview';

export default applyOverrides(commonServices,  ...webviewOverrides);
