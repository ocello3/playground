import p5 from "p5";

type individualDataType = {
  [prop: string]: string | number | boolean | object;
};
type dataType = individualDataType | individualDataType[];
type deepDataType = { [prop: string]: dataType };
type objectType =
  | deepDataType
  | { [prop: string]: deepDataType[] }
  | { [prop: string]: dataType[] };
type arrayType = dataType[] | deepDataType[] | objectType[];

const isIndividualData = (arg: dataType | objectType | arrayType) =>
  typeof arg === "string" ||
  typeof arg === "number" ||
  typeof arg === "boolean" ||
  arg instanceof p5.Vector;

const isNeedToDivideObject = (arg: dataType | objectType | arrayType) =>
  typeof arg === "object" && !(arg instanceof p5.Vector);

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
  if (isIndividualData(limitedObjArray[0])) {
    addDataToStringArray(" - ", limitedObjArray as dataType, logList);
  } else {
    limitedObjArray.forEach((innerObj, index) => {
      logList.push(`- index ${index + limitedStart}<br>`);
      if (innerObj instanceof p5.Vector) {
        addDataToStringArray(" - ", innerObj, logList);
      } else {
        divideObjectToString(innerObj as objectType, length, start, logList);
      }
    });
  }
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
    } else if (isIndividualData(arg[key])) {
      addDataToStringArray(key, arg[key] as dataType, logList);
    } else if (isNeedToDivideObject(arg[key])) {
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
  if (Array.isArray(data)) {
    if (data[0] instanceof p5.Vector) {
      logList.push(`[`);
      data.forEach((element, index) => {
        if (index === data.length - 1) {
          logList.push(`${element}`);
        } else {
          logList.push(`${element},<br>`);
        }
      });
      logList.push(`]<br>`);
    } else {
      logList.push(`[`);
      data.forEach((element, index) => {
        if (index === data.length - 1) {
          logList.push(`${element}`);
        } else {
          logList.push(`${element}, `);
        }
      });
      logList.push(`]<br>`);
    }
  } else {
    // if NOT array
    logList.push(`${key}: ${data}<br>`);
  }
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
  } else if (isIndividualData(arg)) {
    addDataToStringArray(" - ", arg, logList);
  } else {
    divideObjectToString(
      arg as objectType,
      displayArrayLength,
      startPosition,
      logList
    );
  }
  document.getElementById("debug")!.innerHTML = title.concat(...logList);
};
