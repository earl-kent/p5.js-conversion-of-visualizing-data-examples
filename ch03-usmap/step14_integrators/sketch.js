let mapImage;
let locationTable;
let nameTable;
let rowCount;

let dataTable;
let dataMin = -10;
let dataMax = 10;
let font;

let interpolators = [];

// Any files, data or graphic, that need to be used immediately should
// be loaded in preload, which ensure the resource is full loaded and
// available before any code in setup is run.
function preload() {
  mapImage = loadImage("data/map.png");
  locationTable = loadTable("data/locations.tsv");
  nameTable = loadTable("data/names.tsv");

  // Read the data table
  dataTable = new loadTable("data/random.tsv");

  font = loadFont("data/UniversalisADFStd-Bold.otf");
}


function setup() {
  createCanvas(640, 400);
  rowCount = locationTable.getRowCount();

  for (let row = 0; row < rowCount; row++) {
    let initialValue = dataTable.getRow(row).getNum(1);
    interpolators[row] = new Integrator(initialValue);
  }

  smooth();
  noStroke();
  textFont(font);
}


// Global variables set in drawData() and read in draw()
let closestDist;
let closestText;
let closestTextX;
let closestTextY;


function draw() {
  background(255);
  image(mapImage, 0, 0);

  for (let row = 0; row < rowCount; row++) {
    interpolators[row].update();
  }

  // Use the built-in width and height variables to set the
  // closest distance high so it will be replaced immediately
  closestDist = width * height;

  for (let row = 0; row < rowCount; row++) {
    let abbrev = dataTable.getString(row, 0);
    let x = locationTable.findRow(abbrev, 0).getNum(1)
    let y = locationTable.findRow(abbrev, 0).getNum(2)
    drawData(x, y, abbrev);
  }

  // Use global variables set in drawData()
  // to draw text related to closest circle.
  if (closestDist != width * height) {
    fill(0);
    textAlign(CENTER);
    text(closestText, closestTextX, closestTextY);
  }
}


function drawData(x, y, abbrev) {
  // Figure out what row this is
  let row = dataTable.rows.indexOf(dataTable.findRow(abbrev, 0))
  let v = interpolators[row].value();

  let radius = 0;
  if (v >= 0) {
    radius = map(v, 0, dataMax, 1.5, 15);
    fill('#333366');  // blue
  } else {
    radius = map(v, 0, dataMin, 1.5, 15);
    fill('#ec5166');  // red
  }
  ellipseMode('RADIUS');
  ellipse(x, y, radius, radius);

  let d = dist(x, y, mouseX, mouseY);
  if ((d < radius + 2) && (d < closestDist)) {
    closestDist = d;
    let name = nameTable.findRow(abbrev, 0).getString(1);
    closestText = name + " " + nfp(interpolators[row].target(), 0, 2);
    closestTextX = x;
    closestTextY = y - radius - 4;
  }
}


function keyPressed() {
  if (key == ' ') {
    updateTable();
  }
}


function updateTable() {
  for (let row = 0; row < rowCount; row++) {
    let newValue = random(-10, 10);
    interpolators[row].target(newValue);
  }
}
