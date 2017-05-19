"use strict";
exports.__esModule = true;
var get = require("lodash.get");
var isObject = require("lodash.isobject");
var isEqual = require("lodash.isequal");
var range = require("lodash.range");
var newLineSeparator = "\n" + range(100).map(function (x) { return '='; }).join('') + "\n";
var YELLOW_COLOR_CONSOLE = '\x1b[33m';
var RED_COLOR_CONSOLE = '\x1b[31m';
var RESET_CONSOLE = '\x1b[0m';
exports.objectHasCycles = function (obj) {
    try {
        JSON.stringify(obj);
        return false;
    }
    catch (e) {
        return e.message.includes('cyclic');
    }
};
exports.generateDiffBetweenObjectsAsMessage = function (actualObject, expectedObject) {
    var diffsBetweenActualAndExpected = diffKeysBetweenObjects(actualObject, expectedObject)
        .map(function (prop) { return prop + " = " + getProp(actualObject, prop) + " And should be: " + getProp(expectedObject, prop); })
        .join('\n');
    return addLineSeparatorToMessage(diffsBetweenActualAndExpected);
};
var addLineSeparatorToMessage = function (msg) {
    return msg
        ? redify(newLineSeparator) + msg + redify(newLineSeparator)
        : "";
};
var getProp = function (obj, prop) {
    return yellowify(get(obj, prop));
};
var yellowify = function (text) {
    return YELLOW_COLOR_CONSOLE + text + RESET_CONSOLE;
};
var redify = function (text) {
    return RED_COLOR_CONSOLE + text + RESET_CONSOLE;
};
var diffKeysBetweenObjects = function (obj1, obj2, path) {
    if (path === void 0) { path = null; }
    //const _self: any = this;
    obj1 = obj1 || {};
    obj2 = obj2 || {};
    var union_keys = Object.keys(obj1)
        .concat(Object.keys(obj2)
        .filter(function (key) { return !obj1.hasOwnProperty || !obj1.hasOwnProperty((key)); }));
    return union_keys.reduce(function (result, key) {
        var value1 = obj1[key];
        var value2 = obj2[key];
        var nextPath = path ? path + '.' + key : key;
        if (isObject(value1) || isObject(value2)) {
            var diff = diffKeysBetweenObjects(value1, value2, nextPath);
            return diff.length ? result.concat(diff) : result;
        }
        return isEqual(value1, value2) ? result : result.concat(nextPath);
    }, []);
};
