/*
This book is here to help you get your job done. In general, you may use the
code in this book in your programs and documentation. You do not need to contact
us for permission unless you’re reproducing a significant portion of the code.
For example, writing a program that uses several chunks of code from this book
does not require permission. Selling or distributing a CD-ROM of examples from
O’Reilly books does require permission. Answering a question by citing this book
and quoting example code does not require permission. Incorporating a significant
amount of example code from this book into your product’s documentation does
require permission.

We appreciate, but do not require, attribution. An attribution usually includes
the title, author, publisher, and ISBN. For example: “Visualizing Data, First
Edition by Ben Fry. Copyright 2008 Ben Fry, 9780596514556.”

If you feel your use of code examples falls outside fair use or the permission
given above, feel free to contact us at permissions@oreilly.com.
*/

let backgroundColor  = '#333333';  // dark background color
let dormantColor     = '#999966';  // initial color of the map
let highlightColor   = '#CBCBCB';  // color for selected points
let unhighlightColor = '#66664C';  // color for points that are not selected
let waitingColor     = '#CBCBCB';  // "please type a zip code" message
let badColor         = '#FFFF66';  // text color when nothing found

let faders = [];

// border of where the map should be drawn on screen
let mapX1, mapY1;
let mapX2, mapY2;

// column numbers in the data file
const CODE = 0;
const X = 1;
const Y = 2;
const NAME = 3;

let totalCount;  // total number of places
places = [];
let placeCount;  // number of places loaded

// min/max boundary of all points
let minX, maxX;
let minY, maxY;

// typing and selection
let font;
let typedString = "";
let typedChars = [];
let typedCount;
let typedPartials = [];

let messageX, messageY;

let foundCount;
let chosen;

// smart updates
let notUpdatedCount = 0;

// zoom
let zoomEnabled = false;
let zoomDepth = new Integrator();

// integrators
let zoomX1;
let zoomY1;
let zoomX2;
let zoomY2;

let targetX1 = [];
let targetY1 = [];
let targetX2 = [];
let targetY2 = [];

// boundary of currently valid points at this typedCount
let boundsX1, boundsY1;
let boundsX2, boundsY2;


function setup() {
  createCanvas(720, 453, WEBGL);

  mapX1 = 30;
  mapX2 = width - mapX1;
  mapY1 = 20;
  mapY2 = height - mapY1;

  font = loadFont("data/ScalaSans-Regular-14.vlw");
  textFont(font);
  // textMode(SCREEN);

  messageX = 40;
  messageY = height - 40;

  faders = [];

  // When nothing is typed, all points are shown with a color called
  // "dormant," which is brighter than when not highlighted, but
  // not as bright as the highlight color for a selection.
  faders[0] = new ColorIntegrator(unhighlightColor, dormantColor);
  faders[0].attraction = 0.5;
  faders[0].target(1);

  for (i = 1; i < 6; i++) {
    faders[i] = new ColorIntegrator(unhighlightColor, highlightColor);
    faders[i].attraction = 0.5;
    faders[i].target(1);
  }

  readData();

  zoomX1 = new Integrator(minX);
  zoomY1 = new Integrator(minY);
  zoomX2 = new Integrator(maxX);
  zoomY2 = new Integrator(maxY);

  targetX1[0] = minX;
  targetX2[0] = maxX;
  targetY1[0] = minY;
  targetY2[0] = maxY;

  rectMode(CENTER);
  ellipseMode(CENTER);
  frameRate(15);
}



function readData() {
  new Slurper();
  noLoop();  // done loading, can stop updating
}


function parseInfo(line) {
  let infoString = line.substring(2);  // remove the #
  let infoPieces = split(infoString, ',');
  totalCount = infoPieces[0];
  minX = infoPieces[1];
  maxX = infoPieces[2];
  minY = infoPieces[3];
  maxY = infoPieces[4];
}


function parsePlace(line) {
  let pieces = split(line, TAB);

  let zip = pieces[CODE];
  let x = pieces[X];
  let y = pieces[Y];
  let name = pieces[NAME];

  return new Place(zip, name, x, y);
}


// change message from 'click inside the window'
function focusGained() {
  redraw();
}

// change message to 'click inside the window'
function focusLost() {
  redraw();
}

// this method is empty in p5
function mouseEntered() {
  requestFocus();
}


function draw() {
  background(backgroundColor);

  updateAnimation();

  for (i = 0; i < placeCount; i++) {
    places[i].draw();
  }

  if (typedCount == 0) {
    fill(waitingColor);
    textAlign(LEFT);
    let msg = "zipdecode by ben fry";
    // if all places are loaded
    if (placeCount === totalCount) {
      if (focused) {
	msg = "type the digits of a zip code";
      } else {
	msg = "click the map image to begin";
      }
    }
    text(msg, messageX, messageY);

  } else {
    if (foundCount > 0) {
      if (!zoomEnabled && (typedCount == 4)) {
	// re-draw the chosen ones, because they're often occluded
	// by the non-selected points
	for (i = 0; i < placeCount; i++) {
	  if (places[i].matchDepth == typedCount) {
	    places[i].draw();
	  }
	}
      }

      if (chosen != null) {
	chosen.drawChosen();
      }

      fill(highlightColor);
      textAlign(LEFT);
      text(typedString, messageX, messageY);

    } else {
      fill(badColor);
      text(typedString, messageX, messageY);
    }
  }

  // draw "zoom" text toggle
  textAlign(RIGHT);
  fill(zoomEnabled ? highlightColor : unhighlightColor);
  text("zoom", width - 40, height - 40);
  textAlign(LEFT);
}


