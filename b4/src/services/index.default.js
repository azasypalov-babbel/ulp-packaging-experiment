import commonServices from './barrels/common';
import { applyOverrides } from './overrides/factory';
import overrides from './overrides/index.web';

export default applyOverrides(commonServices,  ...overrides);
