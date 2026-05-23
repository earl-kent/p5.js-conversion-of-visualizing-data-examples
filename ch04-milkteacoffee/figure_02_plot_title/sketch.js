let data;
let dataMin, dataMax
let plotX1, plotY1;
let plotX2, plotY2;

let currentColumn = 0;
let columnCount;

let yearMin, yearMax;
let years = [];

let plotFont;


// Any files, data or graphic, that need to be used immediately should
// be loaded in preload, which ensure the resource is full loaded and
// available before any code in setup is run.
function preload() {
  // data = loadTable("data/milk-tea-coffee.tsv");
  // data = loadTable("data/milk-tea-coffee.tsv");
  data = new FloatTable("data/milk-tea-coffee.tsv");
  plotFont = loadFont("data/LiberationSans-Regular.ttf");
}


function setup() {
  createCanvas(720, 405);

  columnCount = data.getColumnCount();

  years = data.getRowNames().map((v, _) => Number(v))
  yearMin = years[0];
  yearMax = years[years.length - 1];

  dataMin = 0;
  dataMax = data.getTableMax();

  // Corners of the plotted time series
  plotX1 = 50;
  plotX2 = width - plotX1;
  plotY1 = 60;
  plotY2 = height - plotY1;

  textFont(plotFont);

  smooth();
}


function draw() {
  background(255);

  // Show the plot area as a white box
  fill(255);
  rectMode(CORNERS);
  noStroke();
  rect(plotX1, plotY1, plotX2, plotY2);

  // Draw the title of the current plot
  fill(0);
  textSize(20);
  let title = data.getColumnName(currentColumn);
  text(title, plotX1, plotY1 - 10);

  stroke('#5679C1');
  strokeWeight(5);
  drawDataPoints(currentColumn);
}

// Draw the data as a series of points
function drawDataPoints(col) {
  let rowCount = data.getRowCount();
  // Skip first row, which contains headers.
  for (let row = 0; row < rowCount; row++) {
    let v = data.getFloat(row, col);
    let x = map(years[row], yearMin, yearMax, plotX1, plotX2);
    let y = map(v, dataMin, dataMax, plotY2, plotY1);
    point(x, y);
  }
}
