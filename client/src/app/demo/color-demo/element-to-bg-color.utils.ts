// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

export const extractRgb = (rgb: string): null | [number, number, number] => {
  const matchArray = rgb.match(/rgb\(([0-9]+), ([0-9]+), ([0-9]+)\)/);
  if (!matchArray) {
    return null;
  }
  const [, r, g, b] = matchArray;
  return [parseInt(r, 10), parseInt(g, 10), parseInt(b, 10)];
};

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};
