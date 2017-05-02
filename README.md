# TestReducer

## Example
```typescript
import {} from 'jasmine';

// When consuming as package, import statement should be:
// import { TestReducer } from 'test-reducer'
import { TestReducer}  from '../TestReducer'

const sampleReducer = (state, action) => {
    switch (action.type) {
        case 'ADD':
            const newCounterValue = state.counter + action.payload;
            return (<any>Object).assign({}, state, {counter: newCounterValue})
            
        case 'RESET':
            return (<any>Object).assign({}, state, {counter: 0})

        default:
            return (<any>Object).assign({}, state)
    }
}

const state = {
    counter: 0,
    moreStuff: {foo: 'bar'}
}

describe('counter',() => {
    it('should add 4 to the counter', () => {
        new TestReducer(sampleReducer, state)
            .givenInitialState({counter: 3})
            .whenDispatchingAction({type: 'ADD', payload: 4})
            .thenNextStateShouldBe({counter: 7})
    })
    it('should reset the counter', () => {
        new TestReducer(sampleReducer, state)
            .givenInitialState({counter: 3})
            .whenDispatchingAction({type: 'RESET'})
            .thenNextStateShouldBe({counter: 0})
    })
    it('should do nothing on an unknown action', ()=> {
        new TestReducer(sampleReducer, state)
            .whenDispatchingAction({type: 'BLA'})
            .thenNextStateShouldNotChange()
    })
})
```