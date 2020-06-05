// mocha and chai
import "mocha";
import { expect } from "chai";

// local includes
import * as dungeon from "./dungeon";
import { Direction } from "./direction";

let d: dungeon.Dungeon;
let m: dungeon.Mob;
describe("dungeon", function(){
	it("Construct an empty 10x10x10 dungeon.", function(done){
		d = new dungeon.Dungeon({proportions:{width:10,height:10,layers:10}, fill:false});
		expect(d.contents.length).equal(0);
		expect(d.proportions.width).equal(10);
		expect(d.proportions.height).equal(10);
		expect(d.proportions.layers).equal(10);
		done();
	});

	it("Fill the dungeon with rooms.", function(done){
		for(let z=0;z<10;z++){
			for(let y=0;y<10;y++){
				for(let x=0;x<10;x++){
					let room: dungeon.Room = d.createRoom({x:x,y:y,z:z});
					expect(room.coordinates.x).is.equal(x);
					expect(room.coordinates.y).is.equal(y);
					expect(room.coordinates.z).is.equal(z);
				}
			}
		}

		expect(d.contents.length).equal(10*10*10);
		expect(d.getRoom({x:0,y:0,z:0})).equal(d.grid[0][0][0]);
		done();
	});

	it("Create a mob.", function(done){
		m = new dungeon.Mob();
		expect(m.location).equal(undefined);
		expect(m.x).equal(undefined);
		expect(m.y).equal(undefined);
		expect(m.z).equal(undefined);
		done();
	});

	it("Create a mob with an initial location.", function(done){
		let room = d.getRoom({x:0,y:0,z:0});
		let m2 = new dungeon.Mob({location:room});
		expect(m2.location).is.equal(room);
		expect(room.contains(m2)).is.true;
		done();
	});

	it("Move mob to dungeon.", function(done){
		let room = d.getRoom({x:0,y:0,z:0});
		m.move(room);
		expect(m.location).equal(room);
		expect(m.location).not.equal(undefined);
		expect(room.contains(m)).equal(true);
		expect(d.contains(m)).equal(true);
		done();
	});

	it("Testing redundant add/remove of Room contents.", function(done){
		// redundant add/remove movement
		let room = d.getRoom({x:0,y:0,z:0});
		expect(m.location).is.equal(room);
		expect(room.contains(m)).is.true;
		room.add(m);
		expect(m.location).is.equal(room);
		expect(room.contains(m)).is.true;
		room.remove(m);
		expect(m.location).is.not.equal(room);
		expect(room.contains(m)).is.false;
		room.remove(m);
		expect(m.location).is.not.equal(room);
		expect(room.contains(m)).is.false;

		// moving to a new room
		let room2 = d.getRoom({x:1,y:1,z:0});
		room2.add(m);
		expect(m.location).is.equal(room2);
		expect(room.contains(m)).is.false;

		// moving to the last room
		room.add(m);
		expect(m.location).is.equal(room);
		expect(room.contains(m)).is.true;
		expect(room2.contains(m)).is.false;
		done();
	});

	it("Testing DObject contents/location relationship.", function(done){
		let dobj1 = new dungeon.DObject();
		let dobj2 = new dungeon.DObject();
		expect(dobj1.location).is.undefined;
		expect(dobj2.location).is.undefined;
		expect(dobj1.contents.length).is.equal(0);
		expect(dobj2.contents.length).is.equal(0);

		// move 1 inside 2
		dobj1.location = dobj2;
		expect(dobj1.location).is.equal(dobj2);
		expect(dobj2.location).is.undefined;
		expect(dobj2.contains(dobj1)).is.true;

		// use remove
		dobj2.remove(dobj1);
		expect(dobj1.location).is.undefined;
		expect(dobj2.location).is.undefined;
		expect(dobj1.contents.length).is.equal(0);
		expect(dobj2.contents.length).is.equal(0);

		// use add
		dobj2.add(dobj1);
		expect(dobj1.location).is.equal(dobj2);
		expect(dobj2.location).is.undefined;
		expect(dobj2.contains(dobj1)).is.true;

		// add to another location
		let dobj3: dungeon.DObject = new dungeon.DObject();
		dobj3.add(dobj1);
		expect(dobj1.location).is.equal(dobj3);
		expect(dobj2.contents).is.empty;
		expect(dobj3.contains(dobj1)).is.true;
		done();
	});

	it("Take a step in each direction.", function(done){
		let original = d.getRoom({x:0,y:0,z:0});
		expect(m.location).is.equal(original);
		expect(m.x).is.equal(0);
		expect(m.y).is.equal(0);
		expect(m.z).is.equal(0);

		let up = d.getRoom({x:0,y:0,z:1});
		expect(m.step(Direction.UP)).is.true;
		expect(up.contains(m)).is.true;
		expect(m.location).is.equal(up);
		expect(m.x).is.equal(0);
		expect(m.y).is.equal(0);
		expect(m.z).is.equal(1);

		expect(m.step(Direction.DOWN)).is.true;
		expect(original.contains(m)).is.true;
		expect(m.location).is.equal(original);
		expect(m.x).is.equal(0);
		expect(m.y).is.equal(0);
		expect(m.z).is.equal(0);

		let room2 = d.getRoom({x:1,y:0,z:0});
		m.step(Direction.EAST);
		expect(m.location).not.equal(original);
		expect(original.contains(m)).equal(false);
		expect(m.location).equal(room2);
		expect(room2.contains(m)).equal(true);

		let room3 = d.getRoom({x:1,y:1,z:0});
		m.step(Direction.SOUTH);
		expect(m.location).not.equal(room2);
		expect(room2.contains(m)).equal(false);
		expect(m.location).equal(room3);
		expect(room3.contains(m)).equal(true);

		let room4 = d.getRoom({x:0,y:1,z:0});
		m.step(Direction.WEST);
		expect(m.location).not.equal(room3);
		expect(room3.contains(m)).equal(false);
		expect(m.location).equal(room4);
		expect(room4.contains(m)).equal(true);

		// back to room 1
		m.step(Direction.NORTH);
		expect(m.location).not.equal(room4);
		expect(room4.contains(m)).equal(false);
		expect(m.location).equal(original);
		expect(original.contains(m)).equal(true);
		done();
	});

	it("Move mob off dungeon.", function(done){
		let room = d.getRoom({x:0,y:0,z:0});
		m.move(undefined);
		expect(m.location).equal(undefined);
		expect(m.location).not.equal(room);
		expect(room.contains(m)).equal(false);
		expect(d.contains(m)).equal(false);
		done();
	});

	it("Create a dungeon that is initially filled.", function(done){
		let filled: dungeon.Dungeon = new dungeon.Dungeon({proportions:{width:10,height:10,layers:1}, fill:true});
		for(let z=0;z<1;z++){
			for(let y=0;y<10;y++){
				for(let x=0;x<10;x++){
					let room = filled.getRoom({x:x,y:y,z:z});
					expect(room).is.not.undefined;
				}
			}
		}

		done();
	});

	it("Testing redundant adding/removing of DObject contents.", function(done){
		let room = d.getRoom({x:0,y:0,z:0});
		expect(d.contains(room)).is.true;
		d.add(room);
		expect(d.contains(room)).is.true;
		d.remove(room);
		expect(d.contains(room)).is.false;
		d.remove(room);
		expect(d.contains(room)).is.false;
		done();
	});

	it("Testing Dungeon dimension limits.", function(done){
		// out of bounds
		let error: Error|undefined;
		try{
			d.getRoom({x:-1,y:0,z:0});
		} catch(e){
			error = e;
		}

		expect(error).is.not.undefined;
		expect(error instanceof dungeon.CoordinateOutOfBoundsError).is.true;

		// out of bounds 2
		error = undefined;
		try{
			d.getRoom({x:0,y:-1,z:0});
		} catch(e){
			error = e;
		}

		expect(error).is.not.undefined;
		expect(error instanceof dungeon.CoordinateOutOfBoundsError).is.true;
		
		// out of bounds 3
		error = undefined;
		try{
			d.getRoom({x:0,y:0,z:-1});
		} catch(e){
			error = e;
		}

		expect(error).is.not.undefined;
		expect(error instanceof dungeon.CoordinateOutOfBoundsError).is.true;
		
		// out of bounds 4
		error = undefined;
		try{
			d.createRoom({x:-1,y:0,z:0});
		} catch(e){
			error = e;
		}

		expect(error).is.not.undefined;
		expect(error instanceof dungeon.CoordinateOutOfBoundsError).is.true;

		// out of bounds 5
		error = undefined;
		try{
			d.createRoom({x:0,y:-1,z:0});
		} catch(e){
			error = e;
		}

		expect(error).is.not.undefined;
		expect(error instanceof dungeon.CoordinateOutOfBoundsError).is.true;

		// out of bounds 6
		error = undefined;
		try{
			d.createRoom({x:0,y:0,z:-1});
		} catch(e){
			error = e;
		}

		expect(error).is.not.undefined;
		expect(error instanceof dungeon.CoordinateOutOfBoundsError).is.true;

		// coordinates occupied
		error = undefined;
		try{
			d.createRoom({x:0,y:0,z:0});
		} catch(e) {
			error = e;
		}

		expect(error).is.not.undefined;
		expect(error instanceof dungeon.CoordinatesOccupiedError).is.true;

		// no room at location
		let empty = new dungeon.Dungeon({proportions:{width:10,height:10,layers:1}, fill:false});
		error = undefined;
		try{
			empty.getRoom({x:0,y:0,z:0});
		} catch(e) {
			error = e;
		}

		expect(error).is.not.undefined;
		expect(error instanceof dungeon.NoRoomError).is.true;
		done();
	});
});
