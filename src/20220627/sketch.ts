import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
// import { debug } from "../util/debug";
import { flooder } from "./flooder";
import { bubble } from "./bubble";
import { synth, synthType } from "./synth.js";
import fontData from "../font/Fascinate-Regular.ttf";

export const sketch = async (s: p5) => {
  const size = tools.setSize("sketch");
  let font: p5.Font;
  let controllers = controller.setController();
  const flooderParams = flooder.setParams();
  const bubbleParams = bubble.setParams();
  const synthParams = synth.setParams();
  let flooderData = flooder.setData(flooderParams, size);
  let bubbleData = bubble.setData(flooderData);
  let synthData: synthType;
  s.preload = () => {
    font = s.loadFont(fontData);
  };
  s.setup = async () => {
    s.createCanvas(size, size);
    synthData = await synth.setSynth();
    const tab = controller.setGui(s, controllers, synthData.se, false);
    flooder.setGui(flooderParams, tab);
    bubble.setGui(bubbleParams, tab);
    synth.setGui(synthParams, tab);
    s.noLoop();
    // s.frameRate(10);
  };
  s.draw = () => {
    if (synthData === undefined) return;
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