function updateAnimation() {
  let updated = false;

  for (i = 0; i < 6; i++) {
    updated |= faders[i].update();
  }

  if (foundCount > 0) {
    zoomDepth.target(typedCount);
  } else {
    zoomDepth.target(typedCount-1);
  }
  updated |= zoomDepth.update();

  updated |= zoomX1.update();
  updated |= zoomY1.update();
  updated |= zoomX2.update();
  updated |= zoomY2.update();

  // if the data is loaded, can optionally call noLoop() to save cpu
  if (placeCount === totalCount) {  // if fully loaded
    if (!updated) {
      notUpdatedCount++;
      // after 20 frames of no updates, shut off the loop
      if (notUpdatedCount > 20) {
	noLoop();
	notUpdatedCount = 0;
      }
    } else {
      notUpdatedCount = 0;
    }
  }
}


function TX(x) {
  if (zoomEnabled) {
    return map(x, zoomX1.value, zoomX2.value, mapX1, mapX2);

  } else {
    return map(x, minX, maxX, mapX1, mapX2);
  }
}


function TY(y) {
  if (zoomEnabled) {
    return map(y, zoomY1.value, zoomY2.value, mapY2, mapY1);

  } else {
    return map(y, minY, maxY, mapY2, mapY1);
  }
}


function mousePressed() {
  if ((mouseX > width-100) && (mouseY > height - 50)) {
    zoomEnabled = !zoomEnabled;
    redraw();
  }
}


function keyPressed() {
  if ((key == BACKSPACE) || (key == DELETE)) {
    if (typedCount > 0) {
      typedCount--;
    }
    updateTyped();

  } else if ((key >= '0') && (key <= '9')) {
    if (typedCount != 5) {  // only 5 digits
      if (foundCount > 0) {  // don't allow to keep typing bad
	typedChars[typedCount++] = key;
      }
    }
  }
  updateTyped();
}


function updateTyped() {
  typedString = new String(typedChars, 0, typedCount);

  // Un-highlight areas already typed past
  for (i = 0; i < typedCount; i++) faders[i].target(0);
  // Highlight potential dots not yet selected by keys
  for (i = typedCount; i < 6; i++) faders[i].target(1);

  typedPartials[typedCount] = int(typedString);
  for (j = typedCount-1; j > 0; --j) {
    typedPartials[j] = typedPartials[j + 1] / 10;
  }

  foundCount = 0;
  chosen = null;

  boundsX1 = maxX;
  boundsY1 = maxY;
  boundsX2 = minX;
  boundsY2 = minY;

  for (i = 0; i < placeCount; i++) {
    // update boundaries of selection
    // and identify whether a particular place is chosen
    places[i].check();
  }
  calcZoom();

  loop(); // re-enable updates
}


function calcZoom() {
  if (foundCount != 0) {
    // given a set of min/max coords, expand in one direction so that the
    // selected area includes the range with the proper aspect ratio

    let spanX = (boundsX2 - boundsX1);
    let spanY = (boundsY2 - boundsY1);

    let midX = (boundsX1 + boundsX2) / 2;
    let midY = (boundsY1 + boundsY2) / 2;

    if ((spanX != 0) && (spanY != 0)) {
      let screenAspect = width / height;
      let spanAspect = spanX / spanY;

      if (spanAspect > screenAspect) {
	spanY = (spanX / width) * height;  // wide

      } else {
	spanX = (spanY / height) * width;  // tall
      }
    } else {  // if span is zero
      // use the span from one level previous
      spanX = targetX2[typedCount-1] - targetX1[typedCount-1];
      spanY = targetY2[typedCount-1] - targetY1[typedCount-1];
    }
    targetX1[typedCount] = midX - spanX/2;
    targetX2[typedCount] = midX + spanX/2;
    targetY1[typedCount] = midY - spanY/2;
    targetY2[typedCount] = midY + spanY/2;

  } else if (typedCount != 0) {
    // nothing found at this level, so set the zoom identical to the previous
    targetX1[typedCount] = targetX1[typedCount-1];
    targetY1[typedCount] = targetY1[typedCount-1];
    targetX2[typedCount] = targetX2[typedCount-1];
    targetY2[typedCount] = targetY2[typedCount-1];
  }

  zoomX1.target(targetX1[typedCount]);
  zoomY1.target(targetY1[typedCount]);
  zoomX2.target(targetX2[typedCount]);
  zoomY2.target(targetY2[typedCount]);

  if (!zoomEnabled) {
    zoomX1.set(zoomX1.target);
    zoomY1.set(zoomY1.target);
    zoomX2.set(zoomX2.target);
    zoomY2.set(zoomY2.target);
  }
}
