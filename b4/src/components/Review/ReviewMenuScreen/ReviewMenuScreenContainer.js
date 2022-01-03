import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ReviewMenuScreen from './ReviewMenuScreen';
import * as reviewActions from '../../../dux/review/actions';

const mapStateToProps = (state) => ({
  interactions: state.review.interactionTypes.map((type) => type.id)
});

const mapDispatchToProps = {
  fetchInteractionTypes: reviewActions.fetchInteractionTypes,
  updateInteraction: reviewActions.updateInteraction
};

class ReviewMenuScreenContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSelectInteraction = this.handleSelectInteraction.bind(this);
  }

  handleSelectInteraction(interaction) {
    this.props.updateInteraction(interaction);
  }

  render() {
    return (
      <ReviewMenuScreen
        onSelectInteraction={this.handleSelectInteraction}
        translations={this.translations}
        interactions={this.props.interactions}
      />
    );
  }
}

ReviewMenuScreenContainer.propTypes = {
  updateInteraction: PropTypes.func.isRequired,
  interactions: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(ReviewMenuScreenContainer);
