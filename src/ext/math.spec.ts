import "mocha";
import { expect } from "chai";
import * as mathx from "./math";

describe("mathx", function(){
	it("lerp", function(done){
		expect(mathx.lerp(0,100,0.5)).is.equal(50);
		expect(mathx.lerp(0,1000,0.5)).is.equal(500);
		done();
	});

	it("rangeInt", function(done){
		expect(mathx.rangeInt(1,100)).is.within(1,100);
		expect(mathx.rangeInt(50,100)).is.within(50,100);
		expect(mathx.rangeInt(9349834,999999999)).is.within(9349834,999999999);
		done();
	});

	it("probability", function(done){
		let trials: number = 0;
		let success: number = 0;
		let prob: number = 0.05;
		for(let i=0;i<5000000;i++){
			trials++;
			if(mathx.probability(prob)) success++;
		}

		expect(success/trials).is.within(prob*0.9, prob*1.1);
		done();
	});

	it("roll", function(done){
		for(let i=0;i<1000;i++){
			expect(mathx.roll(2,6)).is.within(2,12);
			expect(mathx.roll(2,10)).is.within(2,20);
			expect(mathx.roll(5,50)).is.within(5,250);
			expect(mathx.roll(5,50,10)).is.within(15,260);
			expect(mathx.roll(2,10,25)).is.within(27,45);
			expect(mathx.roll("2d6+5")).is.within(7,17);
			expect(mathx.roll("2d6-10")).is.within(-8,2);
		}

		done();
	});
});