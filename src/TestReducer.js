"use strict";
exports.__esModule = true;
var utils = require("./utils");
var merge = require("lodash.merge");
var isFunction = require("lodash.isfunction");
var isObject = require("lodash.isobject");
var TestReducer = (function () {
    function TestReducer(reducer, baseState) {
        if (baseState === void 0) { baseState = {}; }
        if (!reducer)
            throw new Error('No reducer supplied to TestReducer');
        if (!isFunction(reducer))
            throw new Error('The reducer must be a function');
        this.reducer = reducer;
        this.baseState = baseState;
    }
    TestReducer.prototype.givenState = function (initStateDiff) {
        if (initStateDiff === void 0) { initStateDiff = {}; }
        if (!isObject(initStateDiff))
            throw new Error('initState must be an object');
        this.initialState = merge({}, this.baseState, initStateDiff);
        Object.freeze(this.initialState);
        return this;
    };
    TestReducer.prototype.whenActionIs = function (action) {
        if (this.initialState === undefined)
            this.givenState();
        this.actualResult = this.reducer(this.initialState, action);
        if (utils.objectHasCycles(this.actualResult))
            throw new Error('Actual state contains cyclic objects\n');
        return this;
    };
    TestReducer.prototype.thenStateIs = function (nextStateDiff) {
        if (nextStateDiff === void 0) { nextStateDiff = {}; }
        if (!this.actualResult)
            throw new Error('No actual state found. Must call "When" Before calling "Then"');
        var expected = merge({}, this.initialState, nextStateDiff);
        if (utils.objectHasCycles(expected))
            throw new Error('Expect state contains cyclic objects\n');
        var diff = utils.generateDiffBetweenObjectsAsMessage(this.actualResult, expected);
        if (diff)
            throw new Error(diff);
        return true;
    };
    TestReducer.prototype.thenNoChange = function () {
        this.thenStateIs({});
    };
    return TestReducer;
}());
exports.TestReducer = TestReducer;
