import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { attractor } from "./attractor";
import p5 from "p5";
import { eP5 } from "../type/eP5";
import { TabApi } from "tweakpane";
// import { setSynth, playSynth } from './synth.js';

const sketch = (s: eP5) => {
  let controllers = controller.setController();
  let attractors = {
    params: attractor.setParams(),
    preData: attractor.setData(),
  };
  let tab: TabApi;
  // let synth;
  s.setup = () => {
    const canvasDiv = document.getElementById("sketch")!;
    const size = canvasDiv.clientWidth;
    const gui = controller.setGui(s, controllers, false, false);
    params = setParams();
    attractorParams = attractor.setParams();
    s.createCanvas(size, size);
    // s.blendMode(s.OVERLAY);
    tab = gui(s, params, false, false); // audio, seq
    // tab.pages[0].addInput(params, 'margin');
    attractorObj = attractor.init(attractorParams, s);
    // synth = setSynth(params, tab);
    s.noLoop();
    // s.frameRate(10);
  };
  s.draw = () => {
    s.background(33, 11, 44, 200);
    // text
    attractorObj = attractor.update(attractorObj, attractorParams, s);
    attractor.draw(attractorObj, attractorParams, s);
    // debug(attractorObj);
    drawFrame(s, params);
    controller.updateController(s, controllers);
    // playSynth(attractorObj, synth, params, s);
  };
};
new p5(sketch, document.getElementById("sketch")!);
