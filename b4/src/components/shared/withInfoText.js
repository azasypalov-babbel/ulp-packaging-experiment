import React, { useState, useCallback } from 'react';
import InfoTextNotificationContainer from './InfoText/InfoTextNotification/InfoTextNotificationContainer';

export const withInfoText = (WrappedComponent) => {
  const WithInfotext = (props) => {
    const [infoText, setInfoText] = useState(null);
    const [shouldClearUI, setShouldClearUI] = useState(false);

    const clearInfoTextUI = useCallback(() => {
      setShouldClearUI(true);
    }, [setShouldClearUI]);

    const displayInfoText = useCallback((item) => {
      setInfoText(item.infoText || item.info_text);
    }, [setInfoText]);

    return (
      <>
        <InfoTextNotificationContainer
          content={infoText}
          shouldClearUI={shouldClearUI}
          setShouldClearUI={setShouldClearUI}
        />
        <WrappedComponent
          displayInfoText={displayInfoText}
          clearInfoTextUI={clearInfoTextUI}
          {...props}
        />
      </>
    );
  };
  return WithInfotext;
};

export default withInfoText;
