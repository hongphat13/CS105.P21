// Initialize
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var width = 800;
var height = 600;
var bgRgba = [240, 240, 200, 255];
var pointRgba = [0, 0, 255, 255];
var lineRgba = [0, 0, 0, 255];
var vlineRgba = [255, 0, 0, 255];
canvas.setAttribute("width", width);
canvas.setAttribute("height", height);

var state = 0; // 0: waiting, 1: drawing, 2: finished
var currentAlgorithm = document.getElementById("algorithm").value;
var painter =
  currentAlgorithm === "dda"
    ? new PainterDDA(context, width, height)
    : new PainterBresenham(context, width, height);

function getPosOnCanvas(x, y) {
  var bbox = canvas.getBoundingClientRect();
  return [
    Math.floor(x - bbox.left * (canvas.width / bbox.width) + 0.5),
    Math.floor(y - bbox.top * (canvas.height / bbox.height) + 0.5),
  ];
}

function doMouseMove(e) {
  if (state == 0 || state == 2) return;
  var p = getPosOnCanvas(e.clientX, e.clientY);
  painter.draw(p);
}

function doMouseDown(e) {
  if (e.button != 0) return; // Chỉ xử lý chuột trái

  var p = getPosOnCanvas(e.clientX, e.clientY);

  if (state == 2 && e.ctrlKey) {
    // Ctrl+Click để tiếp tục vẽ
    state = 1;
    painter.addPoint(p);
    painter.draw(p);
  } else if (state != 2) {
    // Click thông thường
    painter.addPoint(p);
    painter.draw(p);
    if (state == 0) state = 1;
  }
}

function doKeyDown(e) {
  if (state == 2) return;
  var keyId = e.keyCode ? e.keyCode : e.which;
  if (keyId == 27 && state == 1) {
    // ESC
    state = 2;
    painter.draw(painter.points[painter.points.length - 1]);
  }
}

function doReset() {
  if (state == 0) return;
  state = 0;
  painter.clear();
}

canvas.addEventListener("mousedown", doMouseDown, false);
canvas.addEventListener("mousemove", doMouseMove, false);
window.addEventListener("keydown", doKeyDown, false);

var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", doReset, false);

document.getElementById("algorithm").addEventListener("change", function () {
  currentAlgorithm = this.value;
  painter =
    currentAlgorithm === "dda"
      ? new PainterDDA(context, width, height)
      : new PainterBresenham(context, width, height);
  doReset();
});
