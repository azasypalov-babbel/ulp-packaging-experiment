/** Invokes `callback` after the page finished scrolling. In case no
 * scroll event occurs, the callback will be invoked after a timeout.
 *
 * @returns {() => void} A cleanup function that removes the scroll event listener and timeout.
 */
const performAfterScroll = (callback) => {
  let isScrolling;
  let onScroll;
  let onScrollEnd;

  onScrollEnd = () => {
    window.removeEventListener('scroll', onScroll, false);
    callback();
  };
  onScroll = () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(onScrollEnd, 300);
  };

  isScrolling = setTimeout(onScrollEnd, 500);
  window.addEventListener('scroll', onScroll, false);

  return () => {
    window.removeEventListener('scroll', onScroll, false);
    clearTimeout(isScrolling);
  };
};

export default performAfterScroll;
