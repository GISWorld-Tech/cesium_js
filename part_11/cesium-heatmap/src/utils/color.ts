import tinycolor from "tinycolor2";

export const interpolateColor = (
  normalizedValue: number,
  colors: string[],
): string => {
  const steps = colors.length - 1;
  const step = Math.floor(normalizedValue * steps);
  const remainder = normalizedValue * steps - step;

  const startColor = colors[step];
  const endColor = colors[Math.min(step + 1, steps)];
  return tinycolor.mix(startColor, endColor, remainder * 100).toRgbString();
};
