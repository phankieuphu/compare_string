import * as fs from "fs";
interface IAge {
  age: number;
  ageNotation: AgeNotation;
}

enum AgeNotation {
  LESS_THAN = -1,
  GREATER_THAN = 1,
  EQUAL = 0,
}
interface AgeNotationData {
  key: string;
  value: AgeNotation;
}

interface AgeNotations {
  notations: AgeNotationData[];
}
interface AgeUnitFile {
  key: string;
  value: AgeUnit;
}

interface AgeUnitsData {
  units: AgeUnitFile[];
}

enum AgeUnit {
  MONTH = "month",
  YEAR = "year",
  WEEK = "week",
}

function canParseNumber(str: string): boolean {
  if (typeof str !== "string") {
    return false;
  }
  const num = Number.parseInt(str);
  if (isNaN(num)) {
    return false;
  }

  const trimmedStr = str.trim();
  const numStr = String(num);
  return numStr === trimmedStr || Number(numStr) === Number(trimmedStr);
}

function getAge(input: string): IAge | null {
  // get notation from input
  const age: number | null = getAgeNumber(input);

  if (age) {
    const notation: AgeNotation = getAgeNotation(input, age);
    const unitString: AgeUnit = getAgeUnit(input, age);
    // console.log("Notation", notation);
    const result: IAge = {
      age: convertAgeUnit(age, unitString),
      ageNotation: notation,
    };
    return result;
  }

  return null;
}

// return unit string
function getAgeUnit(input: string, ageNumber: number | null): AgeUnit {
  // console.log(input, "age+ ", ageNumber);
  // first get age number
  // const ageNumber: number | null = getAgeNumber(input);
  if (!ageNumber) return AgeUnit.YEAR;
  // read from json ( merged from all keyword )
  const keyWordUnit: string[] = ["tuổi", "tháng", "tuần"];
  const listKeywordUnit = input.split(" ");

  const listUnitShorted = listKeywordUnit.filter((value, _) =>
    keyWordUnit.includes(value.toLocaleLowerCase())
  );

  if (listUnitShorted.length == 0) {
    // return default value
    return AgeUnit.YEAR;
  } else if (listUnitShorted.length == 1) {
    // has only once value so return first item
    // parse and return
    return filterToUnit(listUnitShorted[0]);
  }
  // if have many keywords unit so will choose near index of age
  const ageIndex = listKeywordUnit.findIndex(
    (value, _) => value == ageNumber.toString()
  );
  // find near item with ageIndex
  let nearIndex: number = ageIndex;
  // console.log("listUnitShorted",listUnitShorted)
  for (let i = ageIndex; i < listKeywordUnit.length; i++) {
    if (listUnitShorted.includes(listKeywordUnit[i])) {
      //   console.log("listKeyword",listKeywordUnit[i])
      nearIndex = i;
      // console.log("filterToUnit(listKeywordUnit[nearIndex]);",filterToUnit(listKeywordUnit[nearIndex]))
      return filterToUnit(listKeywordUnit[nearIndex]);
    }
  }
  //  console.log("listKeywordUnit[nearIndex]",listKeywordUnit[nearIndex])
  return filterToUnit(listKeywordUnit[nearIndex]);
}

function filterToUnit(key: string): AgeUnit {
  // read in json file
  // example json
  const monthKey: string[] = ["tháng"];
  // const yearKey: string[] = ["tuổi","năm"];
  if (monthKey.includes(key)) {
    return AgeUnit.MONTH;
  }
  return AgeUnit.YEAR;
}

// convert month or more unit to year
function convertAgeUnit(age: number, unitString: AgeUnit): number {
  if (unitString == AgeUnit.YEAR) {
    return age * 365;
  } else if (unitString == AgeUnit.WEEK) {
    return age * 7;
  }

  return age * 30;
}

function getAgeNumber(input: string): number | null {
  try {
    const match = input.match(/\b\d+\b/);
    if (match) {
      // console.log("Response", match[0]);
      return parseInt(match[0]);
    }
    return null;
  } catch (err) {
    return null;
  }
}
function getAgeNotation(input: string, ageNumber: number | null): AgeNotation {
  // const ageNumber: number | null = getAgeNumber(input);
  if (!ageNumber) {
    return AgeNotation.EQUAL;
  }
  // example idea is get from json config
  const listNationKeyword: string[] = ["hơn", "dưới", "<", ">"];
  const arrayNotationKeyword = input.split(" ");

  const arrayNotationSorted = arrayNotationKeyword.filter((value, _) =>
    listNationKeyword.includes(value)
  );

  if (!arrayNotationSorted) {
    return AgeNotation.EQUAL;
  } else if (arrayNotationSorted.length == 1) {
    return parseAgeNotation(arrayNotationSorted[0]);
  }
  // have multiple keyword will get near keyword
  const ageIndex = arrayNotationKeyword.findIndex(
    (value, _) => value == ageNumber.toString()
  );
  let result: AgeNotation = AgeNotation.EQUAL;
  for (let i = ageIndex; i >= 0; i--) {
    if (listNationKeyword.includes(arrayNotationKeyword[i])) {
      result = parseAgeNotation(arrayNotationKeyword[i]);
      return result;
    }
  }

  // default option
  return result;
}

function parseAgeNotation(key: string): AgeNotation {
  const listLessKeyword: string[] = ["dưới", ">"];
  const listGreaterKeyword: string[] = ["trên", "<"];

  if (listGreaterKeyword.includes(key)) return AgeNotation.GREATER_THAN;
  if (listLessKeyword.includes(key)) return AgeNotation.LESS_THAN;
  // default is equal
  return AgeNotation.EQUAL;
}

