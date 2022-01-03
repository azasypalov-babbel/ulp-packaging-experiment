import PropTypes from 'prop-types';

const getBreakpointThresholds = (theme) => [
  '0px',
  theme.viewports.breakpoints.xxsmall,
  theme.viewports.breakpoints.xsmall,
  theme.viewports.breakpoints.small,
  theme.viewports.breakpoints.medium,
  theme.viewports.breakpoints.large
];
export const getBreakpoints = (breakpointsThreshold) => ({
  xxxsmall: breakpointsThreshold[0],
  xxsmall: breakpointsThreshold[1],
  xsmall: breakpointsThreshold[2],
  small: breakpointsThreshold[3],
  medium: breakpointsThreshold[4],
  large: breakpointsThreshold[5]
});

export const responsiveStyles = (propKey, createStyles) => (props) => {
  const breakpointThresholds = getBreakpointThresholds(props.theme);
  const Breakpoints = getBreakpoints(breakpointThresholds);
  const size2LabelMapping = props[propKey];
  const validValuesArray = Object.entries(size2LabelMapping).filter(([k]) => Breakpoints[k]);
  if (typeof size2LabelMapping !== 'object' || validValuesArray.length === 1) {
    const value = typeof size2LabelMapping === 'object' ? validValuesArray[0][1] : size2LabelMapping;
    return createStyles({ ...props, [propKey]: value });
  }
  return validValuesArray
    // to avoid incorrect overriding
    .sort(([k1], [k2]) => breakpointThresholds.indexOf(k1) - breakpointThresholds.indexOf(k2))
    .map(([k, v]) => `@media (min-width: ${Breakpoints[k]}) { ${createStyles({ ...props, [propKey]: v })} }`)
    .join('\n');
};

export const ResponsivePropType = (type) => PropTypes.oneOfType([
  type,
  PropTypes.shape({
    xxxsmall: type,
    xxsmall: type,
    xsmall: type,
    small: type,
    medium: type,
    large: type
  })
]);
