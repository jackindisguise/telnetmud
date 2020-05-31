"use strict";
exports.__esModule = true;
function pick() {
    var options = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        options[_i] = arguments[_i];
    }
    if (options[0] instanceof Array)
        options = options[0];
    var split = 1 / options.length;
    var roll = Math.random();
    var option = Math.floor(roll / split);
    return options[option];
}
exports.pick = pick;
