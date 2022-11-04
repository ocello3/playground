import p5 from "p5";
import { Pane, TabApi } from "tweakpane";
import * as Tone from "tone";

const controllers = {
  isInit: true,
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

const activate = async (
  s: p5,
  controllers: controllerType,
  se: Tone.Sampler,
  seq: boolean
) => {
  await Tone.start();
  se.triggerAttackRelease("A1", 0.1);
  setTimeout(() => {
    Tone.Destination.mute = controllers.mute;
    if (seq === true) Tone.Transport.start();
    controllers.isPlay = true;
    controllers.isInit = false;
    s.loop();
  }, 100);
};
const inactivate = (
  s: p5,
  controllers: controllerType,
  se: Tone.Sampler,
  seq: boolean
) => {
  se.triggerAttackRelease("A2", 0.1);
  setTimeout(() => {
    if (seq === true) Tone.Transport.stop();
    Tone.Destination.mute = true;
    controllers.isPlay = false;
    s.noLoop();
  }, 100);
};
const reactivate = (
  s: p5,
  controllers: controllerType,
  se: Tone.Sampler,
  seq: boolean
) => {
  if (seq === true) Tone.Transport.start();
  Tone.Destination.mute = controllers.mute;
  s.loop();
  se.triggerAttackRelease("A1", 0.1);
  controllers.isPlay = true;
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
  se: Tone.Sampler,
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
      const isInit = controllers.isInit;
      const isPlay = s.isLooping();
      const isPause =
        !controllers.isInit && !s.isLooping() && !controllers.isPlay;
      if (isInit) {
        console.log(
          `activate, isLooping: ${s.isLooping()}, isPlay: ${controllers.isPlay}`
        );
        activate(s, controllers, se, seq);
      }
      if (isPlay) {
        console.log(
          `inactivate, isLooping: ${s.isLooping()}, isPlay: ${
            controllers.isPlay
          }`
        );
        inactivate(s, controllers, se, seq);
      }
      if (isPause) {
        console.log(
          `reactivate, isLooping: ${s.isLooping()}, isPlay: ${
            controllers.isPlay
          }`
        );
        reactivate(s, controllers, se, seq);
      }
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
  tab.pages[0].addInput(controllers, "mute").on("change", (event) => {
    if (s.isLooping()) Tone.Destination.mute = event.value;
  });
  return tab;
};

export const controller = { setController, updateController, setGui };
