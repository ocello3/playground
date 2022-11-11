import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import { lib, dataType } from "./lib";
import { synth, synthType } from "./synth.js";

export const sketch = (s: p5) => {
  const size = tools.setSize("sketch");
  let controllers = controller.setController();
  const libParams = lib.setParams();
  let libData: dataType;
  const synthParams = synth.setParams();
  let synthData: synthType;
  s.setup = async () => {
    synthData = await synth.setSynth();
    console.log(synthData.data); // remove later
    libData = lib.setData(libParams, size);
    s.createCanvas(size, size);
    const tab = controller.setGui(s, controllers, synthData.se, false);
    lib.setGui(libParams, tab);
    synth.setGui(synthParams, tab);
    s.noLoop();
    drawFrame(s, size);
    // s.frameRate(10);
  };
  s.draw = () => {
    if (synthData === undefined) s.noLoop();
    debug(libData);
    s.background(255);
    controller.updateController(s, controllers);
    libData = lib.updateData(libData, libParams, size);
    lib.draw(libData, s);
    drawFrame(s, size);
    if (s.frameCount === 2) synth.playSynth(synthData, synthParams);
  };
};
