import { pick, prune } from '..';

describe('prune function tests', () => {

  it('do not change origin object', () => {
    const origin = { a: 1, b: 2, c: 3 };
    const result = prune(origin, 'a');
    expect(origin).not.toEqual(result);
  });

  it('prune object', () => {
    const origin = { a: 1, b: 2, c: 3 };
    const result = prune(origin, '$.c');
    expect(Object.keys(result).includes('c')).toBeFalsy();
  });

  it('prune array item', () => {
    const origin = [1, 2, 3, 4];
    const result = prune(origin, '$.1');
    expect(Array.isArray(result)).toBeTruthy();
    expect(result[0]).toEqual(1);
    expect(result[1]).toEqual(3);
    expect(result[2]).toEqual(4);
  });

  it('prune two keys of object', () => {
    const origin = { a: 1, b: 2, c: 3 };
    const result = prune(origin, '$["a","b"]');
    expect(Object.keys(result).length).toEqual(1);
  });

});

describe('pick function tests', () => {

  it('do not change origin object', () => {
    const origin = { a: 1, b: 2, c: 3 };
    const result = pick(origin, 'a');
    expect(origin).not.toEqual(result);
  });

  it('pick from object', () => {
    const origin = { a: { b: { c: 3 } } };
    const [result] = pick(origin, 'a.b.c');
    expect(result).toEqual(3);
  });

  it('pick from array', () => {
    const origin = [0, 1, 2, ['a', 'b', 'c']];
    const [result] = pick(origin, '$.3.2');
    expect(result).toEqual('c');
  });

});
