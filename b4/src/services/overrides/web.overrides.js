import * as features from '../../lib/features';
import { createServicesOverride } from './factory';
import cat from '../barrels/cat';
import defaults from '../barrels/default';

export default [
  // if feature flag 'is_cat_preview' is enabled apply cat services
  createServicesOverride(cat, 'is_cat_preview'),
  // if not apply default services
  createServicesOverride(defaults, () => !features.get('is_cat_preview'), 'not(is_cat_preview)')
];
