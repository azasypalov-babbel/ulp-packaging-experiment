import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { markupStringToHTML } from '@lessonnine/babbel-markup-helper.js';

import InfoTextNotification from './InfoTextNotification';
import InfoTextList from '../../InfoText/InfoTextList';

import * as features from '../../../../lib/features';
import { renderInTrainerOverlay } from '../../TrainerOverlay';

const ESC_KEY = 27;

const useDocumentOverflowHidden = (isHidden) => {
  const prevBodyOverflowYStyle = useRef(document.body.style.overflowY);
  const prevParentOverflowYStyle = useRef(document.body.parentElement.style.overflowY);
  useEffect(() => {
    if (features.isWebview() && isHidden) {
      prevBodyOverflowYStyle.current = document.body.style.overflowY;
      prevParentOverflowYStyle.current = document.body.parentElement.style.overflowY;
      document.body.style.overflowY = 'hidden';
      document.body.parentElement.style.overflowY = 'hidden';
    }

    return () => {
      document.body.style.overflowY = prevBodyOverflowYStyle.current;
      document.body.parentElement.style.overflowY = prevParentOverflowYStyle.current;
    };
  }, [isHidden]);
};

export const InfoTextNotificationContainer = (props) => {
  const { content, shouldClearUI, setShouldClearUI } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const dismissCurrentTip = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  useEffect(() => {
    if (shouldClearUI) {
      dismissCurrentTip();
      setShowAll(false);
      setShouldClearUI(false);
    }
  }, [shouldClearUI, dismissCurrentTip, setShouldClearUI]);

  useEffect(() => {
    if (!content || content.trim().length == 0) return;

    setIsOpen(true);
    setShowAll(false);
    setItems((prevItems) => [...prevItems, markupStringToHTML(content)]);
  }, [content]);

  useEffect(() => {
    const handler = (event) => {
      if (event.keyCode === ESC_KEY && isOpenRef.current) {
        dismissCurrentTip();
      }
      setShowAll(false);
    };
    document.addEventListener('keydown', handler);

    return function cleanupKeypressEventListener() {
      document.removeEventListener('keydown', handler);
    };
  }, [dismissCurrentTip]);

  const hideList = () => setShowAll(false);
  const showList = () => {
    dismissCurrentTip();
    setShowAll(true);
  };

  useDocumentOverflowHidden(showAll);

  return (<>
    {isOpen &&
    <InfoTextNotification
      infoTextIndex={items.length}
      content={markupStringToHTML(content)}
      hasMoreInfoTexts={items.length > 1}
      showList={showList}
      dismiss={dismissCurrentTip}
    />}
    {showAll &&
    <InfoTextList
      infoTexts={items}
      hide={hideList}
    />}
  </>);
};

InfoTextNotificationContainer.propTypes = {
  content: PropTypes.string,
  shouldClearUI: PropTypes.bool.isRequired,
  setShouldClearUI: PropTypes.func.isRequired
};

export default  renderInTrainerOverlay(InfoTextNotificationContainer);

