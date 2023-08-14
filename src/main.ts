import "./style.css";
import p5 from "p5";
import latest from "./latest.txt";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="row">
		<div class="one-half column" id="sketch"></div>
		<div class="one-half column" id="pane"></div>
  </div>
	<div class = "row" id="indicator"></div>
	<div class = "row" id="debug"></div>
`;

const getLatestDate = async (): Promise<string> => {
  const response = await fetch(latest);
  const rawText = await response.text();
  return rawText.replace(/(\r\n|\n|\r)/gm, ""); // remove line feed code
};

(async () => {
  const latestDate = await getLatestDate();
  const paramsString = location.search;
  const searchParams = new URLSearchParams(paramsString);
  const hasDate = searchParams.has("date");
  console.log(paramsString);
  const date = hasDate ? searchParams.get("date") : latestDate;
  // await import(/* @vite-ignore */ `./${date}/sketch.ts`).then((res) => {
  //   new p5(res.sketch, document.getElementById("sketch")!);
  // });
  await import(`./${date}/sketch.ts`).then((res) => {
    new p5(res.sketch, document.getElementById("sketch")!);
  });
})();

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
