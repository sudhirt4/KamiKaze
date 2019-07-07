function filterNull(arr) {
  return arr.filter(function(item) {
    return !!item;
  });
}

function getPossibleX(value, length) {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(value * i);
  }
  return arr;
}
