var debug = require('debug')('api:dtw');
var util = require('util');

exports.DTWDistance = DTWDistance;

function DTWDistance(s, t, w) {
  var n = s.length;
  var m = t.length;
  var DTW = [];

  w = Math.max(w, Math.abs(n - m));

  for (var i = 0; i <= n; i++) {
    DTW[i] = [];
    for (var j = 0; j <= m; j++) {
      DTW[i][j] = Infinity;
    }
  }

  DTW[0][0] = 0;

  var cost;
  for (var i = 0; i < n; i++) {
    for (var j = Math.max(0, i-w); j < Math.min(m, i+w); j++) {
      cost = distance(s[i], t[j])
      DTW[i+1][j+1] = cost + Math.min(
        DTW[i][j+1],
        DTW[i+1][j],
        DTW[i][j]
      )
    }
  }
  //debug(util.inspect(DTW));
  return DTW[n][m];
}

function distance(x, y) {
  var difference = x - y;
  var euclideanDistance = Math.sqrt(difference * difference);
  return euclideanDistance;
};
