import React from 'react';

export default (getStory, context) => (
  <div className="loy">
    {getStory(context)}
  </div>
);
