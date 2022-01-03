import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import useScene, { INTERACTION_STATES } from '../shared/scene/useScene';
import { matchResult } from '../shared/Write/helpers';
import FillinInteractionNode from './FillinInteractionNode';
import { toggleTransliterationVisibility } from '../../../dux/session/actions';
import Text from '../../shared/Text';
import { getActiveNode, getItem, getMistakeCount, isGap } from '../shared/scene/selectors';
import useHasLatestAttempt from '../shared/Write/hasLatestAttempt';
import { play, requestPrompt } from '../shared/scene/actions';
import useFeedbackSounds from '../shared/useFeedbackSounds';

const quantiseStates = ({ active, activeNode, feedbackDismissed }) => {
  if (!active || !activeNode) return INTERACTION_STATES.INACTIVE;

  const { number, pending } = activeNode.attempt;
  if (number && !pending && !feedbackDismissed) return INTERACTION_STATES.FEEDBACK;

  return INTERACTION_STATES.INPUT;
};

const FillinInteraction = ({
  item,
  active,
  onFinish,
  learnLanguageAlpha3,
  shouldShowTransliteration,
  toggleTransliterationVisibility,
  onAttempt
}) => {
  const [
    scene,
    dispatch
  ] = useScene({
    learnLanguageAlpha3,
    item,
    matchResult
  });

  const [playFeedback, isFeedbackSoundDone] = useFeedbackSounds({
    resetDependencies: [getActiveNode(scene)]
  });
  const [feedbackDismissed, setFeedbackDismissed] = useState(true);

  const { nodes } = getItem(scene);
  const activeNode = getActiveNode(scene);

  const interactionState = quantiseStates({ active, activeNode, feedbackDismissed });

  const latestAttempt = useHasLatestAttempt(activeNode && activeNode.attempt);

  const mistakes = getMistakeCount(scene);

  const handleAttempt = useCallback((attemptText) => {
    if (feedbackDismissed === true) {
      setFeedbackDismissed(false);
      dispatch(requestPrompt(attemptText));
    }
  }, [dispatch, feedbackDismissed]);

  const handleRetry = useCallback(() => {
    setFeedbackDismissed(true);
  }, []);

  const handleProceed = useCallback(() => {
    setFeedbackDismissed(true);
    dispatch(play());
  }, [dispatch]);

  useEffect(() => {
    if (latestAttempt && active) {
      onAttempt({ attempt: latestAttempt });
      playFeedback(latestAttempt.solved);
    }
  }, [latestAttempt, onAttempt, active, playFeedback]);

  useEffect(() => {
    if (!activeNode) {
      dispatch(play());
    }
  }, [activeNode, dispatch]);

  useEffect(() => {
    if (scene.completed && active && isFeedbackSoundDone) {
      onFinish(mistakes);
    }
  }, [scene.completed, onFinish, mistakes, isFeedbackSoundDone, active]);

  return (
    <div>
      {nodes.map((node, idx) => isGap(node)
        ? <FillinInteractionNode
          key={idx}
          node={node}
          learnLanguageAlpha3={learnLanguageAlpha3}
          interactionState={node.active ? interactionState : INTERACTION_STATES.INACTIVE}
          onAttempt={handleAttempt}
          onRetry={handleRetry}
          onProceed={handleProceed}
          toggleTransliterationVisibility={toggleTransliterationVisibility}
          shouldShowTransliteration={shouldShowTransliteration}
        />
        : <Text key={idx} color="spaceGray" dangerouslySetInnerHTML={{ __html: node.text }} />
      )}
    </div>
  );
};

const mapStateToProps = ({ session }) => ({
  learnLanguageAlpha3: session.learnLanguageAlpha3,
  shouldShowTransliteration: session.transliterationSettings.shouldShow
});

const mapDispatchToProps = {
  toggleTransliterationVisibility
};

FillinInteraction.propTypes = {
  item: PropTypes.object.isRequired,
  toggleTransliterationVisibility: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  shouldShowTransliteration: PropTypes.bool.isRequired,
  onFinish: PropTypes.func.isRequired,
  onAttempt: PropTypes.func.isRequired,
  learnLanguageAlpha3: PropTypes.string.isRequired
};

FillinInteraction.trainerConfig = {

};

export default connect(mapStateToProps, mapDispatchToProps)(FillinInteraction);
