import { compareInAndOut } from "./main";
import * as fs from "fs";

interface IQuestionExample {
  input: string;
  output: string;
  result: boolean;
}

const rawTest1 = fs.readFileSync("./test/test2.json", "utf-8");
const listQuestion: IQuestionExample[] = JSON.parse(rawTest1);

const listCasePass: IQuestionExample[] = [];
const listCaseFailed: IQuestionExample[] = [];
// create test

listQuestion.forEach((e) => {
  compareInAndOut(e.input, e.output) != e.result
    ? listCaseFailed.push(e)
    : listCasePass.push(e);
});

console.log("ListCaseFailed", listCaseFailed);
console.log("ListCasePass:", listCasePass);
