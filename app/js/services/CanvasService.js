(function() {
  'use strict';
  define([], function() {
    var factory = function($log, $ionicScrollDelegate) {
      function canvasClear(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      }

      function drawGuideline(ctx, width, height, lineWidth, color) {
        var middle = Math.round(width / 2);
        ctx.beginPath();
        ctx.moveTo(middle, 0);
        ctx.lineTo(middle, height);
        ctx.lineWidth = lineWidth || 2;
        ctx.strokeStyle = color || 'grey';
        ctx.stroke();
      }

      function drawPath(ctx, path, color, lineWidth, length, height, isFunction, isDescriptor) {

        if (path && path.length) {
          ctx.beginPath();
          if (isFunction) {
            ctx.moveTo(path[0].x, height * (1 - path[0].y));
          } else {
            ctx.arc(path[0].x, path[0].y, 5, 0, 2 * Math.PI);
            ctx.moveTo(path[0].x, path[0].y);
          }
          var step = length ? (path.length / length) : 1;
          // console.log("path = ", path);
          // console.log("length = ", length);
          // console.log("step = ", step);
          for (var i = 1; i < path.length; i++) {
            if (isFunction) {
              ctx.lineTo(path[i].x / step, height * (1 - path[i].y));
            } else if (isDescriptor) {
              ctx.lineTo(i / step, height * (1 - path[i]));
            } else {
              ctx.lineTo(path[i].x / step, path[i].y);
              if (i === path.length - 1) {
                ctx.arc(path[i].x / step, path[i].y, 2, 0, 2 * Math.PI);
              }
            }
          }
          ctx.lineWidth = lineWidth || 3;
          ctx.strokeStyle = color || 'green';
          ctx.stroke();
        }
      }

      function drawPoint(ctx, point, color) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.strokeStyle = color || 'red';
        ctx.stroke();
      }

      function getCenter(points) {
        if (!points) {
          points = {
            lenght: 0
          };
        }
        var x = 0;
        var y = 0;
        for (var i = 0; i < points.length; i++) {
          x += points[i].x;
          y += points[i].y;
        }
        return {
          x: Math.round(x / points.length),
          y: Math.round(y / points.length)
        };
      }

      function getDistance(A, B) {
        return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
      }

      function getPath(points, center) {
        if (!points) {
          points = {
            lenght: 0
          };
        }
        var path = [];
        var maxDist = 0;
        var dist = 0;
        for (var i = 0; i < points.length; i++) {
          dist = getDistance(points[i], center);
          maxDist = dist > maxDist ? dist : maxDist;
          path[i] = {
            x: i,
            y: getDistance(points[i], center)
          };
        }
        for (var j = 0; j < points.length; j++) {
          path[j].y = (path[j].y / maxDist);
        }
        return path;
      }

      function getCanvas(canvasID) {
        return document.getElementById(canvasID);
      }

      function getContext(canvasID) {
        var canvas = getCanvas(canvasID);
        return canvas.getContext('2d');
      }

      function renderImageData(imageData, imgU8, ctx) {
        // render result back to canvas
        var dataU32 = new Uint32Array(imageData.data.buffer);
        var alpha = (0xff << 24);
        var i = imgU8.cols * imgU8.rows,
          pix = 0;
        while (--i >= 0) {
          pix = imgU8.data[i];
          dataU32[i] = alpha | (pix << 16) | (pix << 8) | pix;
        }

        ctx.putImageData(imageData, 0, 0);
      }

      function initEraser(canvasID) {
        var canvas = {};
        canvas.node = getCanvas(canvasID);
        canvas.context = canvas.node.getContext('2d');
        var ctx = canvas.context;
        ctx.fillCircle = function(x, y, radius, fillColor) {
          this.fillStyle = fillColor;
          this.beginPath();
          this.moveTo(x, y);
          this.arc(x, y, radius, 0, Math.PI * 2, false);
          this.fill();
        };

        // bind mouse events
        canvas.node.onmousemove = function(e) {
          e.stopPropagation();
          if (!canvas.isDrawing) {
            return;
          }
          var headerHeight = 51;
          var scrollOffset = $ionicScrollDelegate.getScrollPosition().top - headerHeight;
          var x = e.pageX - this.offsetLeft;
          var y = e.pageY - this.offsetTop + scrollOffset;
          var radius = 6; // or whatever
          var fillColor = '#fff';
          ctx.fillCircle(x, y, radius, fillColor);
        };
        canvas.node.onmousedown = function(e) {
          canvas.isDrawing = isErasing;
        };
        canvas.node.onmouseup = function(e) {
          canvas.isDrawing = false;
        };
      }
      var isErasing = false;

      function setErasing(value) {
        isErasing = value;
      }

      return {
        canvasClear: canvasClear,
        drawGuideline: drawGuideline,
        drawPath: drawPath,
        getCenter: getCenter,
        getContext: getContext,
        getPath: getPath,
        drawPoint: drawPoint,
        initEraser: initEraser,
        setErasing: setErasing,
        renderImageData: renderImageData
      };
    };

    factory.$inject = ['$log', '$ionicScrollDelegate'];
    return factory;
  });
})();
