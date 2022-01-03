import { log } from '../../lib/logging';

const track = (name, version, payload = {}) => {
  log('trackingServiceMock#track', name, { version, payload });
  return Promise.resolve();
};

export default {
  track
};
