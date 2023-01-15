import p5 from "p5";
import { controller } from "../util/controller";
import { tools } from "../util/tools";
// import { debug } from "../util/debug";
import * as Params from "./params";
import * as Light from "./component/light";
import * as Boader from "./component/boader";
import * as Object from "./component/object";
import * as Shadow from "./component/shadow";
import * as SketchData from "./sound/sketchData";
import * as Synth from "./sound/synth";
import { draw } from "./draw";

export const sketch = (s: p5) => {
  const canvasSize = tools.setSize("sketch");
  let controllers = controller.setController();
  const params = Params.set();
  let light: Light.type;
  let boader: Boader.type;
  let object: Object.type;
  let shadow: Shadow.type;
  let sketchData: SketchData.type;
  let synth: Synth.type;
  s.setup = async () => {
    // set sound
    synth = await Synth.set(params);
    // set component
    boader = Boader.get(params, canvasSize);
    light = Light.get(boader, params, canvasSize);
    object = Object.get(boader, params, canvasSize);
    shadow = Shadow.get(light, boader, object);
    // set canvas
    s.createCanvas(canvasSize, canvasSize);
    const tab = controller.setGui(s, controllers, synth.se, false);
    Params.gui(params, tab);
    // s.frameRate(10);
    s.noLoop();
  };
  s.draw = () => {
    if (synth === undefined) {
      s.noLoop();
      return;
    }
    controller.updateController(s, controllers);
    // update component
    boader = Boader.get(params, canvasSize, boader);
    light = Light.get(boader, params, canvasSize, light);
    object = Object.get(boader, params, canvasSize, object);
    shadow = Shadow.get(light, boader, object);
    // draw component
    draw(light, boader, object, shadow, params, canvasSize, s);
    // sound
    sketchData = SketchData.get(light, object, shadow, params, canvasSize);
    Synth.play(synth, sketchData, params);
    // if (s.frameCount % 5 === 0)
    //   debug(
    //     {
    //       isShadow: light.isShadow,
    //       lightAngle: light.angle,
    //       boaderAngle: boader.angle,
    //     },
    //     10
    //   );
  };
};
