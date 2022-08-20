import "./style.css";
import p5 from "p5";
import { sketch } from "./20220622/sketch";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="row">
		<div class="one-half column" id="sketch"></div>
		<div class="one-third column" id="pane"></div>
  </div>
`;
new p5(sketch, document.getElementById("sketch")!);

/*
import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
*/
