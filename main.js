var AgeNotation;
(function (AgeNotation) {
    AgeNotation[AgeNotation["LESS_THAN"] = -1] = "LESS_THAN";
    AgeNotation[AgeNotation["GREATER_THAN"] = 1] = "GREATER_THAN";
    AgeNotation[AgeNotation["EQUAL"] = 0] = "EQUAL";
})(AgeNotation || (AgeNotation = {}));
var AgeUnit;
(function (AgeUnit) {
    AgeUnit["MONTH"] = "month";
    AgeUnit["YEAR"] = "year";
})(AgeUnit || (AgeUnit = {}));
function getAge(input) {
    // get notation from input
    var age = getAgeNumber(input);
    if (age) {
        var notation = getAgeNotation(input, age);
        var unitString = getAgeUnit(input, age);
        // console.log("Notation", notation);
        var result = {
            age: convertAgeUnit(age, unitString),
            ageNotation: notation,
        };
        return result;
    }
    return null;
}
// return unit string
function getAgeUnit(input, ageNumber) {
    // console.log(input, "age+ ", ageNumber);
    // first get age number
    // const ageNumber: number | null = getAgeNumber(input);
    if (!ageNumber)
        return AgeUnit.YEAR;
    // read from json ( merged from all keyword )
    var keyWordUnit = ["tuổi", "tháng"];
    var listKeywordUnit = input.split(" ");
    var listUnitShorted = listKeywordUnit.filter(function (value, _) {
        return keyWordUnit.includes(value.toLocaleLowerCase());
    });
    if (listUnitShorted.length == 0) {
        // return default value
        return AgeUnit.YEAR;
    }
    else if (listUnitShorted.length == 1) {
        // has only once value so return first item
        // parse and return
        return filterToUnit(listUnitShorted[0]);
    }
    // if have many keywords unit so will choose near index of age
    var ageIndex = listKeywordUnit.findIndex(function (value, _) { return value == ageNumber.toString(); });
    // find near item with ageIndex
    var nearIndex = ageIndex;
    // console.log("listUnitShorted",listUnitShorted)
    for (var i = ageIndex; i < listKeywordUnit.length; i++) {
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
function filterToUnit(key) {
    // read in json file
    // example json
    var monthKey = ["tháng"];
    // const yearKey: string[] = ["tuổi","năm"];
    if (monthKey.includes(key)) {
        return AgeUnit.MONTH;
    }
    return AgeUnit.YEAR;
}
// convert month or more unit to year
function convertAgeUnit(age, unitString) {
    if (unitString == AgeUnit.YEAR) {
        return age;
    }
    return Math.abs(age / 12);
}
function getAgeNumber(input) {
    try {
        var match = input.match(/\b\d+\b/);
        if (match) {
            // console.log("Response", match[0]);
            return parseInt(match[0]);
        }
        return null;
    }
    catch (err) {
        return null;
    }
}
function getAgeNotation(input, ageNumber) {
    // const ageNumber: number | null = getAgeNumber(input);
    if (!ageNumber) {
        return AgeNotation.EQUAL;
    }
    // example idea is get from json config
    var listNationKeyword = ["hơn", "dưới", "<", ">"];
    var arrayNotationKeyword = input.split(" ");
    var arrayNotationSorted = arrayNotationKeyword.filter(function (value, _) {
        return listNationKeyword.includes(value);
    });
    if (!arrayNotationSorted) {
        return AgeNotation.EQUAL;
    }
    else if (arrayNotationSorted.length == 1) {
        return parseAgeNotation(arrayNotationSorted[0]);
    }
    // have multiple keyword will get near keyword
    var ageIndex = arrayNotationKeyword.findIndex(function (value, _) { return value == ageNumber.toString(); });
    var result = AgeNotation.EQUAL;
    for (var i = ageIndex; i >= 0; i--) {
        if (listNationKeyword.includes(arrayNotationKeyword[i])) {
            result = parseAgeNotation(arrayNotationKeyword[i]);
            return result;
        }
    }
    // default option
    return result;
}
function parseAgeNotation(key) {
    var listLessKeyword = ["dưới", ">"];
    var listGreatherKeyword = ["trên", "<"];
    if (listGreatherKeyword.includes(key))
        return AgeNotation.GREATER_THAN;
    if (listLessKeyword.includes(key))
        return AgeNotation.LESS_THAN;
    // default is equal
    return AgeNotation.EQUAL;
}
function getListAgeFromOutPut(knowledgeOutput) {
    // split string to array string
    var partOutput = knowledgeOutput.split(".");
    var result = [];
    var age;
    partOutput.forEach(function (e) {
        age = getAge(e);
        if (age) {
            result.push(age);
        }
    });
    result.shift();
    // console.log("getListAgeFromOutPut", result);
    return result;
}
// case input is equal
function compareEqual(age, listOutput) {
    // case all item from output is less than
    // console.log("Equal");
    var min = getMinAgeOutput(listOutput);
    // min equal
    if (age.age - min.age > 0 ||
        (age.age == min.age && min.ageNotation == AgeNotation.EQUAL)) {
        // pass or check max
        var max = getMaxAgeOutput(listOutput);
        if (max.age - age.age < 0 && max.ageNotation != AgeNotation.GREATER_THAN) {
            return false;
        }
        return true;
    }
    return false;
}
function getMinAgeOutput(listOutput) {
    listOutput.sort(function (a, b) { return a.age - b.age; });
    var min = listOutput[0];
    listOutput.forEach(function (e) {
        if (e.age == min.age && e.ageNotation < min.ageNotation) {
            min = e;
        }
    });
    return min;
}
function getMaxAgeOutput(listOutput) {
    listOutput.sort(function (a, b) { return b.age - a.age; });
    var max = listOutput[0];
    listOutput.forEach(function (e) {
        if (e.age == max.age && e.ageNotation > max.ageNotation) {
            max = e;
        }
    });
    return max;
}
function compareLessThan(inputAge, listOutput) {
    var min = getMinAgeOutput(listOutput);
    var max = getMaxAgeOutput(listOutput);
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
function compareGreather(inputAge, listAgeResponse) {
    // in range
    //  age number equal max from output
    var max = getMaxAgeOutput(listAgeResponse);
    if (inputAge.age >= max.age && max.ageNotation == AgeNotation.LESS_THAN) {
        return false;
    }
    var min = getMinAgeOutput(listAgeResponse);
    if (inputAge.age < min.age && min.ageNotation == AgeNotation.GREATER_THAN) {
        return false;
    }
    return true;
}
var input = "trẻ 8 tuổi có tiêm vacxin được không";
var output = "trẻ 8 tháng tuổi không nên tiêm vacxin. bởi vì không khuyến cáo tiêm cho trẻ dưới 9 tháng tuổi. chỉ tiêm khi có chỉ ";
function compareInAndOut(input, output) {
    var ageInput = getAge(input);
    if (!ageInput) {
        // do something
        return;
    }
    var listAgeResponse = getListAgeFromOutPut(output);
    listAgeResponse.sort(function (a, b) { return a.age - b.age; });
    // compare age notation
    var result = false;
    // happy case
    switch (ageInput.ageNotation) {
        case AgeNotation.LESS_THAN:
            result = compareLessThan(ageInput, listAgeResponse);
            break;
        case AgeNotation.GREATER_THAN:
            result = compareGreather(ageInput, listAgeResponse);
            break;
        default:
            result = compareEqual(ageInput, listAgeResponse);
        // default is equal
    }
    console.log("Result", result);
}
compareInAndOut(input, output);
