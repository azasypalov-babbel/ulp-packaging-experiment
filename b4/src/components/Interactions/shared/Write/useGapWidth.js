import { useLayoutEffect, useState } from 'react';

const CARET_ADJUSTMENT = 3; // px

const useGapWidth = ({
  ref,
  targetText,
  cssMinWidth = '10px',
  adjustForCaret
}) => {
  const minWidth = parseInt(cssMinWidth.replace(/[^0-9]px/g, ''), 10);
  const [gapWidth, setGapWidth] = useState(cssMinWidth);

  useLayoutEffect(() => {
    const style = window.getComputedStyle(ref.current);
    const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    // Cache canvas element for better performance
    var canvas =
      useGapWidth.canvas ||
      (useGapWidth.canvas = document.createElement('canvas'));

    var ctx = canvas.getContext('2d');
    ctx.font = font;

    const targetTextWidth = ctx.measureText(targetText).width;
    const maxWidth = Math.ceil(
      adjustForCaret ? targetTextWidth + CARET_ADJUSTMENT : targetTextWidth
    );
    const width = Math.max(maxWidth, minWidth) + 'px';

    setGapWidth(width);
  }, [targetText, minWidth, ref, adjustForCaret]);

  return gapWidth;
};

export default useGapWidth;
