import p5 from "p5";
import { controller } from "../util/controller";
import { tools } from "../util/tools";
import { debug } from "../util/debug";
import * as InnerFrame from "./component/innerFrame";
import * as Seq from "./component/seq";
import * as Env from "./component/env";
import * as Progress from "./component/progress";
import * as ProgressLine from "./component/progressLine";
import * as Params from "./params";
import * as Synth from "./sound/synth";
import { draw } from "./draw";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let innerFrame: InnerFrame.type;
  let seq: Seq.type;
  let env: Env.type;
  let progress: Progress.type;
  let progressLine: ProgressLine.type;
  let synth: Synth.type;
  s.setup = async () => {
    // set component
    innerFrame = InnerFrame.get(params, canvasSize);
    seq = Seq.get(params);
    env = Env.get(innerFrame, seq, params);
    progress = Progress.get(seq, controllers, params);
    // set sound
    synth = await Synth.set(seq, params);
    // set canvas
    s.createCanvas(canvasSize, canvasSize);
    const tab = controller.setGui(s, controllers, synth.se, true);
    Params.gui(params, tab);
    s.noLoop();
    // s.frameRate(20);
  };
  s.draw = () => {
    if (synth === undefined) {
      s.noLoop();
      return;
    }
    if (s.frameCount % 5 === 0)
      debug(
        {
          meter: synth.meter.getValue(),
        },
        10
      );
    s.background(255);
    controller.updateController(s, controllers);
    // update component
    seq = Seq.get(params);
    env = Env.get(innerFrame, seq, params, env);
    progress = Progress.get(seq, controllers, params, progress);
    progressLine = ProgressLine.get(
      innerFrame,
      progress,
      params,
      synth.meter,
      progressLine
    );
    // draw component
    draw(innerFrame, env, progressLine, canvasSize, s);
    // synth.playSynth(libData, synthData, synthParams, size);
  };
};
