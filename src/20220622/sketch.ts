import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
import { attractor } from "./attractor";
import p5 from "p5";
// import { setSynth, playSynth } from './synth.js';

export const sketch = (s: p5) => {
  const size = tools.setSize("sketch");
  let controllers = controller.setController();
  const attractorParams = attractor.setParams();
  let attractorData = attractor.setData(attractorParams, size);
  // let synth;
  s.setup = () => {
    s.createCanvas(size, size);
    const tab = controller.setGui(s, controllers, false, false);
    attractor.setGui(attractorParams, tab);
    // s.blendMode(s.OVERLAY);
    // tab.pages[0].addInput(params, 'margin');
    // synth = setSynth(params, tab);
    s.noLoop();
    // s.pixelDensity(1);
    // s.frameRate(10);
  };
  s.draw = () => {
    s.background(33, 11, 44, 200);
    controller.updateController(s, controllers);
    attractorData = attractor.updateData(attractorData, attractorParams, size);
    attractor.draw(attractorData, attractorParams, s);
    // debug(attractorObj);
    drawFrame(s, size);
    controller.updateController(s, controllers);
    // playSynth(attractorObj, synth, params, s);
  };
};
