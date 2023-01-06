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

const constrain = (value: number, low: number, high: number): number => {
  return Math.max(Math.min(value, high), low);
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

// ref: https://qiita.com/kit2cuz/items/ef93aeb558f353ab479c
const getIntersection = (
  start_1: p5.Vector,
  end_1: p5.Vector,
  start_2: p5.Vector,
  end_2: p5.Vector
): p5.Vector => {
  // if point, not line
  if (start_1.equals(end_1) || start_2.equals(end_2)) return end_1;

  // get normalized vector
  const n1 = p5.Vector.normalize(p5.Vector.sub(end_1, start_1));
  const n2 = p5.Vector.normalize(p5.Vector.sub(end_2, start_2));

  // if two lines are parallel
  if (Math.abs(1 - Math.abs(p5.Vector.dot(n1, n2))) < 0.00001) return end_1;

  // get needed vectors
  const AC = p5.Vector.sub(start_2, start_1);
  const d1 =
    (p5.Vector.dot(n1, AC) - p5.Vector.dot(n2, AC) * p5.Vector.dot(n1, n2)) /
    (1 - p5.Vector.dot(n1, n2) * p5.Vector.dot(n1, n2));
  const d2 =
    (-1 * p5.Vector.dot(n2, AC) +
      p5.Vector.dot(n1, AC) * p5.Vector.dot(n1, n2)) /
    (1 - p5.Vector.dot(n1, n2) * p5.Vector.dot(n1, n2));

  // if intersection is outside of line
  if (d1 < 0 || d2 < 0) return end_1;
  if (d2 > p5.Vector.dist(start_2, end_2)) return end_1;

  // const p1 = p5.Vector.add(A, p5.Vector.mult(n1, d1));
  const p2 = p5.Vector.add(start_2, p5.Vector.mult(n2, d2));
  return p2;
};

export const tools = {
  map,
  constrain,
  setColor,
  setSize,
  getIntersection,
};
