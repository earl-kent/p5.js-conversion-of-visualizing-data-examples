let mapImage;
let locationTable;
let rowCount;

let dataTable;
let dataMin = Number.MAX_VALUE;
let dataMax = Number.MIN_VALUE;

// Any files, data or graphic, that need to be used immediately should
// be loaded in preload, which ensure the resource is full loaded and
// available before any code in setup is run.
function preload() {
  mapImage = loadImage("data/map.png");
  locationTable = loadTable("data/locations.tsv");

  // Read the data table
  dataTable = new loadTable("data/random.tsv");
}


function setup() {
  createCanvas(640, 400);
  rowCount = locationTable.getRowCount();

  // Find the minimum and maximum values
  for (let row = 0; row < rowCount; row++) {
    let v = dataTable.getNum(row, 1);
    if (v > dataMax) {
      dataMax = v;
    }
    if (v < dataMin) {
      dataMin = v;
    }
  }
  smooth();
  noStroke();
}


function draw() {
  background(255);
  image(mapImage, 0, 0);

  for (let row = 0; row < rowCount; row++) {
    let abbrev = dataTable.getString(row, 0);
    let x = locationTable.findRow(abbrev, 0).getString(1)
    let y = locationTable.findRow(abbrev, 0).getString(2)
    drawData(x, y, abbrev);
  }
}


function drawData(x, y, abbrev) {
  let v = dataTable.findRow(abbrev, 0).getString(1);
  let diameter = 0;

  if (v >= 0) {
    diameter = map(v, 0, dataMax, 3, 30);
    fill('#333366');  // blue
  } else {
    diameter = map(v, 0, dataMin, 3, 30);
    fill('#ec5166');  // red
  }
  ellipse(x, y, diameter, diameter);
}
