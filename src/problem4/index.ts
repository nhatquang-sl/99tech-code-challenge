/*
Complexity:
Time: O(n) — iterates once for every number up to n.
Space: O(1) — number of variables used does not depend on n.
*/
function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/*
Complexity:
Time: O(1) — constant time.
Space: O(1) — number of variables used does not depend on n.
*/
function sum_to_n_b(n: number): number {
  if (n < 0) return 0;
  return (n * (n + 1)) / 2;
}

/*
Complexity:
Time: O(n) — makes n recursive calls.
Space: O(n) — call stack grows linearly with n due to call stack depth.
*/
function sum_to_n_c(n: number): number {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
}

export { sum_to_n_a, sum_to_n_b, sum_to_n_c };
