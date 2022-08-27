import p5 from "p5";
import { Pane, TabApi } from "tweakpane";
import * as Tone from "tone";

const controllers = {
  isPlay: false,
  scrLk: true,
  frameRate: 0,
  frameCount: 0,
  mute: true,
};
type controllerType = typeof controllers;

const setController = () => controllers;

const updateController = (s: p5, controllers: controllerType) => {
  controllers.frameRate = s.frameRate();
  controllers.frameCount += 1;
};

const activate = (
  s: p5,
  controllers: controllerType,
  audio: boolean,
  seq: boolean
) => {
  if (audio === true) Tone.Destination.mute = controllers.mute;
  if (seq === true) Tone.Transport.start();
  controllers.isPlay = true;
  s.loop();
};
const inactivate = (s: p5, controllers: controllerType, seq: boolean) => {
  if (seq === true) Tone.Transport.stop();
  controllers.isPlay = false;
  s.noLoop();
};
const reactivate = (s: p5, controllers: controllerType, seq: boolean) => {
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

const setGui = (
  s: p5,
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
  tab.pages[0]
    .addButton({ title: "on/off", label: "play" })
    .on("click", async () => {
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
    tab.pages[0].addInput(controllers, "mute").on("change", (event) => {
      Tone.Destination.mute = event.value;
    });
  }
  return tab;
};

export const controller = { setController, updateController, setGui };
