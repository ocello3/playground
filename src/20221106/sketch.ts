import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as Params from "./params";
import * as Synth from "./sound/synth";
import * as SynthData from "./sound/synthData";
import * as Seq from "./sound/sequence";
import * as Buffer from "./component/buffer";
import * as Loop from "./component/loop";
import * as BufferSketch from "./component/bufferSketch";

export const sketch = (s: p5) => {
  const size = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set(size);
  let seq: Seq.type;
  let synth: Synth.type;
  let synthData: SynthData.type;
  let buffer: Buffer.type;
  let loop: Loop.type;
  let bufferSketch: BufferSketch.type;
  s.setup = async () => {
    // set sound
    synth = await Synth.set();
    synthData = SynthData.get(synth);
    seq = Seq.get(synthData, params, s.millis());
    // set component
    buffer = Buffer.get(seq, params, size, synthData);
    loop = Loop.get(params, seq, synthData, buffer);
    bufferSketch = BufferSketch.get(seq, params, size, synthData, buffer, loop);
    // set canvas
    s.createCanvas(size, size);
    const tab = controller.setGui(s, controllers, synth.se, false);
    Params.gui(params, tab);
    s.colorMode(s.HSB);
    s.noLoop();
    drawFrame(s, size);
    // s.frameRate(10);
  };
  s.draw = () => {
    if (synth === undefined) {
      s.noLoop();
      return;
    }
    debug(
      {
        loopStartTime: seq.loopStartTimes,
        loopEndTime: seq.loopEndTimes,
        isReverse: seq.loopIsReverses,
      },
      10
    );
    s.background(255);
    controller.updateController(s, controllers);
    // update sound
    seq = Seq.get(synthData, params, s.millis(), seq);
    // update component
    buffer = Buffer.get(seq, params, size, synthData, buffer);
    loop = Loop.get(params, seq, synthData, buffer, loop);
    bufferSketch = BufferSketch.get(
      seq,
      params,
      size,
      synthData,
      buffer,
      loop,
      bufferSketch
    );
    // draw component
    Buffer.draw(buffer, seq, params, s);
    Loop.draw(loop, seq, params, s);
    BufferSketch.draw(bufferSketch, seq, params, s);
    drawFrame(s, size);
    // play sound
    Synth.play(synth, seq, bufferSketch, params, s.frameCount);
  };
};
