"use strict";
exports.__esModule = true;
var jasmine_1 = require("jasmine");
var _ = require("lodash");
var TestReducer = (function () {
    function TestReducer(reducer, baseState) {
        if (baseState === void 0) { baseState = {}; }
        var _this = this;
        this.YELLOW_COLOR_CONSOLE = '\x1b[33m';
        this.RESET_CONSOLE = '\x1b[0m';
        this.getProp = function (obj, prop) {
            return _this.yellowify(_.get(obj, prop));
        };
        this.yellowify = function (text) {
            return _this.YELLOW_COLOR_CONSOLE + text + _this.RESET_CONSOLE;
        };
        if (!reducer) {
            throw Error('No reducer supplied to TestReducer');
        }
        this.reducer = reducer;
        this.baseState = baseState;
        this.newLineSeparator = "\n" + _.range(100).map(function (x) { return '='; }).join('') + "\n";
    }
    TestReducer.prototype.givenInitialState = function (initStateDiff) {
        if (initStateDiff === void 0) { initStateDiff = {}; }
        this.initialState = _.merge({}, this.baseState, initStateDiff);
        Object.freeze(this.initialState);
        return this;
    };
    TestReducer.prototype.whenDispatchingAction = function (action) {
        if (this.initialState === undefined) {
            this.givenInitialState();
        }
        this.actual = this.reducer(this.initialState, action);
        if (this.objectHasCycles(this.actual)) {
            throw new Error(this.yellowify('After dispatching the action, The returned state contains cyclic objects\n'));
        }
        return this;
    };
    TestReducer.prototype.thenNextStateShouldBe = function (nextStateDiff) {
        if (nextStateDiff === void 0) { nextStateDiff = {}; }
        if (!this.actual) {
            throw Error('No actual state found. Must call "When" Before calling "Then"');
        }
        var expected = _.merge({}, this.initialState, nextStateDiff);
        jasmine_1.expect(this.actual).toEqual(expected, this.generateDiffBetweenObjectsAsMessage(this.actual, expected));
    };
    TestReducer.prototype.thenNextStateShouldNotChange = function () {
        this.thenNextStateShouldBe({});
    };
    TestReducer.prototype.objectHasCycles = function (obj) {
        try {
            JSON.stringify(obj);
            return false;
        }
        catch (e) {
            return e.message.includes('cyclic');
        }
    };
    TestReducer.prototype.generateDiffBetweenObjectsAsMessage = function (actualObject, expectedObject) {
        var _this = this;
        var diffsBetweenActualAndExpected = this.diffKeysBetweenObjects(actualObject, expectedObject)
            .map(function (prop) { return prop + " = " + _this.getProp(actualObject, prop) + " And should be: " + _this.getProp(expectedObject, prop); })
            .join('\n');
        return this.newLineSeparator
            + diffsBetweenActualAndExpected
            + this.newLineSeparator;
    };
    TestReducer.prototype.diffKeysBetweenObjects = function (obj1, obj2, path) {
        if (path === void 0) { path = null; }
        var _self = this;
        obj1 = obj1 || {};
        obj2 = obj2 || {};
        var union_keys = Object.keys(obj1)
            .concat(Object.keys(obj2)
            .filter(function (key) { return !obj1.hasOwnProperty || !obj1.hasOwnProperty((key)); }));
        return _.reduce(union_keys, function (result, key) {
            var value1 = obj1[key];
            var value2 = obj2[key];
            var nextPath = path ? path + '.' + key : key;
            if (_.isObject(value1) || _.isObject(value2)) {
                var diff = _self.diffKeysBetweenObjects(value1, value2, nextPath);
                return diff.length ? result.concat(diff) : result;
            }
            return _.isEqual(value1, value2) ? result : result.concat(nextPath);
        }, []);
    };
    return TestReducer;
}());
exports.TestReducer = TestReducer;
