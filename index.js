var spritesmith = require('spritesmith');
var templater = require('spritesheet-templates');
var path = require('path');
var fs = require('fs');

function SpritesmithPlugin(options) {
  this.imagesSrc = options.src;
  this.targetCss = options.target.css;
  this.targetImage = options.target.image;
  this.publicPath = options.publicPath;
  this.spritesmithConfig = options.spritesmithConfig || {};
  this.spriteExt = options.spriteExt || '.png';
  this.template = options.template || {};
  this.formatFileName = options.formatFileName || function(filename) {
    return filename.replace('@', ':');
  }
}

SpritesmithPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('compile', function(compilation, callback){
    fs.readdir(self.imagesSrc, function(err, items) {
      var files = items.filter(function(item) {
        return path.extname(item) === self.spriteExt;
      }).map(function(item){
          return self.imagesSrc + '/' + item;
      });
      spritesmith.run(Object.assign({src: files}, self.spritesmithConfig), function (err, result) {
        fs.writeFileSync(self.targetImage, result.image);
        var css = templater({
          sprites: Object.keys(result.coordinates).map(function(key) {
            return {
              name: self.formatFileName(path.basename(key, self.spriteExt)),
              x: result.coordinates[key].x,
              y: result.coordinates[key].y,
              width: result.coordinates[key].width,
              height: result.coordinates[key].height,
            }
          }),
          spritesheet: {
            image: path.join(self.publicPath, path.basename(self.targetImage)),
            width: result.properties.width,
            height: result.properties.height
          }
        }, self.template);
        fs.writeFileSync(self.targetCss, css);
        callback();
      });
    });
  });
}


module.exports = SpritesmithPlugin;
