import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';

import { log } from '../../lib/logging';
import * as sequenceActions from '../../dux/sequence/actions';
import { isBabbelUser } from '../../dux/account/selectors';
import { isStaging } from '../../dux/session/selectors';


const mapStateToProps = (state) => {
  const { account, sequence, session } = state;
  const mayUseCheatControls = isStaging(session) || isBabbelUser(account);

  return {
    trainers: sequence.trainers,
    currentTrainerIndex: sequence.currentTrainerIndex,
    mayUseCheatControls
  };
};

const mapDispatchToProps = {
  navigate: sequenceActions.navigate
};

const GenericWrapper = styled.div`
  min-height: 50px;
  min-width: 15%;
`;

const SkipArea = ({ direction, onClick }) => {
  return (
    <GenericWrapper
      onClick={onClick}
      data-selector={`${direction}-button`}
      tabIndex="0"
    />
  );
};

SkipArea.propTypes = {
  direction: PropTypes.string,
  onClick: PropTypes.func
};

export function SkipTrainerControls(props) {
  const { currentTrainerIndex, trainers, navigate, children, renderSkipAreas, mayUseCheatControls } = props;

  useEffect(() => {
    if (mayUseCheatControls) {
      log(`Skipping is allowed. Feel free to use the buttons next to the progress to navigate!`);
    }
  }, [mayUseCheatControls]);

  if (!mayUseCheatControls) {
    return children;
  }

  const next = () => {
    if (currentTrainerIndex < trainers.length - 1) {
      navigate(currentTrainerIndex + 1);
    }
  };

  const previous = () => {
    if (currentTrainerIndex > 0) {
      navigate(currentTrainerIndex - 1);
    }
  };

  return (<>
    {renderSkipAreas && <SkipArea direction="backward" onClick={previous} />}
    {children}
    {renderSkipAreas && <SkipArea direction="forward" onClick={next} />}
  </>);
}

SkipTrainerControls.propTypes = {
  navigate: PropTypes.func.isRequired,
  children: PropTypes.node,
  currentTrainerIndex: PropTypes.number,
  trainers: PropTypes.arrayOf(PropTypes.object).isRequired,
  // the skip buttons should only be shown when the progress bar is shown
  renderSkipAreas: PropTypes.bool,
  // the skip controls can be used on production if the user has a @babbel.com
  // email address, and on staging and localhost anytime
  mayUseCheatControls: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(SkipTrainerControls);
