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
import * as Segment from "./component/segment";
import * as BufferSketch from "./component/bufferSketch";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let seq: Seq.type;
  let synth: Synth.type;
  let synthData: SynthData.type;
  let buffer: Buffer.type;
  let loop: Loop.type;
  let segment: Segment.type;
  let bufferSketch: BufferSketch.type;
  s.setup = async () => {
    // set sound
    synth = await Synth.set();
    synthData = SynthData.get(synth);
    seq = Seq.get(synthData, params, s.millis());
    // set component
    buffer = Buffer.get(seq, params, canvasSize, synthData);
    loop = Loop.get(params, canvasSize, seq, synthData, buffer);
    segment = Segment.get(params, canvasSize, seq, loop);
    bufferSketch = BufferSketch.get(
      seq,
      params,
      canvasSize,
      synthData,
      buffer,
      loop,
      segment
    );
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
    buffer = Buffer.get(seq, params, canvasSize, synthData, buffer);
    loop = Loop.get(params, canvasSize, seq, synthData, buffer, loop);
    segment = Segment.get(params, canvasSize, seq, loop, segment);
    bufferSketch = BufferSketch.get(
      seq,
      params,
      canvasSize,
      synthData,
      buffer,
      loop,
      segment,
      bufferSketch
    );
    // draw component
    Buffer.draw(buffer, segment, seq, params, s);
    Loop.draw(loop, segment, seq, params, s);
    BufferSketch.draw(bufferSketch, segment, seq, params, s);
    drawFrame(s, canvasSize);
    // play sound
    Synth.play(synth, seq, bufferSketch, params, s.frameCount);
  };
};
