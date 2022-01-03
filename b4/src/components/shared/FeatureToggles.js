import React from 'react';
import styled from 'styled-components';
import * as features from '../../lib/features';

const StyledFeatureToggles = styled.div`
  color: #ccc;
  position: absolute;
  top: 15vh;
  right: 10vh;
  font-size: 14px;
  text-align: right;
  line-height: 1.5;
`;

function FeatureToggles() {
  const activeFeatures = features.getActiveFeatures();
  const isDebug = activeFeatures.includes('is_debug');

  if (!isDebug || activeFeatures.length < 1) {
    return null;
  }

  return (
    <StyledFeatureToggles>
      {activeFeatures.map((activeFeature) => (
        <div key={activeFeature}> {activeFeature.slice(3)}: ON </div>
      ))}
      <div> BUILD COMMIT SHA: {process.env.BUILD_COMMIT_HASH.substring(0, 6)} </div>
    </StyledFeatureToggles>
  );
}

export default FeatureToggles;
