import { prune } from '..';

describe('prune function tests', () => {

  it('do not change origin object', () => {
    const origin = { a: 1, b: 2, c: 3 };
    const result = prune(origin, 'a');
    expect(origin).not.toEqual(result);
  });

  it('prune two keys of object', () => {
    const origin = { a: 1, b: 2, c: 3 };
    const result = prune(origin, '$["a","b"]');
    expect(Object.keys(result).length).toEqual(1);
  });

});
