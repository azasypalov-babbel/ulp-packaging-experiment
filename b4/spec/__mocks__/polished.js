const polished = jest.createMockFromModule('polished');

const functionToString = (fnName) => (value, color) => {
  const getString = (color) => `${fnName}(${value}, ${color})`;
  if (color) return getString(color);
  return getString;
};

polished.setSaturation = functionToString(`setSaturation`);
polished.setLightness = functionToString(`setLightness`);
polished.transparentize = functionToString(`transparentize`);

polished.lighten = functionToString(`lighten`);
polished.rem = jest.fn((val) => `rem(${val})`);

module.exports = polished;
