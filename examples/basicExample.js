"use strict";
exports.__esModule = true;
// When consuming as package, import statement should be:
// import { TestReducer } from 'test-reducer'
var TestReducer_1 = require("../TestReducer");
var sampleReducer = function (state, action) {
    switch (action.type) {
        case 'ADD':
            var newCounterValue = state.counter + action.payload;
            return Object.assign({}, state, { counter: newCounterValue });
        case 'RESET':
            return Object.assign({}, state, { counter: 0 });
        default:
            return Object.assign({}, state);
    }
};
var state = {
    counter: 0,
    moreStuff: { foo: 'bar' }
};
describe('counter', function () {
    it('should add 4 to the counter', function () {
        new TestReducer_1.TestReducer(sampleReducer, state)
            .givenInitialState({ counter: 3 })
            .whenDispatchingAction({ type: 'ADD', payload: 4 })
            .thenNextStateShouldBe({ counter: 7 });
    });
    it('should reset the counter', function () {
        new TestReducer_1.TestReducer(sampleReducer, state)
            .givenInitialState({ counter: 3 })
            .whenDispatchingAction({ type: 'RESET' })
            .thenNextStateShouldBe({ counter: 0 });
    });
    it('should do nothing on an unknown action', function () {
        new TestReducer_1.TestReducer(sampleReducer, state)
            .whenDispatchingAction({ type: 'BLA' })
            .thenNextStateShouldNotChange();
    });
});
