const path = require('path');
const { BASE_PATH, B3_PATH, PUBLIC_PATH } = require('./paths');
const loaders = require('./loaders');
const plugins = require('./plugins');
const webpack = require('webpack');

const targetPlatform = process.env.WEBVIEW === '1' ? 'webview' : 'web';
const resolveFromServicesDir = (appendix) => {
  return path.join(BASE_PATH, 'src/services', appendix);
};

module.exports = {
  context: BASE_PATH,
  entry: {
    /** prioritized modules bootstrapping */
    application: [
      // use features initializer for platform
      `./src/initializers/features.${targetPlatform}.js`,

      // global initializers (rollbar, ...)
      './src/init.js',

      // mounting app
      './src/index.js'
    ]
  },
  output: {
    publicPath: '',
    path: PUBLIC_PATH,
    chunkFilename: '[name].js',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@assets': path.resolve(BASE_PATH, '/assets/'),
      '@spec': path.resolve(BASE_PATH, '/spec/'),
      '@src': path.resolve(BASE_PATH, '/src/'),
      '@stories': path.resolve(BASE_PATH, '/stories/'),
      '@vendor': path.resolve(BASE_PATH, '/vendor/'),
      // override services index with platform specific implementations
      [resolveFromServicesDir('index.js')]: resolveFromServicesDir(
        `index.${targetPlatform}.js`
      )
    },
    modules: [path.resolve(BASE_PATH), 'node_modules'],
    extensions: ['.js', '.json', '.ts', '.tsx'],
    // [b3] fallbacks for analyserLib.js
    fallback: {
      crypto: false,
      fs: false,
      path: false
    }
  },
  plugins: [
    ...plugins,
    new webpack.IgnorePlugin({
      resourceRegExp: /webpack-stats\.json$/
    }),
    // Ignore node core dependencies required by AnalyserLib in learning.gem.
    // It falsely assumes a Node environment during build time
    // and webpack would add 300kB of unnecessary polyfills otherwise.
    new webpack.IgnorePlugin({
      resourceRegExp: /^buffer|crypto|fs$/,
      contextRegExp: /analyserLib\.js/
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        loader: 'babel-loader',
        include: [
          path.resolve(BASE_PATH, 'src'),
          // These modules are published as ES2015 and must be transpiled
          path.resolve(BASE_PATH, 'node_modules/@lessonnine/my.js'),
          path.resolve(BASE_PATH, 'node_modules/@lessonnine/babbel-markup-helper.js'),
          path.resolve(BASE_PATH, 'node_modules/survey.js'),

          /**
           *  This dependency is only required for webview, but it is always imported
           *  Without transpilation, it breaks IE11
           */
          path.resolve(BASE_PATH, 'node_modules/event-target-shim'),
          path.resolve(BASE_PATH, 'node_modules/seamless-scroll-polyfill'),

          // Storybook specific files
          path.resolve(BASE_PATH, 'stories'),
          path.resolve(BASE_PATH, '.storybook')
        ]
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source'
      },
      {
        test: /\.scss$/,
        use: loaders.sassLoader
      },
      {
        test: /\.css$/,
        use: loaders.cssLoader
      },
      {
        test: /\.(woff|woff2|otf|eot|ttf)$/,
        type: 'asset/resource'
      },
      {
        test: /\.mp3$/,
        type: 'asset/resource'
      },
      {
        test: /\.svg$/,
        type: 'asset/inline',
        use: 'svgo-loader'
      },
      {
        // [b3] raster image formats
        test: /\.png$|\.gif$/,
        type: 'asset/resource'
      },
      {
        // [b3] lazy load b3 styles
        test: /\.lazy\.less/i,
        use: loaders.lazyLessLoader
      },
      {
        // [b3] lazy load b3 styles
        test: /\.less/i,
        exclude: /\.lazy\.less/i,
        use: loaders.lessLoader
      },
      {
        // [b3] loads all templates from b3
        test: /\.hbs$/,
        loader: 'handlebars-loader',
        options: {
          extensions: '.js.hbs',
          partialDirs: [path.join(B3_PATH, 'app/assets/learning/templates')]
        }
      }
    ]
  }
};
