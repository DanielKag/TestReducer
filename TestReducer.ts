import {expect, toEqual} from 'jasmine'
import * as _ from 'lodash'

export interface IAction {
    type: string;
    payload: any;
}

export class TestReducer {
  private reducer: (any, IAction) => any;
  private baseState: any;
  private initialState: any;
  private actual: any;
  private newLineSeparator: string;
  readonly YELLOW_COLOR_CONSOLE = '\x1b[33m';
  readonly RESET_CONSOLE = '\x1b[0m';

  constructor (reducer: (any, IAction) => any, baseState: any = {}) {
    if (!reducer) {
      throw Error('No reducer supplied to TestReducer');
    }

    this.reducer = reducer;
    this.baseState = baseState;
    this.newLineSeparator = `\n${_.range(100).map(x => '=').join('')}\n`;  }

  public givenInitialState (initStateDiff: any = {}): TestReducer {
    this.initialState = _.merge({}, this.baseState, initStateDiff);
    Object.freeze(this.initialState);
    return this;
  }

  public whenDispatchingAction (action: IAction): TestReducer {
    if (this.initialState === undefined) {
      this.givenInitialState();
    }

    this.actual = this.reducer(this.initialState, action);
    if (this.objectHasCycles(this.actual)) {
      throw new Error(this.yellowify('After dispatching the action, The returned state contains cyclic objects\n'));
    }

    return this;
  }

  public thenNextStateShouldBe (nextStateDiff: any = {}): void {
    if (!this.actual) {
      throw Error('No actual state found. Must call "When" Before calling "Then"');
    }

    const expected = _.merge({}, this.initialState, nextStateDiff);
    expect(this.actual).toEqual(expected, this.generateDiffBetweenObjectsAsMessage(this.actual, expected));
  }

  public thenNextStateShouldNotChange (): void {
    this.thenNextStateShouldBe({});
  }

  private objectHasCycles(obj: any): boolean {
    try {
      JSON.stringify(obj);
      return false;
    } catch (e) {
      return e.message.includes('cyclic');
    }
  }

  private generateDiffBetweenObjectsAsMessage (actualObject: any, expectedObject: any): string {
    const diffsBetweenActualAndExpected =  this.diffKeysBetweenObjects(actualObject, expectedObject)
     .map(prop => `${prop} = ${this.getProp(actualObject, prop)} And should be: ${this.getProp(expectedObject, prop)}`)
      .join('\n');

    return this.newLineSeparator
        + diffsBetweenActualAndExpected
        + this.newLineSeparator;
  }

  private getProp = (obj: any, prop: string): string =>
    this.yellowify(_.get<string>(obj, prop));

  private yellowify = (text: string) : string =>
    this.YELLOW_COLOR_CONSOLE + text + this.RESET_CONSOLE;

  private diffKeysBetweenObjects (obj1: any, obj2: any, path: string = null): string[] {
    const _self: any = this;
    obj1 = obj1 || {};
    obj2 = obj2 || {};

    const union_keys: string[] = Object.keys(obj1)
                                  .concat(Object.keys(obj2)
                                            .filter(key => !obj1.hasOwnProperty || !obj1.hasOwnProperty((key))));

    return _.reduce(union_keys, (result, key) => {
      const value1: any = obj1[key];
      const value2: any = obj2[key];
      const nextPath: string = path ? path + '.' + key : key;

      if (_.isObject(value1) || _.isObject(value2)) {
        const diff: string[] = _self.diffKeysBetweenObjects(value1, value2, nextPath);
        return diff.length ? result.concat(diff) : result;
      }
      return _.isEqual(value1, value2) ? result : result.concat(nextPath);
    }, []);
  }
}