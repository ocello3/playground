import p5 from "p5";

type dataType = { [prop: string]: string | number | boolean | object };
type deepDataType = { [prop: string]: dataType };
type objectType =
  | deepDataType
  | { [prop: string]: deepDataType[] }
  | dataType
  | { [prop: string]: dataType[] };
type arrayType = dataType[] | deepDataType[] | objectType[];

const divideArrayToString = (
  arg: arrayType,
  length: number | null,
  start: number,
  logList: string[]
) => {
  const limitedStart = start < arg.length ? start : arg.length - 1;
  const calcLimitedLength = () => {
    if (length === null) return arg.length;
    const lastId = limitedStart + length;
    const isOver = lastId > arg.length;
    return isOver ? arg.length - limitedStart : length;
  };
  const limitedLength = calcLimitedLength();
  const limitedObjArray = arg.slice(limitedStart, limitedStart + limitedLength);
  limitedObjArray.forEach((innerObj, index) => {
    logList.push(`- index ${index + limitedStart}<br>`);
    if (innerObj instanceof p5.Vector) {
      addDataToStringArray(" - ", innerObj, logList);
    } else {
      divideObjectToString(innerObj, length, start, logList);
    }
  });
  return logList;
};

const divideObjectToString = (
  arg: objectType,
  length: number | null,
  start: number,
  logList: string[]
) => {
  for (const key in arg) {
    if (Array.isArray(arg[key])) {
      logList.push(`-- ${key}:<br>`);
      divideArrayToString(arg[key] as arrayType, length, start, logList);
    } else if (
      typeof arg[key] === "string" ||
      typeof arg[key] === "number" ||
      typeof arg[key] === "boolean" ||
      arg[key] instanceof p5.Vector
    ) {
      addDataToStringArray(key, arg[key] as dataType, logList);
    } else if (
      typeof arg[key] === "object" &&
      !(arg[key] instanceof p5.Vector)
    ) {
      divideObjectToString(arg[key] as objectType, length, start, logList);
    }
  }
  return logList;
};

const addDataToStringArray = (
  key: string,
  data: dataType,
  logList: string[]
) => {
  logList.push(`${key}: ${data}<br>`);
};

export const debug = (
  arg: dataType | objectType | arrayType,
  displayArrayLength: null | number = null,
  startPosition: number = 0
) => {
  // header
  const title = "// debug result<br>";
  // data
  const logList: string[] = [];
  if (Array.isArray(arg)) {
    divideArrayToString(arg, displayArrayLength, startPosition, logList);
  } else {
    divideObjectToString(arg, displayArrayLength, startPosition, logList);
  }
  document.getElementById("debug")!.innerHTML = title.concat(...logList);
};
