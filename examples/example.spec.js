const TestReducer = require('test-reducer').TestReducer

describe('counter #example',() => {
    let tester;
    const state = {
        counter: 0,
        settings: {admin: {display: false, notRelevantProp: 1}, notRelevantProp: 4}
    }

    beforeEach(() => {
        tester = new TestReducer(sampleReducer, state);
    });

    it('should do nothing on an unknown action', ()=> {
        tester
            .whenActionIs({type: 'BLA'})
            .thenNoChange();
    })
    it('should add 4 to the counter', () => {
        tester
            .givenState({counter: 3})
            .whenActionIs({type: 'ADD', payload: 4})
            .thenStateIs({counter: 7});
    })
    it('should reset the counter', () => {
        tester
            .givenState({counter: 3})
            .whenActionIs({type: 'RESET'})
            .thenStateIs({counter: 0});
    })
    // This test is failing on porpuse
    it('should update the display settings from true to false', () => {
        tester
            .givenState({settings: {admin: {display: true}}})
            .whenActionIs({type: 'TOGGLE_DISPLAY'})
            .thenStateIs({settings: {admin: {display: true, prop: 1}}});
    })
})

const sampleReducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            const newCounterValue = state.counter + action.payload;
            return Object.assign({}, state, {counter: newCounterValue})
            
        case 'RESET':
            return Object.assign({}, state, {counter: 0})

        case 'TOGGLE_DISPLAY':
            const newSettings = {
                admin: {
                    display: !state.settings.admin.display, 
                    notRelevantProp: 1
                }, notRelevantProp: 4
            }
            return Object.assign({}, state, {settings: newSettings});

        default:
            return Object.assign({}, state)
    }
}