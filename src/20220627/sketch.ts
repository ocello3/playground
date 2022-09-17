import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
// import { debug } from "../util/debug";
import { flooder } from "./flooder";
import { bubble } from "./bubble";
import { synth } from "./synth.js";

export const sketch = async (s: p5) => {
  const size = tools.setSize("sketch");
  let font: p5.Font;
  let controllers = controller.setController();
  const flooderParams = flooder.setParams();
  const bubbleParams = bubble.setParams();
  const synthParams = synth.setParams();
  let flooderData = flooder.setData(flooderParams, size);
  let bubbleData = bubble.setData(flooderData);
  let synthData = synth.setSynth();
  s.preload = () => {
    font = s.loadFont("../../src/font/Fascinate-Regular.ttf");
  };
  s.setup = () => {
    s.createCanvas(size, size);
    const tab = controller.setGui(s, controllers, true, false);
    flooder.setGui(flooderParams, tab);
    bubble.setGui(bubbleParams, tab);
    synth.setGui(synthParams, tab);
    s.noLoop();
    // s.frameRate(10);
  };
  s.draw = () => {
    s.background(255);
    controller.updateController(s, controllers);
    flooderData = flooder.updateData(flooderData, flooderParams, size, s);
    bubbleData = bubble.updateData(
      flooderData,
      bubbleData,
      bubbleParams,
      size,
      s
    );
    flooder.draw(flooderData, size, font, s);
    bubble.draw(bubbleData, s);
    drawFrame(s, size);
    // debug(flooderData);
    synth.playSynth(flooderData, flooderParams, synthParams, synthData, size);
  };
};
