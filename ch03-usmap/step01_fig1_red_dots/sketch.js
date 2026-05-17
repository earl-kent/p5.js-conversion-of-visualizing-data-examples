let mapImage;
let locationTable;
let rowCount;

// Any files, data or graphic, that need to be used immediately should
// be loaded in preload, which ensure the resource is full loaded and
// available before any code in setup is run.
function preload() {
  mapImage = loadImage("data/map.png");
  // Make a data table from a file that contains the coordinates of
  // each state.
  locationTable = loadTable("data/locations.tsv");
}


function setup() {
  createCanvas(640, 400);
  // The row count will be used a lot, store it locally.
  rowCount = locationTable.getRowCount();
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
    let x = locationTable.getNum(row, 1);  // column 1
    let y = locationTable.getNum(row, 2);  // column 2
    ellipse(x, y, 9, 9);
  }
}
