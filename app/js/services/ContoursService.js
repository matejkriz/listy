/*
 * https://github.com/Doodle3D/Contour-finding-experiment
 * sources (re-implement basic finder and then add iterative functionality?):
 * - https://github.com/Dkendal/Moore-Neighbor_Contour_Tracer/blob/master/ContourTrace.cs
 * - http://www.imageprocessingplace.com/downloads_V3/root_downloads/tutorials/contour_tracing_Abeer_George_Ghuneim/moore.html
 */
(function() {
  'use strict';
  define([], function() {
    var factory = function ContourFinder() {

      this.pixelsWidth; // pixels width
      this.pixelsHeight; // pixels height
      this.pixels; // pixels (single array of r,g,b,a values of image)
      this.fColor; // foreground color
      this.bColor; // background color
      this.threshold;
      //this.maxContourPoints = Infinity; //was 500*4
      this.maxContourPoints = 500 * 500;
      this.allContours = [];

      this.offset4 = function(x, y) {
        return (y * this.pixelsWidth + x) * 4;
      };
      this.offset = function(x, y) {
        return (y * this.pixelsWidth + x) * 4;
      };

      this.getPixel = function(x, y) {
        return {
          r: this.pixels[this.offset4(x, y)],
          g: this.pixels[this.offset4(x, y) + 1],
          b: this.pixels[this.offset4(x, y) + 2],
          a: this.pixels[this.offset4(x, y) + 3]
        };
      };

      //	this.setPixel = function(x, y, pixel) {
      //		this.pixels[this.offset4(x, y)] = pixel.r;
      //		this.pixels[this.offset4(x, y) + 1] = pixel.g;
      //		this.pixels[this.offset4(x, y) + 2] = pixel.b;
      //		this.pixels[this.offset4(x, y) + 3] = pixel.a;
      //	}
      this.setPixel = function(x, y, pixel) {
        this.pixels[this.offset4(x, y)] = pixel[0];
        this.pixels[this.offset4(x, y) + 1] = pixel[1];
        this.pixels[this.offset4(x, y) + 2] = pixel[2];
        this.pixels[this.offset4(x, y) + 3] = pixel[3];
      };


      this.findContours = function(image, foregroundColor, backgroundColor, threshold) {
        this.allContours = [];
        var w = this.pixelsWidth = image.width;
        var h = this.pixelsHeight = image.height;
        this.fColor = foregroundColor;
        this.bColor = backgroundColor;
        this.threshold = threshold;

        // create a new pixel array
        var imageCtx = image.getContext('2d');
        var imageData = imageCtx.getImageData(0, 0, w, h);
        // console.log("imageData: ",imageData);
        var pixels = this.pixels = imageData.data;
        // console.log("pixels: ",pixels);
        var prevValue = 0;

        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var pix = this.getPixel(x, y);
            var factor = ((pix.r * .3 + pix.g * .59 + pix.b * .11))

            var value = (factor > threshold) ? 255 : 0; // threshold


            //this.setPixel(x, y, { r: value, g: value, b: value, a: pix.a });
            this.setPixel(x, y, [value, value, value, pix.a]);
          }
        }

        for (var y = 0; y < h; y++) {
          for (var x = 0; x < w; x++) {
            var pix = this.getPixel(x, y);

            var value = pix.g;
            value = (value > threshold) ? 255 : 0;
            // if we enter a foreGround color and red isn't 0 (already stored as contour)
            if (prevValue === backgroundColor && value === foregroundColor && pix.r != 0) {
              var points = this.followContour({
                x: x,
                y: y
              });
              this.allContours.push(points);
              if(points.length > 500) {
                return this.allContours;
              }
            }

            //pix.r = 255;
            this.setPixel(x, y, [pix.r, pix.g, pix.b, pix.a]);
            prevValue = value;
          }
        }

        /*for (var i = 0, n = pixels.length; i < n; i += 4) {
        	var grayscale = pixels[i  ] * .3 + pixels[i+1] * .59 + pixels[i+2] * .11;

        	alpha = pixels[i+3];
        	//console.log("alpha: ",alpha);
        	var value = (alpha > threshold)? 255 : 0;
        	//console.log("value: ",value);
        	/*pixels[i  ] = value; 	// red
        	pixels[i+1] = value; 	// green
        	pixels[i+2] = value; 	// blue
        	pixels[i+3] = value; 	// alpha*/
        /*
        	if(alpha > threshold) {
        		pixels[i  ] = 255; 	// red
        	}
        }*/

        /*for (var y = 0; y < height; y++) {
        	inpos = y * width * 4; // *4 for 4 ints per pixel
        	outpos = inpos + w2 * 4
        	for (var x = 0; x < w2; x++) {
        		r = imageData.data[inpos++] / 3; // less red
        		g = imageData.data[inpos++] / 3; // less green
        		b = imageData.data[inpos++] * 5; // MORE BLUE
        		a = imageData.data[inpos++];     // same alpha

        		b = Math.min(255, b); // clamp to [0..255]

        		imageData.data[outpos++] = r;
        		imageData.data[outpos++] = g;
        		imageData.data[outpos++] = b;
        		imageData.data[outpos++] = a;
        	}
        }*/

        // copy the image data back onto the canvas
        if (this.allContours.length === 0) {
          imageCtx.putImageData(imageData, 0, 0);
        }
        return this.allContours;
      };

      this.followContour = function(startPoint) {
        var points = []; // start new contour
        points.push(startPoint);
        var w = this.pixelsWidth;
        var h = this.pixelsHeight;


        var point = startPoint;
        var numPoints = 0;

        // define neighborhood (with: x offset, y offset, index offset, next neighborhood element to check)
        //		var neighborhood = [
        //			[ 1,  0,  1,   7], // east
        //			[ 1,  1,  w+1, 0], // south-east
        //			[ 0,  1,  w,   1], // south
        //			[-1,  1,  w-1, 2], // south-west
        //			[-1,  0, -1,   3], // west
        //			[-1, -1, -w-1, 4], // north-west
        //			[ 0, -1, -w,   5], // north
        //			[ 1, -1, -w+1, 6]  // north-east
        //		];

        //		var neighborhood = [
        //            { xd: -1, yd:  0, offs: -1,   next: 7 }, // west
        //            { xd: -1, yd: -1, offs: -w-1, next: 0 }, // north-west
        //            { xd:  0, yd: -1, offs: -w,   next: 1 }, // north
        //            { xd:  1, yd: -1, offs: -w+1, next: 2 }, // north-east
        //            { xd:  1, yd:  0, offs:  1,   next: 3 }, // east
        //            { xd:  1, yd:  1, offs:  w+1, next: 4 }, // south-east
        //            { xd:  0, yd:  1, offs:  w,   next: 5 }, // south
        //            { xd: -1, yd:  1, offs:  w-1, next: 6 }  // south-west
        //		];

        //		var neighborhood = [
        //	        [-1,  0, -1,   7],
        //	        [-3, -1, -w-3, 7],
        //	        [-2, -1, -w-2, 1],
        //	        [-1, -1, -w-1, 1],
        //	        [ 1,  0,  1,   3],
        //	        [ 3,  1,  w+3, 3],
        //	        [ 2,  1,  w+2, 5],
        //	        [ 1,  1,  w+1, 5]
        //        ];
        var neighborhood = [{
            xd: 1,
            yd: 0,
            offs: 1,
            next: 3
          }, // east
          {
            xd: 0,
            yd: 1,
            offs: w,
            next: 0
          }, // south
          {
            xd: -1,
            yd: 0,
            offs: -1,
            next: 1
          }, // west
          {
            xd: 0,
            yd: -1,
            offs: -w,
            next: 2
          } // north
        ];

        var prevIndex;
        var nextNeighbor = 0; // starting point for neighborhood search (index for neighborhood array)
        do {
          //console.log("  point: ",point.x,point.y);

          // go clockwise trough neighbors
          var index = this.offset4(point.x, point.y);
          this.pixels[index] = 0; // r
          this.pixels[index + 2] = 0; // b
          var newPoint = {};
          //console.log("  index: ",index);
          var i = nextNeighbor;
          //console.log("    nextNeighbor: ",nextNeighbor);
          for (var j = 0; j < neighborhood.length; j++) {

            //console.log("    neighbor: ",i);
            var nIndex = index + neighborhood[i].offs * 4;
            //console.log("      neighbor index: ",nIndex);
            //console.log("      neighbor g index: ",nIndex+1);
            //console.log("      value: ",this.pixels[nIndex+1]);
            // todo: check if in range
            if (this.pixels[nIndex + 1] === this.fColor && nIndex != prevIndex) {
              //console.log("      === fColor");
              newPoint = {
                x: point.x + neighborhood[i].xd,
                y: point.y + neighborhood[i].yd
              };
              nextNeighbor = neighborhood[i].next;
              break;
            }

            i++;
            i = i % neighborhood.length;

          }
          if (newPoint === undefined) {
            break;
          } else {
            //console.log("      new point: ",newPoint[0],newPoint[1]);
            point = newPoint;
            points.push(point);
            //console.log("      points: ",this.getPoints(points));

          }

          prevIndex = index;

          //var index = y*w*4+x*4;
          numPoints++;
          //console.log(point[0],startPoint[0],"  ",point[1],startPoint[1]);
        } while (!(point.x === startPoint.x && point.y === startPoint.y) && numPoints < this.maxContourPoints);
        this.closeContour(points);

        return points;
      };

      this.closeContour = function(points) {
        points[points.length - 1] = points[0];
      };

      this.getPoints = function(points) {
        var log = "";
        for (var i = 0; i < points.length; i++) {
          var point = points[i];
          log += point.x + "," + point.y + " > ";
        }
        return log;
      };

      function findOffset(points, centerPoint) {
        var offset = 0;
        var middle = centerPoint.x;
        var lowest = 0;
        for (var i = 0; i < points.length; i++) {
          if (Math.abs(points[i].x - middle) < 3) {
            if (points[i].y > lowest) {
              lowest = points[i].y;
              offset = i;
            }
          }
        }
        return offset;
      }

      function rotateArray(points, offset) {
        return points;
      }

      Array.prototype.rotate = (function() {
        // save references to array functions to make lookup faster
        var push = Array.prototype.push,
          splice = Array.prototype.splice;

        return function(count) {
          var len = this.length >>> 0, // convert to uint
            count = count >> 0; // convert to int

          // convert count to value in range [0, len)
          count = ((count % len) + len) % len;

          // use splice.call() instead of this.splice() to make function generic
          push.apply(this, splice.call(this, 0, count));
          return this;
        };
      })();

      this.startBottom = function(points, centerPoint) {
        var offset = findOffset(points, centerPoint);
        points = points.rotate(offset);
        return points;
      }
    }
    return factory;
  });
})();
