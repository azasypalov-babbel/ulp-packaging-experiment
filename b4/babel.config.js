module.exports = {
  sourceType: 'unambiguous',
  presets: [
    [
      '@babel/preset-env',
      { useBuiltIns: 'usage', corejs: 3 }
    ],
    '@babel/preset-react',
    '@babel/preset-typescript'
  ],
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          { targets: { node: 'current' } }
        ],
        '@babel/preset-typescript'
      ],
    },
    development: {
      plugins: ['babel-plugin-styled-components']
    }
  }
};
