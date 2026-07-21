class Integrator {

  constructor(value = 100, damping = 0.5, attraction = 0.2) {
    this.force = 0;
    this.vel = 0;
    this.accel = 0;
    this.mass = 1;

    this.damping = damping;
    this.attraction = attraction;

    this._value = value;
    this._target = value;

    this.prev = Number.MAX_VALUE;
    this.epsilon = 0.0001;
  }

  value(v) {
    if (typeof v !== 'undefined') {
      this._value = v;
      return this;
    }
    return this._value;
  }

  update() {
    if (this.targeting) {
      this.force += this.attraction * (this._target - this._value);
    }

    this.accel = this.force / this.mass;
    this.vel = (this.vel + this.accel) * this.damping;
    this._value += this.vel;

    this.force = 0;

    if (Math.abs(this._value - this.prev) < this.epsilon) {
      this._value = this.target;
      return false;
    }
    this.prev = this.value;
    return true;
  }

  target(t) {
    if (typeof t !== 'undefined') {
      this.targeting = true;
      this._target = t;
      return this;
    }
    return this._target;
  }

  noTarget() {
    this.targeting = false;
  }
}
