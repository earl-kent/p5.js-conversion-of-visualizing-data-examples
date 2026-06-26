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

let season = [], standingsPosition = [];

let logos = [];
let logoWidth, logoHeight;

let font;

// . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


// let firstDateStamp = "20070401";
// let lastDateStamp = "20070930";
// 2024&date=2024-06-01
let firstDateStamp = "20240401";
let lastDateStamp = "20240930";
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



// function preload() {
  // // p5.js will now wait for this specific promise to resolve!
  // importModule("https://jsdelivr.net")
  //   .then(module => {
  //     dateFns = module;
  //   });

//}


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

// Note this doesn't load any files so it's safe to use its
// side-effects in preload().
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
let teams, gameData, gameData2, standingsFor240601;


let tempDivision;
let teamRecords = [];

function preload() {
  // legue information
  let americanLegue = 103;
  let nationalLegue = 104;
  // https://statsapi.mlb.com/api/v1/league

  let leagues = [103, 104];
  setupDates();

  let date = stampFormatParse(firstDateStamp);

  // for (let i = minDateIndex; i <= maxDateIndex; i++) {
  //   console.log("i:", i);
  //   date.setDate(date.getDate() + 1);
  //   console.log(date);
  //   console.log(window.format(date, "yyyy-mm-dd"));
  // }


  let dateString;

  for (const league of leagues) {
    date = stampFormatParse(firstDateStamp);
    // for (let i = minDateIndex; i <= maxDateIndex; i++) {
    for (let i = minDateIndex; i <= 11; i++) {
      date.setDate(date.getDate() + 1);
      dateString = window.format(date, "yyyy-MM-dd");
      // loadJSON(`https://statsapi.mlb.com/api/v1/standings?` +
      // 	       `season=2024&date=2024-06-01&leagueId=${league}&standingsType=regularSeason`,
      console.log(`https://statsapi.mlb.com/api/v1/standings?` +
		  `season=2024&date=${dateString}&leagueId=${league}&standingsType=regularSeason`);
      loadJSON(`https://statsapi.mlb.com/api/v1/standings?` +
		  `season=2024&date=${dateString}&leagueId=${league}&standingsType=regularSeason`,
	       (data) =>
	       {
		 console.log("data:");
		 console.log(data);
		 for (const rec of data.records) {
		   for (const teamRec of rec.teamRecords) {
		     teamRecords.push(teamRec);
		   }
		 }
	       });
    }
  }



  // Standings information
  standingsFor240601 =
    loadJSON("https://statsapi.mlb.com/api/v1/standings?leagueId=103&season=2024&date=2024-06-01");

  // runGetBoxscore();

  // data = new FloatTable("data/milk-tea-coffee.tsv");
  // plotFont = loadFont("data/LiberationSans-Regular.ttf");
  teamsLines = loadTable("data/teams.tsv",
			 (data) =>
			 {
			   setupTeams(data);
			   setupLogos();
			 }
			);
  salariesLines = loadStrings("data/salaries.tsv");
  // setupStandings();

  gameData = loadJSON("https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=2024-04-01");
  gameData2 = loadJSON("https://statsapi.mlb.com/api/v1/game/715693/boxscore");

  teams = loadJSON("https://statsapi.mlb.com/api/v1/teams?sportId=1");

  // Return the Promise so p5 waits for it
  // return fetch("https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=2024-04-01")
  //   .then(res => res.json())
  //   .then(json => {
  //     gameData = json;   // store result for setup()
  //   });
}



// The resulting standings.tsv file reads:
// bos 6 4
// tor 7 5
// bal 6 6
// nyy 5 6
// tb  5 7
// sea 5 3
// ana 6 6
// oak 6 7
// tex 5 7
// cle 6 3
// det 7 5
// min 7 5
// cws 5 6
// kc  3 9
// atl 8 3
// nym 7 4
// fla 6 5
// phi 3 8
// was 3 9
// ari 9 4
// la  8 4
// sd  7 5
// col 5 7
// sf  3 7
// cin 7 5
// mil 6 5
// stl 6 5
// hou 4 6
// pit 4 6


function setup() {
  createCanvas(720, 405);
  console.log("gameData data is ready:", gameData); // guaranteed defined
  console.log("gameData2 data is ready:", gameData2); // guaranteed defined
  console.log("standingsFor240601 data is ready:", standingsFor240601); // guaranteed defined
  console.log("teams data is ready:", teams); // guaranteed defined

  setupSalaries();

  // acquireStandings(dateStamp[4]);
  //   acquireStandings(3, 4 , 2007);

  // Load the standings after the salaries, because salary
  // will be used as the tie-breaker when sorting.


  // let season_3_4_2007 = new StandingsList(standingsFor240601);


  // setupStandings();

  setupRanking();

  font = textFont("Georgia", 12);

  frameRate(15);
  // Use today as the current day
  setDate(maxDateIndex);
}


