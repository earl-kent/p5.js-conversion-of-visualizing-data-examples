// Code from Visualizing Data, First Edition, Copyright 2008 Ben Fry.




class ColorIntegrator extends Integrator {

    constructor(color0, color1) {
	let a1 = (color0 >> 24) & 0xff;
	let r1 = (color0 >> 16) & 0xff;
	let g1 = (color0 >>  8) & 0xff;
	let b1 = (color0      ) & 0xff;

	let a2 = (color1 >> 24) & 0xff;
	let r2 = (color1 >> 16) & 0xff;
	let g2 = (color1 >>  8) & 0xff;
	let b2 = (color1      ) & 0xff;

	this.r0 = r1 / 255.0;
	this.g0 = g1 / 255.0;
	this.b0 = b1 / 255.0;
	this.a0 = a1 / 255.0;

	this.rs = (r2 - r1) / 255.0;
	this.gs = (g2 - g1) / 255.0;
	this.bs = (b2 - b1) / 255.0;
	this.as = (a2 - a1) / 255.0;
    }

    update() {
	let updated = super.update();
	if (updated) {
	    this.colorValue =
            ((((this.a0 + this.as * this.value) * 255) << 24) |
	    (((this.r0 + this.rs * this.value) * 255) << 16) |
	    (((this.g0 + this.gs * this.value) * 255) <<  8) |
	    (((this.b0 + this.bs * this.value) * 255)));
	}
	return updated;
    }


    get() {
	return this.colorValue;
    }
}
