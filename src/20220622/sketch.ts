import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
import { attractor } from "./attractor";
import { synth, synthType } from "./synth.js";

export const sketch = (s: p5) => {
  const size = tools.setSize("sketch");
  let controllers = controller.setController();
  const attractorParams = attractor.setParams();
  const synthParams = synth.setParams();
  let attractorData = attractor.setData(attractorParams, size);
  let synthData: synthType;
  s.setup = async () => {
    s.createCanvas(size, size);
    synthData = await synth.setSynth();
    const tab = controller.setGui(s, controllers, synthData.se, false);
    attractor.setGui(attractorParams, tab);
    // s.blendMode(s.OVERLAY);
    // tab.pages[0].addInput(params, 'margin');
    synth.setGui(synthParams, tab);
    s.noLoop();
    drawFrame(s, size);
    // s.frameRate(10);
  };
  s.draw = () => {
    if (synthData === undefined) s.noLoop();
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
