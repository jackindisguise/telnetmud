import "mocha";
import { logger } from "./src/util/logger";
import { expect } from "chai";
logger.transports[0].silent = true; // silence console transport

describe("Turn off logging...", function(){
	it("Logging disabled.", function(done){
		logger.info("Logging disabled.");
		done();
	});
});