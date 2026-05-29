// From the original Processing example code:


// This book is here to help you get your job done. In general, you
// may use the code in this book in your programs and
// documentation. You do not need to contact us for permission unless
// you're reproducing a significant portion of the code.  For example,
// writing a program that uses several chunks of code from this book
// does not require permission. Selling or distributing a CD-ROM of
// examples from O'Reilly books does require permission. Answering a
// question by citing this book and quoting example code does not
// require permission. Incorporating a significant amount of example
// code from this book into your product's documentation does require
// permission.

// We appreciate, but do not require, attribution. An attribution
// usually includes the title, author, publisher, and ISBN. For
// example: ÒVisualizing Data, First Edition by Ben Fry. Copyright
// 2008 Ben Fry, 9780596514556.Ó

// If you feel your use of code examples falls outside fair use or the
// permission given above, feel free to contact us at
// permissions@oreilly.com.

// import { parse } from "https://cdn.jsdelivr.net/npm/date-fns@3.6.0/+esm";



let teamCount = 30;
let teamNames, teamCodes;
let teamIndices;

const ROW_HEIGHT = 23;
const HALF_ROW_HEIGHT = ROW_HEIGHT / 2.0;

const SIDE_PADDING = 30;
const TOP_PADDING = 40;

let salaries;
let standings;

let season, standingsPosition;

let logos;
let logoWidth, logoHeight;

let font;

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


let firstDateStamp = "20070401";
let lastDateStamp = "20070930";
let todayDateStamp;

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000;

// The number of days in the entire season.
let dateCount;
// The current date being shown.
let dateIndex;
// Don't show the first 10 days, they're too erratic.
let minDateIndex = 10;
// The last day of the season, or yesterday, if the season is ongoing.
// This is the maximum date that can be viewed.
let maxDateIndex;



function preload() {
  // // p5.js will now wait for this specific promise to resolve!
  // importModule("https://jsdelivr.net")
  //   .then(module => {
  //     dateFns = module;
  //   });
}


let stampFormat;
let prettyFormat;


//Note, that the following two function call functions from the
//Javascript module, date-fns. These functions are attached to the
//HTML document, 'window' in a script tag in the project HTML. We are
//guaranteed that they have been attached because p5.js provides the
//guarantee that the entire document has been parsed before preload
//and setup are run, and all script tags must be processed before
//parsing is complete.

// This format makes a date from a string, e.g. "20070704"
function stampFormatParse(dateString) {
  return window.parse(dateString, "yyyyMMdd", new Date());
}

// This writes a string from a date, e.g. "4 July 2007"
function dateFormatWrite(date) {
  return window.format(date, "d MMMM yyyy");
}

// All dates for the season formatted with stampFormat.
let dateStamp;
// All dates in the season formatted with prettyFormat.
let datePretty;

function setupDates() {
  try {
    let firstDate = stampFormatParse(firstDateStamp);
    let firstDateMillis = firstDate.getTime();
    let lastDate = stampFormatParse(lastDateStamp);
    let lastDateMillis = lastDate.getTime();

    // Calculate number of days by dividing the total milliseconds
    // between the first and last dates by the number of milliseconds per day
    dateCount = floor((lastDateMillis - firstDateMillis) / MILLIS_PER_DAY) + 1;
    maxDateIndex = dateCount;
    dateStamp = new Array(dateCount);
    datePretty = new Array(dateCount);

    todayDateStamp = year() + nf(month(), 2) + nf(day(), 2);
    // Another option to do this, but more code
    //Date today = new Date();
    //String todayDateStamp = stampFormat.format(today);

    for (let i = 0; i < dateCount; i++) {
      let date = new Date(firstDateMillis + MILLIS_PER_DAY*i);
      datePretty[i] = dateFormatWrite(date);
      dateStamp[i] = dateFormatWrite(date);
      // If this value for 'date' is equal to today, then set the previous
      // day as the maximum viewable date, because it means the season is
      // still ongoing. The previous day is used because unless it is late
      // in the evening, the updated numbers for the day will be unavailable
      // or incomplete.
      if (dateStamp[i] === todayDateStamp) {
        maxDateIndex = i - 1;
      }
    }
  } catch (e) {
    print("Problem while setting up dates", e);
  }
}


let lines, salariesLines;

function preload() {
  // data = new FloatTable("data/milk-tea-coffee.tsv");
  // plotFont = loadFont("data/LiberationSans-Regular.ttf");
  teamsLines = loadTable("data/teams.tsv");
  salariesLines = loadStrings("data/salaries.tsv");
}


function setup() {
  createCanvas(720, 405);

  setupTeams();
  setupDates();
  setupSalaries();
  // Load the standings after the salaries, because salary
  // will be used as the tie-breaker when sorting.
  // setupStandings();
  // setupRanking();
  // setupLogos();

  // font = createFont("Georgia", 12);
  // textFont(font);

  // frameRate(15);
  // // Use today as the current day
  // setDate(maxDateIndex);
}


