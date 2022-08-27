import p5 from "p5";

const map = (
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
): number => {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

const setColor = (r: number, g: number, b: number) => {
  const color = new p5.Color();
  color.setRed(r);
  color.setGreen(g);
  color.setGreen(b);
  return color;
};

const setSize = (div: string) => {
  const canvasDiv = document.getElementById(div)!;
  const divSize = canvasDiv.clientWidth;
  const maxSize = 550;
  return divSize > maxSize ? maxSize : divSize;
};

export const tools = {
  map,
  setColor,
  setSize,
};
