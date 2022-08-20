import { eP5 } from "../type/eP5";
import * as Tone from "tone";
import { Pane, TabApi } from "tweakpane";

const controllers = {
  isPlay: false,
  scrLk: true,
  frameRate: 0,
  frameCount: 0,
  mute: true,
};
type controllerType = typeof controllers;

const setController = () => controllers;

const updateController = (s: eP5, controllers: controllerType) => {
  controllers.frameRate = s.frameRate();
  controllers.frameCount += 1;
};

const activate = (
  s: eP5,
  controllers: controllerType,
  audio: boolean,
  seq: boolean
) => {
  if (audio === true) Tone.Destination.mute = controllers.mute;
  if (seq === true) Tone.Transport.start();
  controllers.isPlay = true;
  s.loop();
};
const inactivate = (s: eP5, controllers: controllerType, seq: boolean) => {
  if (seq === true) Tone.Transport.stop();
  controllers.isPlay = false;
  s.noLoop();
};
const reactivate = (s: eP5, controllers: controllerType, seq: boolean) => {
  if (seq === true) Tone.Transport.start();
  controllers.isPlay = true;
  s.loop();
};

const ban_scroll = () => {
  document.addEventListener("wheel", notscroll, { passive: false }); // pc
  document.addEventListener("touchmove", notscroll, { passive: false }); // touch
  document.addEventListener("dblclick", notscroll, { passive: false }); // expand
};
const go_scroll = () => {
  document.removeEventListener("wheel", notscroll, { capture: false }); // pc
  document.removeEventListener("touchmove", notscroll, { capture: false }); // touch
  document.removeEventListener("dblclick", notscroll, { capture: false }); // expand
};
const notscroll = (e: Event) => {
  e.preventDefault();
};

const startAudio = () => {
  const initAudioContext = () => {
    document.removeEventListener("touchstart", initAudioContext);
    Tone.start();
  };
  document.addEventListener("touchstart", initAudioContext);
};

const setGui = (
  s: eP5,
  controllers: controllerType,
  audio = false,
  seq = false
): TabApi => {
  const pane = new Pane({
    container: <HTMLInputElement>document.getElementById("pane"),
  });
  const tab = pane.addTab({
    pages: [{ title: "default" }, { title: "sketch" }, { title: "sound" }],
  });
  tab.pages[0].addButton({ title: "on/off", label: "play" }).on("click", () => {
    const isInit = !s.isLooping() && !controllers.isPlay;
    const isPlay = s.isLooping();
    const isPause = !s.isLooping() && controllers.isPlay;
    if (isInit) activate(s, controllers, audio, seq);
    if (isPlay) inactivate(s, controllers, seq);
    if (isPause) reactivate(s, controllers, seq);
  });
  tab.pages[0].addMonitor(controllers, "isPlay");
  tab.pages[0].addMonitor(controllers, "frameRate", { interval: 500 });
  ban_scroll();
  tab.pages[0].addInput(controllers, "scrLk").on("change", (event) => {
    if (event.value === true) {
      ban_scroll();
    }
    if (event.value === false) go_scroll();
  });
  if (audio === true) {
    startAudio();
    tab.pages[0].addInput(controllers, "mute").on("change", (event) => {
      Tone.Destination.mute = event.value;
    });
  }
  return tab;
};

export const controller = { setController, updateController, setGui };
