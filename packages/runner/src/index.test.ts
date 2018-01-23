import { sequence } from './index'

test('should return a sequence promise', () => {
  expect(sequence()).toBeInstanceOf(Promise);
});