import { stripUnit } from 'polished';
import { windowScrollTo } from 'seamless-scroll-polyfill';

// naive implementation for `scroll-padding` css property
// This is part of the CSS scroll snap module which would work well
// for this usecase. However, currently it does not work properly in combination
// with smooth-scroll pollyfills required by Safari
//
// see: https://developers.google.com/web/updates/2018/07/css-scroll-snap
//      https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
const getScrollPadding = (element) => {
  const value = stripUnit(getComputedStyle(element)['scroll-padding-bottom']);
  return typeof value === 'number'
    ? value
    : 0;
};

const offset = (el) => {
  const rect = el.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
};

let bottomInset = 0;

export const setBottomInset = (inset) => bottomInset = inset;

export const getBottomInset = () => bottomInset;

export const isInSafeArea = (element) => {
  const bottomInset = getBottomInset();

  const { bottom } = element.getBoundingClientRect();

  const scrollPadding = getScrollPadding(element);

  const vHeight = window.innerHeight - bottomInset;

  /**
   * Checks if the bottom of the element is outside the safe area
   */

  return (
    bottom + scrollPadding < vHeight
  );
};

let previousElement = null;

const rememberPrevious = (element = null) => {
  if (element) {
    previousElement = element;
    return element;
  } else if (previousElement && previousElement.isConnected) {
    return previousElement;
  } else {
    return document.querySelector('main');
  }
};

export const scrollIntoSafeArea = (toElement) => {
  /**
   * scrollIntoSafeArea can be called with no element.
   * In this case it will use the last element that was scrolled again.
   */
  const element = rememberPrevious(toElement);

  if (!element || isInSafeArea(element)) return;

  const { height } = element.getBoundingClientRect();
  const { top } = offset(element);

  const bottomInset = getBottomInset();

  const scrollPadding = getScrollPadding(element);

  /**
   * Calculate the scroll needed to get the bottom of the element into the safe area
   */
  const blockEnd = (top + height + scrollPadding) - (window.innerHeight - bottomInset);

  const pageBottom = document.documentElement.scrollHeight - window.innerHeight;

  windowScrollTo({
    top: Math.min(pageBottom, blockEnd),
    behavior: 'smooth'
  });
};
