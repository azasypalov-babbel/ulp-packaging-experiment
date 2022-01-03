import styled, { css } from 'styled-components';
import { isiOS, isWebview } from '../../lib/features';

const fixNavigationBar = css`
  & .loy .loy-cascada-navbar {
    position: fixed;
    top: 0;
    padding-top: env(safe-area-inset-top);

    &:after {
      top: initial;
    }
  }
  & > main {
    margin-top: calc(${(props) => props.theme.size.navbar.xsmall.height} + env(safe-area-inset-top));
  }
`;

const disableSelection = css`
  user-select: none;
  -webkit-touch-callout: none;
`;

const ApplicationLayout = styled.div`
  display: flex;
  flex-direction: column;

  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    height: 100vh; /* IE11 does not respect min-height for calculating flex */
  }

  min-height: 100vh;
  ${isiOS() && css`
    min-height: -webkit-fill-available; /* To reduce the page size if possible when software keyboard is open */
  `}

  ${isWebview() && fixNavigationBar};
  ${isWebview() && disableSelection};

  & > main {
    position: relative;
    flex: 1 0 auto; /* main should be least the height of it's content */

    display: flex;

    & > * {
      flex: 1 1 100%; /* make children 100% width, and shrink if screen width is too small */
    }
  }

  .hide-for-tiny {
    @media (max-width: 413px) {
      display: none;
    }
  }

  .fixed-for-small {
    @media (max-width: 767px) {
      position: fixed;
    }
  }

  .hide-for-small {
    @media (max-width: 767px) {
      display: none;
    }
  }
`;

export default ApplicationLayout;
