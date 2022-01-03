import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from './IconButton/IconButton';

const StyledToggle = styled(IconButton)`
  width: 2.5rem;
  height: 2.5rem;

  @media (min-width: ${(props) => props.theme.viewports.breakpoints.xsmall}) {
    width: auto;
    height: 3rem;
  }
`;

export class TranslationToggle extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = { translationsOn: false };
  }

  handleClick() {
    this.props.onClick();
    this.setState((prevState) => ({
      translationsOn: !prevState.translationsOn
    }));
  }

  render() {
    return (
      <StyledToggle
        iconName={this.state.translationsOn ? 'HideIcon' : 'ShowIcon'}
        onClick={this.handleClick}
        onMouseDown={e => e.preventDefault()} // Prevents focus change
        data-selector="translation-toggle"
      />
    );
  }
}

TranslationToggle.propTypes = {
  onClick: PropTypes.func.isRequired
};

export default TranslationToggle;
