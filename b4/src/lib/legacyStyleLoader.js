import legacyBootstrapStyles from '../../../b3/app/assets/stylesheets/learning/bootstrap/bootstrap.lazy.less';

let lastCleanupMethod = null;

export const loadLegacyStyles = ({ bootstrapDisabled } = {}) => {
  const cleanupLegacyStyles = () => {
    if (lastCleanupMethod !== cleanupLegacyStyles) return;
    legacyBootstrapStyles.unuse();
  };

  if (!bootstrapDisabled) {
    lastCleanupMethod = cleanupLegacyStyles;
    legacyBootstrapStyles.use();
  }

  return cleanupLegacyStyles;
};
