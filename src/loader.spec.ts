// mocha and chai
import "mocha";
import { expect } from "chai";

// local includes
import * as database from "./database";
import * as loader from "./loader";
import { HelpFile } from "./help";

describe("loader", function(){
	it("Load database.", function(done){
		loader.load(done);
	});

	it("Check data.", function(done){
		expect(database.config.game.name).is.equal("telnetmud");
		expect(database.config.game.version).is.equal("1.0.0");
		expect(database.config.server.port).is.equal(23);
		expect(database.helpfiles.length).is.equal(1);

		let greeting: HelpFile|undefined = database.getHelpFileByKeyword("greeting blah");
		expect(greeting).is.undefined;

		greeting = database.getHelpFileByKeyword("greeting");
		expect(greeting).is.not.undefined;
		expect(greeting?greeting.body:undefined).is.equal("  {g____  ____  __    __ _  ____  ____{x                             {W___\n {g(_  _)(  __)(  )  (  ( \\(  __)(_  _){x                         {W,o88888\n   {g)(   ) _) / (_/\\/    / ) _)   )({x                        {W,o8888888'\n  {g(__) (____)\\____/\\_)__)(____) (__){x {Y,:o:o:oooo.        {W,8O88Pd8888\"\n           {g_  _  _  _  ____{x      {Y,.::.::o:ooooOoOoO. {W,oO8O8Pd888'\"\n          {g( \\/ )/ )( \\(    \\{x   {Y,.:.::o:ooOoOoOO8O8OOo.{W8OOPd8O8O\"\n          {g/ \\/ \\) \\/ ( ) D ({x  {Y, ..:.::o:ooOoOOOO8OOOOo.{WFdO8O8\"\n          {g\\_)(_/\\____/(____/{x {Y, ..:.::o:ooOoOO8O888O8O,{WCOCOO\"\n{c.------------------------------------.{x {Yo:ooOoOOOO8OOO{WOCOCO\"{Y\n{c|           {GCreated by Jack          {c|{x {Y:ooOoOoOO{W8O8OCCCC\"{Yo\n{c|            {GCreated with:           {c|{x {Y::o:oooo{WOoCoCCC\"{Yo:o\n{c|          {GNode v8.9492.3239         {c|{x {Y::o:o:,{WcooooCo\"{Yoo:o:\n{c|          {GTypescript v8.3.5         {c|{x {Y.:.:{Wcocoooo\"'{Yo:o:::'\n{c'------------------------------------'{x {Y::{Wccccoc\"'{Yo:o:o:::'\n                            {W:.:.    ,c:cccc\"'{Y:.:.:.:.:.'\n                          {W..:.:\"'`::::c:\"'{Y..:.:.:.:.:.'\n                          {W...:.'.:.::::\"'{Y    . . . . .'\n                        {W.. . ....:.\"'{Y `   .  . . ''\n                      {W. . . ....\"'\n                      {W.. . .\"'     -hrr-\n                    .{x\n");
		done();
	});
});