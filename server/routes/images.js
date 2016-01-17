var cv = require('opencv');
var debug = require('debug')('server:server');
var fs = require('fs');
var path = require('path');
var imagesPath = path.join(__dirname, '../public/images/');
var Image = require('../models/Image');

var lowThresh = 0;
var highThresh = 100;
var nIters = 2;
var maxArea = 2500;

var GREEN = [0, 255, 0]; // B, G, R
var WHITE = [255, 255, 255]; // B, G, R
var RED = [0, 0, 255]; // B, G, R

function getTargetPath(img, imagesDir) {
  return path.join(imagesDir, img.name);
}

function saveFile(srcPath, targetPath, callback) {
  fs.rename(srcPath, targetPath, function(err) {
    if (err) return next(err);
    callback(targetPath);
  });
}

function saveImage(targetPath) {
  Image.create({
    path: targetPath
  }, function(err) {
    if (err) return next(err);
  });
}


exports.uploadImage = function(imagesDir) {
  return function(req, res, next) {
    var img = req.files.photo.image;
    var targetPath = getTargetPath(img, imagesDir);
    debug('targetPath: ' + targetPath);
    saveFile(img.path, targetPath, saveImage);
  }
};

exports.testOpenCV = function(req, res) {
  cv.readImage(imagesPath + 'stuff.png', function(err, im) {
    if (err) throw err;
    var width = im.width();
    var height = im.height();
    if (width < 1 || height < 1) throw new Error('Image has no size');

    var big = new cv.Matrix(height, width);

    im.convertGrayscale();
    im_canny = im.copy();

    im_canny.canny(lowThresh, highThresh);
    im_canny.dilate(nIters);

    contours = im_canny.findContours();

    for (i = 0; i < contours.size(); i++) {
      if (contours.area(i) > maxArea) {
        var moments = contours.moments(i);
        var cgx = Math.round(moments.m10 / moments.m00);
        var cgy = Math.round(moments.m01 / moments.m00);
        big.drawContour(contours, i, GREEN);
        big.line([cgx - 5, cgy], [cgx + 5, cgy], RED);
        big.line([cgx, cgy - 5], [cgx, cgy + 5], RED);
      }
    }

    //all.drawAllContours(contours, WHITE);

    big.save(imagesPath + 'big.png');

    var img = fs.readFileSync(imagesPath + 'big.png');
    res.writeHead(200, {
      'Content-Type': 'image/png'
    });
    res.end(img, 'binary');
  });
};
