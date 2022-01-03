import { createServicesOverride } from './factory';
import mock from '../barrels/mock';

export default [
  // mocked services are applied when 'is_demo' flag is set
  createServicesOverride(mock, 'is_demo')
];
