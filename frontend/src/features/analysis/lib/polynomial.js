/** Evaluates sum(coefficients[i] * x^i) -- shared by the chart curve and the prediction input. */
export function evaluatePolynomial(coefficients, x) {
  return coefficients.reduce((sum, coefficient, power) => sum + coefficient * x ** power, 0);
}
