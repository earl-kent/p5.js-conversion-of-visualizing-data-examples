// first line of the file should be the column headers
// first column should be the row titles
// all other values are expected to be floats
// getFloat(0, 0) returns the first data value in the upper lefthand corner
// files should be saved as "text, tab-delimited"
// empty rows are ignored
// extra whitespace is ignored

// Note, it's not at all clear that using the javascript map functions
// makes the table operations more idiomatic.

class FloatTable {

  // to be used in p5.js preload.
  constructor(textTable) {
    this.columnNames = Array.from({ length: textTable.getColumnCount() - 1 },
				  (_, c) => textTable.getString(0, c + 1));

    this.rowNames = Array.from({ length: textTable.getRowCount() - 1 },
			       (_, r) => textTable.getString(r + 1, 0));

    this.data = Array.from({ length: textTable.getRowCount() - 1 }, (_, r) =>
      Float64Array.from(
	Array.from({ length: textTable.getColumnCount() - 1 },
		   (_, c) => Number(textTable.getString(r + 1, c + 1)))));
  }

  // Number of rows excluding headers, i.e.
  getRowCount() {
    return this.data.length;
  }

  getRowName(rowIndex) {
    return this.rowNames[rowIndex];
  }

  getRowNames() {
    return this.rowNames;
  }

  // Find a row by its name, returns -1 if no row found. This will
  // return the index of the first row with this name. A more
  // efficient version of this function would put row names into a
  // Hashtable (or HashMap) that would map to an integer for the row.
  getRowIndex(name) {
    for (let i = 0; i < this.getRowCount(); i++) {
      if (this.getRowName(i) === name) {
        return i;
      }
    }
    return -1;
  }

  // Technically, this only returns the number of columns in the very
  // first row, i.e. the headers.
  getColumnCount() {
    return this.columnNames.length;
  }

  getColumnName(colIndex) {
    return this.columnNames[colIndex];
  }

  getColumnNames() {
    return this.columnNames;
  }


  getFloat(rowIndex, col) {
    // Remove the 'training wheels' section for greater efficiency
    // It's included here to provide more useful error messages

    // begin training wheels
    if ((rowIndex < 0) || (rowIndex >= data.length)) {
      throw new RuntimeException("There is no row " + rowIndex);
    }
    if ((col < 0) || (col >= data[rowIndex].length)) {
      throw new RuntimeException("Row " + rowIndex + " does not have a column " + col);
    }
    // end training wheels

    return data[rowIndex][col];
  }


  getColumnMin(col) {
    return this.data.reduce(
      (acc, value) => (value[col] < acc) ? value[col] : acc,
      Number.MAX_VALUE);
  }

  getColumnMax(col) {
    return this.data.reduce(
      (acc, value) => (value[col] > acc) ? value[col] : acc,
      -Number.MAX_VALUE);
  }

  getRowMin(row) {
    return this.data[row].reduce(
      (acc, value) => (value < acc) ? value : acc,
      Number.MAX_VALUE);
  }

  getRowMax(row) {
    return this.data[row].reduce(
      (acc, value) => (value > acc) ? value : acc,
      -Number.MAX_VALUE);
  }

   getTableMin() {
     return this.data.reduce(
       (accRow, valueRow) => {
	 let rowMin = valueRow.reduce((accCell, valueCell) =>
	   (valueCell < accCell) ? valueCell : accCell,
	   Number.MAX_VALUE);
	 return (rowMin < accRow) ? rowMin : accRow;
       },
       Number.MAX_VALUE);
  }

   getTableMax() {
     return this.data.reduce(
       (accRow, valueRow) => {
	 let rowMax = valueRow.reduce((accCell, valueCell) =>
	   (valueCell > accCell) ? valueCell : accCell,
	   -Number.MAX_VALUE);
	 return (rowMax > accRow) ? rowMax : accRow;
       },
       -Number.MAX_VALUE);
  }

}
