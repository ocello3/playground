import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
// import { debug } from "../util/debug";
import { mover } from "./mover";
import { wind } from "./wind";
import { synth, synthType } from "./synth.js";

export const sketch = (s: p5) => {
  const size = tools.setSize("sketch");
  let controllers = controller.setController();
  const moverParams = mover.setParams();
  const windParams = wind.setParams(moverParams);
  const synthParams = synth.setParams();
  let moverData = mover.setData(moverParams, size);
  let windData = wind.setData(windParams, size);
  let synthData: synthType;
  s.setup = async () => {
    s.createCanvas(size, size);
    synthData = await synth.setSynth();
    const tab = controller.setGui(s, controllers, synthData.se, false);
    mover.setGui(moverParams, tab);
    wind.setGui(windParams, tab);
    synth.setGui(synthParams, tab);
    s.noLoop();
    // s.frameRate(10);
  };
  s.draw = () => {
    if (synthData === undefined) return;
    // debug(moverData);
    s.background(255);
    controller.updateController(s, controllers);
    moverData = mover.updateData(moverData, moverParams, size);
    windData = wind.updateData(
      windData,
      moverData,
      windParams,
      moverParams,
      size
    );
    mover.draw(moverData, moverParams, size, s);
    wind.draw(windData, s);
    drawFrame(s, size);
    // synth.playSynth(libData, synthData, synthParams, size);
  };
};
