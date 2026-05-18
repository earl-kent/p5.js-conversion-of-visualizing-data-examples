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
  // Make a data table from a file that contains the coordinates of
  // each state.
  locationTable = loadTable("data/locations.tsv");

  // Read the data table
  dataTable = new loadTable("data/random.tsv");
}


function setup() {
  createCanvas(640, 400);
  // The row count will be used a lot, store it locally.
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
}


function draw() {
  background(255);
  image(mapImage, 0, 0);

  // Drawing attributes for the ellipses
  smooth();
  fill(192, 0, 0);
  noStroke();

  // Loop through the rows of the locations file and draw the points
  for (let row = 0; row < rowCount; row++) {
    let abbrev = dataTable.getString(row, 0);
    let x = locationTable.findRow(abbrev, 0).getString(1)
    let y = locationTable.findRow(abbrev, 0).getString(2)
    drawData(x, y, abbrev)
  }
}


// Map the size of the ellipse to the data value
function drawData(x, y, abbrev) {
  // Get data value for state
  let v = dataTable.findRow(abbrev, 0).getString(1)
  // Re-map the value to a number between 2 and 40
  let mapped = map(v, 0, dataMax, 2, 40);
  // Draw an ellipse for this item
  ellipse(x, y, mapped, mapped);
}
