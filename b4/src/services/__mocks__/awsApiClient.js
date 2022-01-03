export default jest.fn(() => {
  return {
    authenticate: jest.fn(() => Promise.resolve('en')),
    fetch: jest.fn(() => Promise.resolve({}))
  };
});