function setupTeams(lines) {
  teamCount = lines.getRowCount();
  teamCodes = new Array(teamCount);
  teamNames = new Array(teamCount);
  teamIndices = new Array();

  for (let i = 0; i < teamCount; i++) {
    teamCodes[i] = lines.getString(i, 0)
    teamNames[i] = lines.getString(i, 1)
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


function setupStandings() {
  // season = new StandingsList[maxDateIndex + 1];
  season = new Array(maxDateIndex + 1);
  for (let i = minDateIndex; i <= maxDateIndex; i++) {
    let lines = acquireStandings(dateStamp[i]);
    season[i] = new StandingsList(lines);
  }
}

function setupRanking() {
  for (let i = 0; i < teamCodes.length; i++) {
    standingsPosition[i] = new Integrator(i);
  }
}

function setupLogos() {
  for (let i = 0; i < teamCount; i++) {
    logos[i] = loadImage("data/small/" + teamCodes[i] + ".gif");
  }
  logoWidth = logos[0].width / 2.0;
  logoHeight = logos[0].height / 2.0;
}



function setDate(index) {
  dateIndex = index;
  standings = season[dateIndex];

  for (let i = 0; i < teamCount; i++) {
    standingsPosition[i].target(standings.getRank(i));
  }
  // Re-enable the animation loop
  // loop();
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

  constructor(standingsForDateTable) {
    super(teamCount, false);

    for (let i = 0; i < teamCount; i++) {
      let pieces = split(lines[i], TAB);
      let index = teamIndex(pieces[0]);
      let wins = parseInt(pieces[1]);
      let losses = parseInt(pieces[2]);

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

function myDataPath(filename) {
  return "data/" + filename;
}


function acquireStandings(stamp_or_year, month, day) {
  if (arguments.length === 1) {
    let stamp = stamp_or_year;
    let year = parseInt(stamp.substring(0, 4));
    let month = parseInt(stamp.substring(4, 6));
    let day = parseInt(stamp.substring(6, 8));
    return acquireStandings(year, month, day);
  } else if (arguments.length === 3) {
    let year = stamp_or_year
    let filename = year + nf(month, 2) + nf(day, 2) + ".tsv";
    let path = dataPath(filename);
    // print("path: " + path);
    // // File file = new File(path);
    // if (!file.exists()) {
    print("Generating standings file " + filename);
    // let writer = createWriter(path);

    // let base = "http://mlb.mlb.com/components/game" +
    // 	"/year_" + year + "/month_" + nf(month, 2) + "/day_" + nf(day, 2) + "/";

    // American League (AL)
    parseWinLoss(base + "standings_rs_ale.js", writer);
    parseWinLoss(base + "standings_rs_alc.js", writer);
    parseWinLoss(base + "standings_rs_alw.js", writer);

    // National League (NL)
    parseWinLoss(base + "standings_rs_nle.js", writer);
    parseWinLoss(base + "standings_rs_nlc.js", writer);
    parseWinLoss(base + "standings_rs_nlw.js", writer);

    writer.flush();
    writer.close();
    // }
    return loadStrings(filename);
  }
}

function parseWinLoss(filename, writer, lines) {
  // let lines = loadStrings(filename);
  // Pattern p = Pattern.compile("\\s+([\\w\\d]+):\\s'(.*)',?");

  let teamCode = "";
  let wins = 0;
  let losses = 0;

  for (let i = 0; i < lines.length; i++) {
    let m = p.matcher(lines[i]);

    if (m.matches()) {
      let attr = m.group(1);
      let value = m.group(2);

      if (attr.equals("code")) {
        teamCode = value;
      } else if (attr.equals("w")) {
        wins = parseInt(value);
      } else if (attr.equals("l")) {
        losses = parseInt(value);
      }

    } else {
      if (lines[i].startsWith("}")) {
        // this is the end of a group, write these values
        //println(team + " " + wins + "-" + losses);
        //set(teamIndex(teamCode), wins, losses);
        writer.println(teamCode + TAB + wins + TAB + losses);
      }
    }
  }
}






// Replace with the gamePk you want
// const gamePk = 715693;

// async function getWinLoss(gamePk) {
//   const url = `https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`;

//   const res = await fetch(url);
//   if (!res.ok) throw new Error("Failed to fetch boxscore");

//   const data = await res.json();

//   // Home and away team objects
//   const home = data.teams.home;
//   const away = data.teams.away;

//   return {
//     homeTeam: home.team.name,
//     homeRecord: `${home.team.record.wins}-${home.team.record.losses}`,

//     awayTeam: away.team.name,
//     awayRecord: `${away.team.record.wins}-${away.team.record.losses}`
//   };
// }

// getWinLoss(gamePk)
//   .then(console.log)
//   .catch(console.error);











































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




// The MBL API

// https://statsapi.mlb.com/api/v1/statTypes
// https://statsapi.mlb.com/api/v1/baseballStats
// https://statsapi.mlb.com/api/v1/sports


// divisions information
// https://statsapi.mlb.com/api/v1/divisions?leagueId=103


// https://docs.statsapi.mlb.com/category/getting-started






// Replace with the gamePk you want

async function getBoxscore(gamePk) {
  const url = `https://statsapi.mlb.com/api/v1/game/${gamePk}/boxscore`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch boxscore");

  const data = await res.json();

  // Basic team info
  const home = data.teams.home;
  const away = data.teams.away;

  console.log("Home Team:", home.team.name);
  console.log("Away Team:", away.team.name);

  // Example: print starting pitchers
  console.log("\nStarting Pitchers:");
  console.log("Home:", home.pitchers[0]);
  console.log("Away:", away.pitchers[0]);

  // Example: print first batter in home lineup
  const firstHomeBatterId = home.battingOrder[0];
  const firstHomeBatter = home.players[`ID${firstHomeBatterId}`];
  console.log("\nHome leadoff hitter:", firstHomeBatter.person.fullName);

  return data;
}

function runGetBoxscore () {
  const gamePk = 715693;
  getBoxscore(gamePk)
    .then(data => console.log("\nBoxscore loaded."))
    .catch(console.error);
}