function checkUnit(unit: string): AgeUnit {
  const fileKey = fs.readFileSync("./key_unit.json", "utf-8");
  const listKey: AgeUnitsData = JSON.parse(fileKey);

  const foundUnit = listKey.units.find(
    (e) => e.key.toLocaleLowerCase() === unit.toLocaleLowerCase()
  );

  return foundUnit ? foundUnit.value : AgeUnit.YEAR; // Return found value or default
}

function checkNotation(notation: string): AgeNotation {
  const fileKey = fs.readFileSync("./key_notation.json", "utf-8");
  const listKey: AgeNotations = JSON.parse(fileKey);

  // Using for...of loop:
  for (const e of listKey.notations) {
    if (notation.toLowerCase() === e.key.toLowerCase()) {
      return e.value;
    }
  }

  return AgeNotation.EQUAL;
}

function getListAgeFromOutPut(knowledgeOutput: string): IAge[] {
  // split string to array string
  const partOutput: string[] = knowledgeOutput.split(" ");

  const result: IAge[] = [];
  // let age: IAge | null;
  for (let i = 0; i < partOutput.length; i++) {
    if (canParseNumber(partOutput[i])) {
      // get unit
      const unit: AgeUnit = checkUnit(partOutput[i + 1]);
      const notation = checkNotation(partOutput[i - 1]);
      const age: IAge = {
        age: convertAgeUnit(parseInt(partOutput[i]), unit),
        ageNotation: notation,
      };
      result.push(age);
      // get notation
    }
  }
  if (result.length > 1) result.shift();
  // console.log("getListAgeFromOutPut", result);
  return result;
}

// case input is equal
function compareEqual(age: IAge, listOutput: IAge[]): boolean {
  // case all item from output is less than
  // console.log("Equal");
  const min = getMinAgeOutput(listOutput);
  const max = getMaxAgeOutput(listOutput);

  if (min == max) {
    if (max.ageNotation == 0 && age.age == max.age) return true;
    // case -1;
    if (
      (max.ageNotation == -1 && max.age > age.age) ||
      (max.ageNotation == 1 && max.age <= age.age)
    ) {
      return true;
    }
    return false;
  }
  if (age.age >= min.age && age.age <= max.age) {
    return true;
  }
  // min equal
  if (
    age.age - min.age > 0 ||
    (age.age == min.age && min.ageNotation == AgeNotation.EQUAL)
  ) {
    // pass or check max
    const max = getMaxAgeOutput(listOutput);
    if (max.age - age.age > 0 && max.ageNotation != AgeNotation.GREATER_THAN) {
      return false;
    }
    return true;
  }
  return false;
}

function getMinAgeOutput(listOutput: IAge[]): IAge {
  listOutput.sort((a: IAge, b: IAge) => a.age - b.age);
  let min: IAge = listOutput[0];
  listOutput.forEach((e: IAge) => {
    if (e.age == min.age && e.ageNotation < min.ageNotation) {
      min = e;
    }
  });

  return min;
}

function getMaxAgeOutput(listOutput: IAge[]): IAge {
  listOutput.sort((a: IAge, b: IAge) => b.age - a.age);
  let max: IAge = listOutput[0];
  listOutput.forEach((e: IAge) => {
    if (e.age == max.age && e.ageNotation > max.ageNotation) {
      max = e;
    }
  });
  return max;
}

function compareLessThan(inputAge: IAge, listOutput: IAge[]): boolean {
  const min = getMinAgeOutput(listOutput);
  const max = getMaxAgeOutput(listOutput);
  if (inputAge.age <= min.age && min.age != AgeNotation.LESS_THAN) {
    // may
    return false;
  }
  if (inputAge.age <= max.age) {
    return true;
  }
  return false;

  // less than age input and age input just equal min value;
  // less than age input  but age input is in range from min to max
  // equal max
}

function compareGreater(inputAge: IAge, listAgeResponse: IAge[]): boolean {
  // in range
  //  age number equal max from output
  const max = getMaxAgeOutput(listAgeResponse);
  if (inputAge.age >= max.age && max.ageNotation == AgeNotation.LESS_THAN) {
    return false;
  }
  const min = getMinAgeOutput(listAgeResponse);
  if (inputAge.age < min.age && min.ageNotation == AgeNotation.GREATER_THAN) {
    return false;
  }
  return true;
}

export function compareInAndOut(input: string, output: string): boolean {
  const ageInput: IAge | null = getAge(input);
  if (!ageInput) {
    // do something
    return true;
  }
  console.log("Age Input", ageInput);
  const listAgeResponse: IAge[] = getListAgeFromOutPut(output);
  listAgeResponse.sort((a, b) => a.age - b.age);
  console.log("ListAgeResponse", listAgeResponse);
  // compare age notation
  let result: boolean = false;
  // happy case
  switch (ageInput.ageNotation) {
    case AgeNotation.LESS_THAN:
      result = compareLessThan(ageInput, listAgeResponse);
      break;
    case AgeNotation.GREATER_THAN:
      result = compareGreater(ageInput, listAgeResponse);

      break;
    default:
      result = compareEqual(ageInput, listAgeResponse);
    // default is equal
  }
  console.log("Result", result);
  return result;
}

// test
const input = "Trẻ 9 tuổi có tiêm vắc-xin bại liệt được không?";
const output =
  "Trẻ 9 tuổi có thể tiêm vắc-xin bại liệt. Vắc-xin này được khuyến nghị cho trẻ em và người lớn.";
compareInAndOut(input, output);
