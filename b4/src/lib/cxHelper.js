import baseCX from 'classnames';

const PREFIX = 'loy';

const cx = (...args) => {
  const classNames = baseCX(args);

  return classNames.split(' ')
    .map((className) => `${PREFIX}-${className}`)
    .join(' ');
};

export default cx;