function setupTeams() {
  teamCount = teamsLines.getRowCount();
  teamCodes = new Array(teamCount);
  teamNames = new Array(teamCount);
  teamIndices = new Array();

  for (let i = 0; i < teamCount; i++) {
    // let pieces = split(teamsLines[i], TAB);
    teamCodes[i] = teamsLines.getString(i, 0)
    teamNames[i] = teamsLines.getString(i, 1)
    teamIndices[teamCodes[i]] = i;
  }
}


function teamIndex(teamCode) {
  let index = teamIndices[teamCode];
  return index;
}


function setupSalaries() {
  salaries = new SalaryList(salariesLines);
}




//. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


class SalaryList extends RankedList {
  constructor(lines) {
    super(teamCount, false);


    for (let i = 0; i < teamCount; i++) {
      let pieces = split(lines[i], "\t");

      // First column is the team 2-3 digit team code.
      let index = teamIndex(pieces[0]);

      // Second column is the salary as a number.
      this.value[index] = parseInt(pieces[1]);

      // Make the title in the format $NN,NNN,NNN
      let salary = this.value[index];
      this.title[index] = "$" + nfc(salary);
    }
    this.update();
  }
}

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


class StandingsList extends RankedList {

  constructor(lines) {
    super(teamCount, false);

    for (let i = 0; i < teamCount; i++) {
      let pieces = split(lines[i], TAB);
      let index = teamIndex(pieces[0]);
      let wins = parseInt(pieces[1]);
      letlosses = parseInt(pieces[2]);

      value[index] = wins / (wins + losses);
      title[index] = wins + "-" + losses;
    }
    update();
  }

  compare(a, b) {
    // First compare based on the record of both teams
    let amt = super.compare(a, b);
    // If the record is not identical, return the difference
    if (amt !== 0) return amt;

    // If records are equal, use salary as tie-breaker.
    // In this case, a and b are switched, because a higher
    // salary is a negative thing, unlike the values above.
    return salaries.compare(a, b);
  }
}










































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
let volumeIntervalMinor = 5;

let tabLeft, tabRight;
let tabTop, tabBottom;

let xTabPad = 10.0;
let yTabPad = 5.0;

let interpolators = [];

let plotFont;


// Any files, data or graphic, that need to be used immediately should
// be loaded in preload, which ensure the resource is full loaded and
// available before any code in setup is run.
function preloadAlt() {
  // data = loadTable("data/milk-tea-coffee.tsv");
  // data = loadTable("data/milk-tea-coffee.tsv");
  data = new FloatTable("data/milk-tea-coffee.tsv");
  plotFont = loadFont("data/LiberationSans-Regular.ttf");
}


function setupAlt() {
  createCanvas(720, 405);

  rowCount = data.getRowCount();
  columnCount = data.getColumnCount();

  years = data.getRowNames().map((v, _) => Number(v))
  yearMin = years[0];
  yearMax = years[years.length - 1];

  dataMin = 0;
  dataMax = ceil(data.getTableMax() / volumeInterval) * volumeInterval;

  for (row = 0; row < rowCount; row++) {
    let initialValue = data.getFloat(row, 0);
    interpolators[row] = new Integrator(initialValue);
    interpolators[row].attraction = 0.1;  // Set lower than the default
  }


  // Corners of the plotted time series
  plotX1 = 120;
  plotX2 = width - 80;
  labelX = 50;
  plotY1 = 60;
  plotY2 = height - 70;
  labelY = height - 25;

  dataMin = 0;
  dataMax = ceil(data.getTableMax() / volumeInterval) * volumeInterval;


  textFont(plotFont);

  smooth();
}


function drawAlt() {
  background(224);

  // Show the plot area as a white box
  fill(255);
  rectMode(CORNERS);
  noStroke();
  rect(plotX1, plotY1, plotX2, plotY2);

  drawTitleTabs();
  drawAxisLabels();

  for (row = 0; row < rowCount; row++) {
    interpolators[row].update();
  }

  drawYearLabels();
  drawVolumeLabels();

  noStroke();
  fill('#5679C1');
  drawDataArea(currentColumn);

}


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

  for (let row = 0; row < rowCount; row++) {
    interpolators[row].target(data.getFloat(row, col));
  }
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
      line(x, plotY1, x, plotY2);
    }
  }
}


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
        //line(plotX1 - 2, y, plotX1, y);     // Draw minor tick
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
      let v = interpolators[row].value();
      //value = data.getFloat(row, col);
      x = map(years[row], yearMin, yearMax, plotX1, plotX2);
      y = map(v, dataMin, dataMax, plotY2, plotY1);

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
