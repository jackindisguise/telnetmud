import "mocha";
import * as dungeon from "./dungeon";
import { expect } from "chai";
import { Direction } from "./direction";

let d: dungeon.Dungeon;
let m: dungeon.Mob;
describe("dungeon", function(){
	it("Construct an empty 10x10x1 dungeon.", function(done){
		d = new dungeon.Dungeon({proportions:{width:10,height:10,layers:1}, fill:false});
		expect(d.contents.length).equals(0);
		expect(d.proportions.width).equals(10);
		expect(d.proportions.height).equals(10);
		expect(d.proportions.layers).equals(1);
		done();
	});

	it("Fill the dungeon with rooms.", function(done){
		for(let z=0;z<1;z++){
			for(let y=0;y<10;y++){
				for(let x=0;x<10;x++){
					d.createRoom({x:x,y:y,z:z});
				}
			}
		}

		expect(d.contents.length).equals(10*10);
		expect(d.getRoom({x:0,y:0,z:0})).equals(d.grid[0][0][0]);
		done();
	});

	it("Create a mob.", function(done){
		m = new dungeon.Mob();
		expect(m.location).equals(null);
		expect(m.x).equals(null);
		done();
	});

	it("Move mob to dungeon.", function(done){
		let room = d.getRoom({x:0,y:0,z:0});
		m.move(room);
		expect(m.location).equals(room);
		expect(m.location).not.equals(null);
		expect(room.contains(m)).equals(true);
		expect(d.contains(m)).equals(true);
		done();
	});

	it("Take a step.", function(done){
		let room = d.getRoom({x:0,y:0,z:0});
		let room2 = d.getRoom({x:1,y:0,z:0});
		m.step(Direction.EAST);
		expect(m.location).not.equals(room);
		expect(room.contains(m)).equals(false);
		expect(m.location).equals(room2);
		expect(room2.contains(m)).equals(true);
		done();
	});

	it("Move mob off dungeon.", function(done){
		let room = d.getRoom({x:0,y:0,z:0});
		m.move(null);
		expect(m.location).equals(null);
		expect(m.location).not.equals(room);
		expect(room.contains(m)).equals(false);
		expect(d.contains(m)).equals(false);
		done();
	});
});
