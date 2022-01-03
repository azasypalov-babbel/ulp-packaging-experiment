module.exports = {
  plugins: [
    require('postcss-prefixer')({ prefix: 'loy-' }),
    require('postcss-wrap')({ selector: '.loy' })
  ]
};
