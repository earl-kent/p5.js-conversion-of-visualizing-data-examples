let data;
let dataMin, dataMax
let plotX1, plotY1;
let plotX2, plotY2;

let currentColumn = 1;
let columnCount;

let yearMin, yearMax;
let years = [];

let plotFont;


// Any files, data or graphic, that need to be used immediately should
// be loaded in preload, which ensure the resource is full loaded and
// available before any code in setup is run.
function preload() {
  data = loadTable("data/milk-tea-coffee.tsv");
  plotFont = loadFont("data/LiberationSans-Regular.ttf");
}

function isValid(data, row, col, rowCount) {
  if (row < 0) return false;
  if (row >= rowCount) return false;
  if (col >= data[row].length) return false;
  if (col < 0) return false;
  return !Float.isNaN(data[row][col]);
}

// Returns the maximum value of a table, omitting the first column.
function getTableMax(table) {
  let m = -Number.MAX_VALUE;
  for (let row = 1; row < table.getRowCount(); row++) {
    for (let col = 1; col < table.getColumnCount(); col++) {
      let x = data.getNum(row, col);
      if (x > m) {
        m = x;
      }
    }
  }
  return m;
}


function setup() {
  createCanvas(720, 405);

  columnCount = data.getColumnCount();

  years = data.getColumn(0).slice(1, data.getRowCount() -1);
  yearMin = data.getNum(1, 0);
  yearMax = data.getNum(data.getRowCount() -1, 0);

  dataMin = 0;
  dataMax = getTableMax(data);

  // Corners of the plotted time series
  plotX1 = 50;
  plotX2 = width - plotX1;
  plotY1 = 60;
  plotY2 = height - plotY1;

  textFont(plotFont);

  textFont(plotFont);

  smooth();
}


function draw() {
  background(255);

  // Show the plot area as a white box
  fill(255);
  rectMode('CORNERS');
  noStroke();
  rect(plotX1, plotY1, plotX2, plotY2);

  // Draw the title of the current plot
  fill(0);
  textSize(20);
  let title = data.getString(0, currentColumn);
  text(title, plotX1, plotY1 - 10);

  stroke('#5679C1');
  strokeWeight(5);
  drawDataPoints(currentColumn);
}

// Draw the data as a series of points
function drawDataPoints(col) {
  let rowCount = data.getRowCount() - 1;
  // Skip first row, which contains headers.
  for (let row = 1; row < rowCount; row++) {
    let v = data.getNum(row, col);
    let x = map(years[row], yearMin, yearMax, plotX1, plotX2);
    let y = map(v, dataMin, dataMax, plotY2, plotY1);
    point(x, y);
  }
}
