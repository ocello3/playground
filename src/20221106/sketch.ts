import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as Params from "./params";
import * as Synth from "./sound/synth";
import * as SynthData from "./sound/synthData";
import * as Ctrl from "./sound/controller";
import * as Buffer from "./component/buffer";
import * as Loop from "./component/loop";
import * as Segment from "./component/segment";
import * as Wave from "./component/wave";
import * as Box from "./component/box";
import * as Color from "./component/color";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let ctrl: Ctrl.type;
  let synth: Synth.type;
  let synthData: SynthData.type;
  let buffer: Buffer.type;
  let loop: Loop.type;
  let segment: Segment.type;
  let wave: Wave.type;
  let box: Box.type;
  let color: Color.type;
  s.setup = async () => {
    // set sound
    synth = await Synth.set();
    synthData = SynthData.get(synth);
    ctrl = Ctrl.get(synthData, params, s.millis());
    // set component
    buffer = Buffer.get(ctrl, params, canvasSize, synthData);
    loop = Loop.get(params, canvasSize, ctrl, synthData, buffer);
    segment = Segment.get(params, canvasSize, ctrl, loop);
    wave = Wave.get(ctrl, params, canvasSize, buffer, loop, segment);
    box = Box.get(params, canvasSize, buffer, loop, segment, wave);
    // set canvas
    s.createCanvas(canvasSize, canvasSize);
    const tab = controller.setGui(s, controllers, synth.se, false);
    Params.gui(params, tab);
    s.colorMode(s.HSB);
    s.noLoop();
    drawFrame(s, canvasSize);
    // s.frameRate(10);
  };
  s.draw = () => {
    if (synth === undefined) {
      s.noLoop();
      return;
    }
    debug(
      {
        loopStartTime: ctrl.loopStartTimes,
        loopEndTime: ctrl.loopEndTimes,
        isReverse: ctrl.loopIsReverses,
      },
      10
    );
    s.background(255);
    controller.updateController(s, controllers);
    // update sound
    ctrl = Ctrl.get(synthData, params, s.millis(), ctrl);
    // update component
    buffer = Buffer.get(ctrl, params, canvasSize, synthData, buffer);
    loop = Loop.get(params, canvasSize, ctrl, synthData, buffer, loop);
    segment = Segment.get(params, canvasSize, ctrl, loop, segment);
    wave = Wave.get(ctrl, params, canvasSize, buffer, loop, segment, wave);
    box = Box.get(params, canvasSize, buffer, loop, segment, wave, box);
    color = Color.get(ctrl, params, synthData, segment, color);
    // draw component
    Buffer.draw(buffer, segment, ctrl, params, s);
    Loop.draw(loop, segment, ctrl, params, s);
    Wave.draw(wave, segment, ctrl, params, s);
    Box.draw(box, segment, color, s);
    drawFrame(s, canvasSize);
    // play sound
    Synth.play(synth, ctrl, box, params, s.frameCount);
  };
};
