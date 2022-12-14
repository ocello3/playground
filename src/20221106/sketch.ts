import p5 from "p5";
import { controller } from "../util/controller";
import { drawFrame } from "../util/drawFrame";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as Params from "./params";
import * as Synth from "./sound/synth";
import * as SynthData from "./sound/synthData";
import * as Seq from "./sound/sequence";
import * as BufferSketch from "./component/bufferSketch";

export const sketch = (s: p5) => {
  const size = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set(size);
  let seq: Seq.type;
  let bufferSketch: BufferSketch.type;
  let synth: Synth.type;
  let synthData: SynthData.type;
  s.setup = async () => {
    synth = await Synth.set();
    synthData = SynthData.get(synth);
    seq = Seq.get(synthData, params, s.millis());
    bufferSketch = BufferSketch.get(seq, params, size, synthData);
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
    seq = Seq.get(synthData, params, s.millis(), seq);
    bufferSketch = BufferSketch.get(seq, params, size, synthData, bufferSketch);
    BufferSketch.draw(bufferSketch, seq, params, s);
    drawFrame(s, size);
    Synth.play(synth, seq, bufferSketch, params, s.frameCount);
  };
};
