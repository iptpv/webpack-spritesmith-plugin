var path = require('path');
var SpritesmithPlugin = require('../');

module.exports = {
  output: {
    path: __dirname + '/target',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.css$/, loaders: ['style', 'css']}
    ],
  },
  plugins: [
    new SpritesmithPlugin({
        publicPath: '/static',
        spritesmithConfig: {
          algorithm: 'alt-diagonal'
        },
        src: path.resolve(__dirname, 'images'),
        target: {
          image: path.resolve(__dirname, 'target/sprite.png'),
          css: path.resolve(__dirname, 'target/sprite.css')
        },
        template: {
          format: 'css',
          formatOpts: {
            cssSelector: function(sprite) {
              return '.' + sprite.name;
            }
          }
        },
        formatFileName: function(filename) {
          return filename.replace('@', ':');
        }
    })
  ]
}
