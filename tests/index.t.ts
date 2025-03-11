import { add } from '../src';

describe('add', () => {
  it('should return the sum of two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
