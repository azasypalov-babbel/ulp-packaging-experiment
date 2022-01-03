// please note,
// that IE11 now returns undefined again for window.chrome
// and new Opera 30 outputs true for window.chrome
// but needs to check if window.opr is not undefined
// and new IE Edge outputs to true now for window.chrome
// and if not iOS Chrome check
// so use the below updated condition

// based on https://stackoverflow.com/a/13348618
const isChromium = window.chrome;
const agent = window.navigator.userAgent.toLowerCase();
const vendorName = window.navigator.vendor;
const isOpera = typeof window.opr !== 'undefined';
const isIEedge = agent.indexOf('edge') > -1 || agent.indexOf('edg') > -1;
let isChrome = false;

if (
  isChromium !== null &&
  typeof isChromium !== 'undefined' &&
  vendorName === 'Google Inc.' &&
  isOpera === false &&
  isIEedge === false
) {
  isChrome = true;
}

export { isChrome };
