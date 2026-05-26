let data;
let dataMin, dataMax
let plotX1, plotY1;
let plotX2, plotY2;
let labelX, labelY;

let rowCount;
let columnCount;
let currentColumn = 0;

let yearMin, yearMax;
let years = [];

let yearInterval = 10;
let volumeInterval = 10;

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

  rowCount = data.getRowCount();
  columnCount = data.getColumnCount();

  years = data.getRowNames().map((v, _) => Number(v))
  yearMin = years[0];
  yearMax = years[years.length - 1];

  dataMin = 0;
  dataMax = ceil(data.getTableMax() / volumeInterval) * volumeInterval;

  // Corners of the plotted time series
  plotX1 = 120;
  plotX2 = width - 80;
  labelX = 50;
  plotY1 = 60;
  plotY2 = height - 70;
  labelY = height - 25;

  dataMin = 0;
  dataMax = data.getTableMax();


  textFont(plotFont);

  smooth();
}


function draw() {
  background(255);

  drawTitleTabs();
  drawAxisLabels();
  drawVolumeLabels();

  noStroke();
  fill('#5679C1');
  drawDataBars(currentColumn);

  drawYearLabels();
}


function drawTitle() {
  fill(0);
  textSize(20);
  textAlign(LEFT);
  let title = data.getColumnName(currentColumn);
  text(title, plotX1, plotY1 - 25);
}

// Add above setup()
let tabLeft = [];
let tabRight  = [];
let tabTop, tabBottom;
let xTabPad = 10;
let yTabPad = 5;

function drawTitleTabs() {
  rectMode(CORNERS);
  noStroke();
  textSize(20);
  textAlign(LEFT);

  // On first use of this method, allocate space for an array to store
  // the values for the left and right edges of the tabs
  if (tabLeft == null) {
    tabLeft = new Array(columnCount);
    tabRight = new Array(columnCount);
  }

  let runningX = plotX1;
  tabTop = plotY1 - textAscent() - 15;
  tabBottom = plotY1;

  for (let col = 0; col < columnCount; col++) {
    let title = data.getColumnName(col);
    tabLeft[col] = runningX;
    let titleWidth = textWidth(title);
    tabRight[col] = tabLeft[col] + xTabPad + titleWidth + xTabPad;

    // If the current tab, set its background white, otherwise use pale gray
    fill(col == currentColumn ? 255 : 224);
    rect(tabLeft[col], tabTop, tabRight[col], tabBottom);

    // If the current tab, use black for the text, otherwise use dark gray
    fill(col == currentColumn ? 0 : 64);
    text(title, runningX + xTabPad, plotY1 - 10 - yTabPad);

    runningX = tabRight[col];
  }
}


function mousePressed() {
  if (mouseY > tabTop && mouseY < tabBottom) {
    for (let col = 0; col < columnCount; col++) {
      if (mouseX > tabLeft[col] && mouseX < tabRight[col]) {
        setCurrent(col);
      }
    }
  }
}


function setCurrent(col) {
  currentColumn = col;
}


function drawAxisLabels( ) {
  fill(0);
  textSize(13);
  textLeading(15);
  textAlign(CENTER, CENTER);
  // Use \n (aka enter or linefeed) to break the text into separate lines.
  text("Gallons\nconsumed\nper capita", labelX, (plotY1 + plotY2) / 2);
  textAlign(CENTER);
  text("Year", (plotX1+plotX2) / 2, labelY);
}


function drawYearLabels() {
  fill(0);
  textSize(10);
  textAlign(CENTER);

  // Use thin, gray lines to draw the grid
  stroke(224);
  strokeWeight(1);

  for (let row = 0; row < rowCount; row++) {
    if (years[row] % yearInterval == 0) {
      let x = map(years[row], yearMin, yearMax, plotX1, plotX2);
      text(years[row], x, plotY2 + textAscent() + 10);
      // line(x, plotY1, x, plotY2);
    }
  }
}


let volumeIntervalMinor = 5;   // Add this above setup()

function drawVolumeLabels() {
  fill(0);
  textSize(10);
  textAlign(RIGHT);

  stroke(128);
  strokeWeight(1);

  for (let v = dataMin; v <= dataMax; v += volumeIntervalMinor) {
    if (v % volumeIntervalMinor == 0) {     // If a tick mark
      let y = map(v, dataMin, dataMax, plotY2, plotY1);
      if (v % volumeInterval == 0) {        // If a major tick mark
        let textOffset = textAscent()/2;  // Center vertically
        if (v == dataMin) {
          textOffset = 0;                   // Align by the bottom
        } else if (v == dataMax) {
          textOffset = textAscent();        // Align by the top
        }
        text(floor(v), plotX1 - 10, y + textOffset);
        line(plotX1 - 4, y, plotX1, y);     // Draw major tick
      } else {
        line(plotX1 - 2, y, plotX1, y);     // Draw minor tick
      }
    }
  }
}


