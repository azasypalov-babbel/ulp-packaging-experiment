import substitutionsService from './service';
import substitutionsServiceCat from './service.cat';
import substitutionsServiceMock from '../../../demo/mocks/speechRecognitionSubstitutionsServiceMock';

import { applyOverrides, createServicesOverride } from '../../overrides/factory';

const { substitutionsService: resolved } = applyOverrides(
  { substitutionsService },
  createServicesOverride({ substitutionsService: substitutionsServiceCat }, 'is_cat_preview'),
  createServicesOverride({ substitutionsService: substitutionsServiceMock }, 'is_demo')
);

export default resolved;
