let mapImage;

function setup() {
  createCanvas(640, 400);
  mapImage = loadImage("data/map.png");
}

function draw() {
  background(255);
  image(mapImage, 0, 0);
}
