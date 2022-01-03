import { createElement } from 'react';

const ReactPortal = jest.createMockFromModule('react-portal');

ReactPortal.Portal = jest.fn(({ children }) => children);

ReactPortal.PortalWithState = jest.fn(({ children, ...props }) =>
  createElement(
    'PortalWithState',
    props,
    children({
      closePortal: props.onClose,
      portal: (children) => children
    })
  )
);

module.exports = ReactPortal;
