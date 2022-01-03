import { createServicesOverride } from './factory';
import native from '../barrels/native';

export default [
  createServicesOverride(native, () => true, 'webview')
];
