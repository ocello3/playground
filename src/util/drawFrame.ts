import p5 from "p5";

export const drawFrame = (s: p5, size: number) => {
  s.push();
  s.noFill();
  s.stroke(0);
  s.rect(0, 0, size, size);
  s.pop();
  return false;
};
