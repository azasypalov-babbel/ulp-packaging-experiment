import React, { useEffect, useState } from 'react';

import { getDisplayName } from '../getDisplayName';

const withFontsLoaded = (WrappedComponent) => {
  const WithFontsLoaded = (props) => {
    const [isLoadingFonts, setLoadingFonts] = useState(true);

    async function isReady() {
      await document.fonts.ready;
      setLoadingFonts(false);
    }

    useEffect(() => {
      isReady();
    }, []);


    return (
      <WrappedComponent {...props} isLoadingFonts={isLoadingFonts} />
    );
  };
  WithFontsLoaded.displayName = `WithFontsLoaded(${getDisplayName(WrappedComponent)})`;

  return WithFontsLoaded;
};

export default withFontsLoaded;
