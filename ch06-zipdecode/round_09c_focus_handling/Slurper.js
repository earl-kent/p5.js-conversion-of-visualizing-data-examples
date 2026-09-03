// Code from Visualizing Data, First Edition, Copyright 2008 Ben Fry.


class Slurper {
  run() {
    try {
      let input = openStream("zips.gz");
      let reader = createReader(input);

      // first get the info line
      line = reader.readLine();
      parseInfo(line);

      places = new Place[totalCount];

      // parse each of the rest of the lines
      while ((line = reader.readLine()) != null) {
        places[placeCount] = parsePlace(line);
        placeCount++;
      }
    } catch (e) {
      console.log("error running slurpper");
    }
  }
}
