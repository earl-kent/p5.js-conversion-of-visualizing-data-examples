// Code from Visualizing Data, First Edition, Copyright 2008 Ben Fry.


class RankedList {
  // Number of elements in the list
  count;
  // Array of values for the list
  value;
  // Minimum and maximum values in the list
  minValue;
  maxValue;
  // How this value is represented visually
  title;
  // Rank for each item (0 is highest)
  rank;
  // Ordering used while sorting by rank
  order;
  // True if the element 0 is the lowest value, and count-1 the largest.
  // (This has no bearing on what is considered the minValue and maxValue.)
  ascending;


  constructor(count, ascending) {
    this.count = count;
    this.ascending = ascending;

    this.value = new Array(this.count);
    this.title = new Array(this.count);
    this.rank = new Array(this.count);
  }


  getCount() {
    return this.count;
  }


  getValue(index) {
    return value[index];
  }


  getMinValue() {
    return minValue;
  }


  getMaxValue() {
    return maxValue;
  }


  getTitle(index) {
    return title[index];
  }


  getRank(index) {
    return rank[index];
  }


  min(array) {
    return array.reduce(
      (acc, value) => (value < acc) ? value : acc,
      Number.MAX_VALUE);
  }

  max(array) {
    return array.reduce(
      (acc, value) => (value > acc) ? value : acc,
      -Number.MAX_VALUE);
  }

  // Sort the data and calculate min/max values
  update() {
    let count = this.count;
    let value = this.value;
    // Set up an initial order to be sorted
    this.order = new Array(count);
    for (let i = 0; i < this.count; i++) {
      this.order[i] = i;
    }
    this.sort(0, count - 1);

    // Assign rankings based on the order after sorting
    for (let i = 0; i < count; i++) {
      this.rank[this.order[i]] = i;
    }

    // Calculate minimum and maximum values
    this.minValue = this.min(value);
    this.maxValue = this.max(value);
  }


  sort(left, right) {
    let pivotIndex = (left + right)/2;
    this.swap(pivotIndex, right);
    let k = this.partition(left - 1, right);
    this.swap(k, right);
    if ((k - left) > 1) this.sort(left, k - 1);
    if ((right - k) > 1) this.sort(k + 1, right);
  }


  partition(left, right) {
    let pivot = right;
    do {
      while (this.compare(++left, pivot) < 0);
      while ((right != 0) && (this.compare(--right, pivot) > 0)) ;
      this.swap(left, right);
    } while (left < right);
    this.swap(left, right);
    return left;
  }


  compare(a, b) {
    let value = this.value;
    let order = this.order;

    if (this.ascending) {
      return value[order[a]] - value[order[b]];
    } else {
      return value[order[b]] - value[order[a]];
    }
  }


  swap(a, b) {
    let temp = this.order[a];
    this.order[a] = this.order[b];
    this.order[b] = temp;
  }
}
