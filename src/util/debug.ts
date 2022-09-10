interface objType {
  [prop: string]: any;
}

const getArrayObjLogList = (
  obj: objType,
  name: string | null = null,
  length: number | null,
  start: number
) => {
  const logList: string[] = [];
  const arrayObj = name === null ? obj : obj[name];
  const limitedStart = start < arrayObj.length ? start : arrayObj.length - 1;
  const calcLimitedLength = () => {
    if (length === null) return arrayObj.length;
    const lastId = limitedStart + length;
    const isOver = lastId > arrayObj.length;
    return isOver ? arrayObj.length - limitedStart : length;
  };
  const limitedLength = calcLimitedLength();
  const limitedObjArray = arrayObj.slice(
    limitedStart,
    limitedStart + limitedLength
  );
  limitedObjArray.forEach((innerObj: objType, index: number) => {
    const innerObjLog = `- index: ${index + limitedStart} -<br>`;
    const innerObjLogList = getObjLogList(innerObj, length, start);
    logList.push(innerObjLog.concat(...innerObjLogList));
  });
  return logList;
};

const getObjLogList = (obj: objType, length: number | null, start: number) => {
  const logList = [];
  for (const name in obj) {
    if (Array.isArray(obj[name])) {
      logList.push(`** ${name}: **<br>`);
      const arrayObjLogList = getArrayObjLogList(obj, name, length, start);
      logList.push(...arrayObjLogList);
    } else {
      logList.push(`${name}: ${obj[name]}<br>`);
    }
  }
  return logList;
};

const getLogList = (obj: objType, length: number | null, start: number) => {
  const logList = [];
  if (Array.isArray(obj)) {
    const arrayObjLogList = getArrayObjLogList(obj, null, length, start);
    logList.push(...arrayObjLogList);
    // console.log('array');
  } else {
    const objLogList = getObjLogList(obj, length, start);
    logList.push(...objLogList);
  }
  return logList;
};

export const debug = (obj: objType, length = null, start = 0) => {
  const title = "// debug result<br>";
  const logList = getLogList(obj, length, start);
  document.getElementById("debug")!.innerHTML = title.concat(...logList);
};
