import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './index';

describe('three ways to sum to n', () => {
  test('should return 0 for negative numbers', () => {
    expect(sum_to_n_a(-1)).toBe(0);
    expect(sum_to_n_b(-1)).toBe(0);
    expect(sum_to_n_c(-1)).toBe(0);
  });

  test('should return 0 when n = 0', () => {
    expect(sum_to_n_a(0)).toBe(0);
    expect(sum_to_n_b(0)).toBe(0);
    expect(sum_to_n_c(0)).toBe(0);
  });

  test('should return 1 when n = 1', () => {
    expect(sum_to_n_a(1)).toBe(1);
    expect(sum_to_n_b(1)).toBe(1);
    expect(sum_to_n_c(1)).toBe(1);
  });

  test.each([
    [21, 231],
    [32, 528],
    [1010, 510555],
  ])('should return correct sum for %i', (n, expected) => {
    expect(sum_to_n_a(n)).toBe(expected);
    expect(sum_to_n_b(n)).toBe(expected);
    expect(sum_to_n_c(n)).toBe(expected);
  });
});
