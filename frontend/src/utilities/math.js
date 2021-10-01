export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function lerp(percentage, start, end, clampPercentage = true) {
  if (clampPercentage) percentage = clamp(percentage, 0, 1)
  return start + (end - start) * percentage
}

export function getPercentage(value, start, end, clampValue = true) {
  if (clampValue) value = clamp(value, start, end)
  return (value - start) / (end - start)
}

// Maps input percentage to output percentage https://arxiv.org/abs/2010.09714
// Visualize: https://www.desmos.com/calculator/t9uwpot2of?lang=en-US
export function ease(x, gain, bias, clampPercentage = true)
{
  // Gain received as an easy to use [-1, 1] range
  // which is denormalized into a [0,∞] range to use in the Barron generalization
  const E = 0.0000000001;
  const denormalizedGain = gain <= 0 ?
    (- (Math.pow(- gain, 0.5) / 2) + 0.5) * 2
    : -1 / ((((Math.pow(gain, 0.5) / 2) + 0.5) - 0.5) * 2 - 1 - E);

  let value = x < bias ?
    (bias * x) / (x + denormalizedGain * (bias - x) + E)
    : ((1 - bias) * (x - 1)) / (1 - x - denormalizedGain * (bias - x) + E) + 1;

  return clampPercentage ? clamp(value, 0, 1) : value;
}