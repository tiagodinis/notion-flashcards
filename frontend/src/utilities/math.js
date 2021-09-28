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