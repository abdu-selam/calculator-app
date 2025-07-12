import {
  calculator as calc,
  round
} from './calculationLogic.js';


// constant number extractor
export const constants = (number)=> {
  switch (number) {
    case 'π':
      number = Math.PI.toString().slice(0, 6);
      break;
    case 'e':
      number = Math.E.toString().slice(0, 6);
      break;
  }
  return number;
}


// button translator for complicated buttons
export const btnCompiler = (oprtr) => {
  const charSet = ['log',
    'ln',
    'sin',
    'cos',
    'tan',
    'cot',
    'csc',
    'sec'];
  if (charSet.includes(oprtr))
    oprtr += '(';
  return oprtr;
}


// text formatter to write for operators input
export const textToWrite = (oprtr, lastChar, value) => {
  if (lastChar == '.')
    value += "0"+oprtr;
  else if (oprtrChecker(oprtr, lastChar))
    value += oprtr;
  return value;
}

// condition generator for operators input
const oprtrChecker = (oprtr, lastChar) => {
  const unAbled = ['+',
    '×',
    '÷',
    '^',
  ];
  const enAbbled = ['-',
    '√',
    'sin(',
    'cos(',
    'tan(',
    'log(',
    'ln(',
    'sec(',
    'csc(',
    'cot('
  ]

  let valueOne = [...unAbled,
    '-',
    '√'].includes(lastChar) || lastChar === '(';
  let valueTwo = !(valueOne && [...unAbled, '-', '!'].includes(oprtr));
  let valueThree = !lastChar.length && enAbbled.includes(oprtr);
  let valueFour = ['!',
    '×',
    '÷',
    '√'].includes(lastChar) && oprtr === '-';
  return (valueTwo && lastChar.length) || valueThree || valueFour;
}


// human readable scientific notation
const scieNote = (num) => {
  let temp = num.toString().split('e+');
  if (temp.length === 2) {
    const [number,
      exp] = temp;
    return `${round(Number(number), 5)}×10^${exp}`;
  }
  return num;
}


// calculator function
export const calculator = (content, unit, elements = [])=> {
  let value = ""
  try {
    value = scieNote(calc(content, unit));
    return value;
  } catch(err) {
    value = "Error";
    return value;
  } finally {
    if (elements && value !== undefined) {
      for (let element of elements) {
        if (!isNaN(value) || value === "Error")
          element.value = value;
      }
    }
  }
}