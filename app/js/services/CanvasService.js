define([], function() {
  "use strict";
  var factory = function($log) {
    function canvasClear(ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    function drawPath(ctx, path, color, lineWidth, length, height, isFunction) {
      if (path && path.length) {
        ctx.beginPath();
        if (isFunction) {
          ctx.moveTo(path[0].x, height * (1 - path[0].y));
        } else {
          ctx.moveTo(path[0].x, path[0].y);
        }
        var step = length ? (path.length / length) : 1;
        // console.log("path = ", path);
        // console.log("length = ", length);
        // console.log("step = ", step);
        for (var i = 1; i < path.length; i++) {
          if (isFunction) {
            ctx.lineTo(path[i].x / step, height * (1 - path[i].y));
          } else {
            ctx.lineTo(path[i].x / step, path[i].y);
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
      for (var i = 0; i < points.length; i++) {
        path[i].y = (path[i].y / maxDist);
      }
      return path;
    }

    function getContext(canvasID) {
      var canvas = document.getElementById(canvasID);
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

    return {
      canvasClear: canvasClear,
      drawPath: drawPath,
      getCenter: getCenter,
      getContext: getContext,
      getPath: getPath,
      drawPoint: drawPoint,
      renderImageData: renderImageData
    };
  };

  factory.$inject = ['$log'];
  return factory;
});
