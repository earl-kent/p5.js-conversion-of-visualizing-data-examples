

function preload() {
  // data = loadTable("milk-tea-coffee.tsv");
  data = new FloatTable("milk-tea-coffee.tsv");

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

  print('data.getRowCount(): ' + data.getRowCount() + '\n'
	+ '; data.getRowName(0): ' + data.getRowName(0) + '\n'
	+ '; data.getRowName(1): ' + data.getRowName(1) + '\n'
	+ '; data.getRowNames(): ' + data.getRowNames() + '\n'
	+ '; data.getColumnCount(): ' + data.getColumnCount() + '\n'
	+ '; data.getColumnMin(0): ' + data.getColumnMin(0) + '\n'
	+ '; data.getColumnMax(0): ' + data.getColumnMax(0) + '\n'
	+ '; data.getRowMin(0): ' + data.getRowMin(0) + '\n'
	+ '; data.getRowMax(0): ' + data.getRowMax(0) + '\n'
	+ '; data.getTableMin(): ' + data.getTableMin() + '\n'
	+ '; data.getTableMax(): ' + data.getTableMax() + '\n'
	// should be 5
	+ '; data.getRowIndex("1915"): ' + data.getRowIndex('1915') + '\n'
	// should be -1
	+ '; data.getRowIndex("2015"): ' + data.getRowIndex('2015')  + '\n'
       );

  smooth();
}



function draw() {
  background(255);

  // Show the plot area as a white box
  fill(255);
  rectMode('CORNERS');
  noStroke();
}
