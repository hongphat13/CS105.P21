function PainterBresenham(context, width, height) {
  this.context = context;
  this.imageData = context.createImageData(width, height);
  this.points = [];
  this.now = [-1, -1];
  this.width = width;
  this.height = height;

  this.getPixelIndex = function (x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return -1;
    return (x + y * width) << 2;
  };

  this.setPixel = function (x, y, rgba) {
    let pixelIndex = this.getPixelIndex(x, y);
    if (pixelIndex == -1) return;
    for (var i = 0; i < 4; i++) {
      this.imageData.data[pixelIndex + i] = rgba[i];
    }
  };

  this.drawPoint = function (p, rgba) {
    let x = p[0];
    let y = p[1];
    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++) this.setPixel(x + i, y + j, rgba);
  };

  this.drawLine = function (p0, p1, rgba) {
    let x0 = p0[0],
      y0 = p0[1];
    let x1 = p1[0],
      y1 = p1[1];
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      this.setPixel(x0, y0, rgba);
      if (x0 === x1 && y0 === y1) break;
      let e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
  };

  this.drawBkg = function (rgba) {
    for (let i = 0; i < this.width; i++)
      for (let j = 0; j < this.height; j++) this.setPixel(i, j, rgba);
  };

  this.clear = function () {
    this.points.length = 0;
    this.drawBkg(bgRgba);
    this.context.putImageData(this.imageData, 0, 0);
  };

  this.addPoint = function (p) {
    this.points.push(p);
  };

  this.draw = function (p) {
    let n = this.points.length;
    this.drawBkg(bgRgba);
    for (let i = 0; i < n; i++) this.drawPoint(this.points[i], pointRgba);
    for (let i = 0; i < n - 1; i++)
      this.drawLine(this.points[i], this.points[i + 1], lineRgba);
    if (
      n > 0 &&
      (this.points[n - 1][0] != p[0] || this.points[n - 1][1] != p[1])
    )
      this.drawLine(this.points[n - 1], p, vlineRgba);
    this.context.putImageData(this.imageData, 0, 0);
  };

  this.clear();
}
