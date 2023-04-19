import {
  // convertToRules,
  getValueByNamePath,
  parseArrayNamePathToString,
  parseStringNamePathToArray,
  setObserverable,
  setValueByNamePath,
  mergeNamePath,
  mergeRules,
  switchArrayItemByIndex,
} from '../utils/helper';
import * as mobx from 'mobx';

// describe('convertToRules function', () => {
//   it('should correctly convert a rules object to a Rules object', () => {
//     const rules = {
//       'foo.bar': [{ required: true }],
//       'baz[0].qux': [{ type: 'number' }],
//       'baz[1].qux': [{ type: 'string' }],
//     };
//     const expected = {
//       foo: {
//         type: 'object',
//         fields: {
//           bar: { required: [{ required: true }] },
//         },
//       },
//       baz: {
//         type: 'array',
//         defaultField: {
//           type: 'object',
//           fields: {
//             qux: {
//               type: 'union',
//               rules: [{ type: 'number' }, { type: 'string' }],
//             },
//           },
//         },
//       },
//     };
//     expect(convertToRules(rules)).toEqual(expected);
//   });
// });

describe('mergeRules function', () => {
  it('should correctly merge rules', () => {
    const rules = [{ type: 'number' }] as any;
    const required = true;
    const isListField = false;
    const expected = [{ type: 'number' }, { required: true }];
    expect(mergeRules(rules, required, isListField)).toEqual(expected);
  });

  it('should correctly merge rules when isListField is true', () => {
    const rules = [{ type: 'number' }] as any;
    const required = true;
    const isListField = true;
    const expected = [{ type: 'number' }, { required: true }];
    expect(mergeRules(rules, required, isListField)).toEqual(expected);
  });
});

describe('setObserverable', () => {
  beforeEach(() => {
    mobx.configure({ enforceActions: 'always' });
  });

  afterEach(() => {
    mobx.configure({ enforceActions: 'never' });
  });

  it('should set value in observable target', () => {
    const target = mobx.observable({ a: 1 });
    setObserverable(target, 'a', 2);
    expect(target.a).toBe(2);
  });

  it('should set value in observable target with array name path', async () => {
    const target = mobx.observable({ a: [{ b: 1 }] });
    setObserverable(target, ['a', 0, 'b'], 2);
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(mobx.toJS(target));
    expect(target.a[0].b).toBe(2);
  });

  it('should set value in observable target with string name path', async () => {
    const target = mobx.observable({ a: [{ b: 1 }] });
    setObserverable(target, 'a[0].b', 2);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(target.a[0].b).toBe(2);
  });

  it('should merge object when setting value with array name path', async () => {
    const target = mobx.observable({ a: [{ b: 1 }] });
    setObserverable(target, ['a', 1, 'c'], 2);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(target.a).toEqual([{ b: 1 }, { c: 2 }]);
  });

  it('should merge object when setting value with string name path', async () => {
    const target: any = mobx.observable({ a: [{ b: 1 }] });
    setObserverable(target, ['a', 1, 'c'], 2);
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(target.a[1].c).toEqual(2);
  });
});

describe('getValueByNamePath', () => {
  it('returns the value for a given name path', () => {
    const value = { foo: { bar: 42 } };
    expect(getValueByNamePath('foo.bar', value)).toBe(42);

    const value2 = { foo: { bar: 42 } };
    expect(getValueByNamePath(['foo', 'bar'], value2)).toBe(42);
  });
});

describe('setValueByNamePath', () => {
  beforeEach(() => {
    mobx.configure({ enforceActions: 'always' });
  });

  afterEach(() => {
    mobx.configure({ enforceActions: 'never' });
  });
  it('sets the value for a given name path', () => {
    let target = { foo: { bar: 0 } } as any;
    target = setValueByNamePath('foo.bar', 42, target);
    expect(target.foo.bar).toBe(42);

    target = setValueByNamePath(['foo', 'bar'], 52, target);
    expect(target.foo.bar).toBe(52);
  });
});
describe('parseArrayNamePathToString', () => {
  it('converts an array name path to a string', () => {
    expect(parseArrayNamePathToString(['a', 0, 'b', 'c'])).toBe('a[0].b.c');
  });

  it('returns a string name path unchanged', () => {
    expect(parseArrayNamePathToString('foo.bar')).toBe('foo.bar');
  });
});

describe('parseStringNamePathToArray', () => {
  it('converts a string name path to an array', () => {
    expect(parseStringNamePathToArray('a[0].b.c')).toEqual(['a', 0, 'b', 'c']);
  });

  it('returns an array name path unchanged', () => {
    expect(parseStringNamePathToArray(['foo', 'bar'])).toEqual(['foo', 'bar']);
  });
});

describe('mergeNamePath', () => {
  it('merges two name paths', () => {
    expect(mergeNamePath(['foo'], ['bar'])).toEqual(['foo', 'bar']);
    expect(mergeNamePath('foo', ['bar'])).toEqual(['foo', 'bar']);
    expect(mergeNamePath('foo', 'bar')).toEqual(['foo', 'bar']);
  });
});

describe('switchArrayItemByIndex', () => {
  test('should switch elements at two specified indexes', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = switchArrayItemByIndex(arr, 1, 3);
    expect(result).toEqual([1, 4, 3, 2, 5]);
  });

  test('should throw an error if index is out of range', () => {
    const arr = [1, 2, 3];
    expect(() => switchArrayItemByIndex(arr, 0, 3)).toThrow();
    expect(() => switchArrayItemByIndex(arr, -1, 1)).toThrow();
    expect(() => switchArrayItemByIndex(arr, 2, 4)).toThrow();
  });

  test('should not mutate the original array', () => {
    const arr = [1, 2, 3, 4, 5];
    switchArrayItemByIndex(arr, 1, 3);
    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });
});