function drawDataPoints(col) {
  for (let row = 0; row < rowCount; row++) {
    // if (data.isValid(row, col)) {
      let v = data.getFloat(row, col);
      let x = map(years[row], yearMin, yearMax, plotX1, plotX2);
      let y = map(v, dataMin, dataMax, plotY2, plotY1);
      point(x, y);
    // }
  }
}


function drawDataLine(col) {
  beginShape();
  for (let row = 0; row < rowCount; row++) {
    // if (data.isValid(row, col)) {
      let value = data.getFloat(row, col);
      let x = map(years[row], yearMin, yearMax, plotX1, plotX2);
      let y = map(value, dataMin, dataMax, plotY2, plotY1);
      vertex(x, y);
    // }
  }
  endShape();
}


function drawDataHighlight(col) {
  for (let row = 0; row < rowCount; row++) {
    // if (data.isValid(row, col)) {
      let value = data.getFloat(row, col);
      let x = map(years[row], yearMin, yearMax, plotX1, plotX2);
      let y = map(value, dataMin, dataMax, plotY2, plotY1);
      if (dist(mouseX, mouseY, x, y) < 3) {
        strokeWeight(10);
        point(x, y);
        textSize(10);
	noStroke();
	fill(0);
        textAlign(CENTER);
        text(nf(value, 0, 2) + " (" + years[row] + ")", x, y - 8);
        textAlign(LEFT);
      }
    // }
  }
}


function drawDataCurve(col) {
  //stroke(0);
  //noStroke();
  beginShape();
  for (let row = 0; row < rowCount; row++) {
    // if (data.isValid(row, col)) {
      let v = data.getFloat(row, col);
      x = map(years[row], yearMin, yearMax, plotX1, plotX2);
      //float x = map(row, 0, rowCount-1, plotX1, plotX2);
      y = map(v, dataMin, dataMax, plotY2, plotY1);

      //ellipse(x, y, 5, 5);  // only change for ellipses
      curveVertex(x, y);
      // double the curve points for the start and stop
      if ((row == 0) || (row == rowCount - 1)) {
        curveVertex(x, y);
      }
    // }
  }
  endShape();
}


let barWidth = 4;  // Add this line above setup()

function drawDataBars(col) {
  noStroke();
  rectMode(CORNERS);

  for (let row = 0; row < rowCount; row++) {
    // if (data.isValid(row, col)) {
      let value = data.getFloat(row, col);
      let x = map(years[row], yearMin, yearMax, plotX1, plotX2);
      let y = map(value, dataMin, dataMax, plotY2, plotY1);
      rect(x-barWidth/2, y, x+barWidth/2, plotY2);
    // }
  }
}


function drawDataArea(col) {
  leftEdge = width;
  rightEdge = 0;

  // noStroke();
  beginShape();
  for (let row = 0; row < rowCount; row++) {
    // if (data.isValid(row, col)) {
      value = data.getFloat(row, col);
      x = map(years[row], yearMin, yearMax, plotX1, plotX2);
      y = map(value, dataMin, dataMax, plotY2, plotY1);

      if (x < leftEdge) {
        leftEdge = x;
      }
      if (x > rightEdge) {
        rightEdge = x;
      }

      vertex(x, y);
    // }
  }
  // draw the lower-right and lower-left corners
  vertex(rightEdge, plotY2);
  vertex(leftEdge, plotY2);
  endShape(CLOSE);
}


function drawDataEllipses(col) {
  ellipseMode(CENTER);
  for (let row = 0; row < rowCount; row++) {
    // if (data.isValid(row, col)) {
      let value = data.getFloat(row, col);
      //float x = map(row, 0, rowCount-1, plotX1, plotX2);
      let x = map(years[row], yearMin, yearMax, plotX1, plotX2);
      let y = map(value, dataMin, dataMax, plotY2, plotY1);
      ellipse(x, y, 5, 5);
    // }
  }
}


function keyPressed() {
  if (key == '[') {
    currentColumn--;
    if (currentColumn < 0) {
      currentColumn = columnCount - 1;
    }
  } else if (key == ']') {
    currentColumn++;
    if (currentColumn == columnCount) {
      currentColumn = 0;
    }
  }
}



/*
// print the min and max
println(dataMin + " " + dataMax);
*/

/*
// print column names
for (int i = 0; i < data.getColumnCount(); i++) {
println(data.getColumnName(i));
}
*/

/*
// print row names
for (int i = 0; i < data.getRowCount(); i++) {
println(data.getRowName(i));
}
*/

/*
// print a row of data
int row = 4;
for (int i = 0; i < data.getColumnCount(); i++) {
print(data.getFloat(row, i) + "\t");
}
println();
*/
