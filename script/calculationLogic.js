import {
  inputFormatter
} from './formatter.js';


// separator function to separate numbers and signs from the given string
const separator = (text)=> {
  const operators = ['+',
    '-',
    '×',
    '÷',
    '(',
    ')',
    '^',
    'L',
    'l',
    'n',
    '√',
    's',
    'c',
    't',
    '!',
    'S',
    'C',
    'T'];
  const unarOprtrs = [')',
    'L',
    'n',
    '√',
    's',
    'c',
    't',
    '!',
    'S',
    'C',
    'T'];
  const result = [];
  let waiter = '';
  let i = 0;
  for (let char of text) {
    i++;
    if (operators.includes(char) || i === text.length) {
      if (i === text.length && !operators.includes(char)) {
        if (char === '.') char = '.0';
        waiter += char;
      }
      if (waiter !== '')
        result.push(Number(waiter));
      if (i < text.length || unarOprtrs.includes(char))
        result.push(char);
      waiter = '';
    } else waiter += char;
  }
  return result;
}


// RPN generator from given infix notation
const postfixer = (infix)=> {
  const presedence = new Map([['+', 1], ['-', 1], ['×', 2], ['÷', 2], ['^', 3], ['(', 0], ['√', 4], ['s', 4], ['c', 4], ['t', 4], ['!', 4], ['S', 4], ['C', 4], ['T', 4], ['l', 4], ['L', 4], ['n', 4]]);
  const [output,
    stack,
    brackets] = [[],
    [],
    []];
  let i = 0;

  for (const elem of infix) {
    i++;
    if (typeof(elem) === 'number')
      output.push(elem);
    else {
      let j = stack.length - 1;
      if (stack.length === 0 || presedence.get(stack[j]) < presedence.get(elem) ||
        elem === '(') {
        stack.push(elem);
        if (elem === '(') {
          brackets.unshift(j+1);
        }
      } else if (elem === ')') {
        let index = brackets.shift();
        const bracketStack = stack.slice(index+1, j+1);
        stack.splice(index, j+1);
        bracketStack.reverse().forEach((each)=> {
          output.push(each);
        })
      } else {
        const oprtr = stack.pop();
        output.push(oprtr);
        stack.push(elem);
      }
    }

    if (i === infix.length) {
      stack.reverse().forEach((each)=> {
        output.push(each);
      })
    }
  }
  return output;
}


// calculator of two numbers
const binaryOprtration = (num1, num2, oprtr)=> {
  if (oprtr === '+')
    return num1 + num2;
  else if (oprtr === '-')
    return num1 - num2;
  else if (oprtr === '×')
    return num1 * num2;
  else if (oprtr === '÷') {
    if (num2 === 0)
      throw Error("Zero division error");
    return num1 / num2;
  } else if (oprtr === '^')
    return Math.pow(num1, num2);
  else if (oprtr === 'l')
    return Math.log(num1)/Math.log(num2);
}

// Unary operators
const unaryOprtration = (num, oprtr, unit)=> {
  switch (oprtr) {
    case "√":
      return Math.sqrt(num);
    case "!":
      return factorialFunc(num);
    case "L":
      return Math.log(num)/Math.log(10);
    case "n":
      return Math.log(num)/Math.log(Math.E);
    case "s":
      if (unit == 'DEG')
        return round(Math.sin(toRad(num)), 4);
      return round(Math.sin(num), 4);
    case "c":
      if (unit === 'DEG')
        return round(Math.cos(toRad(num)), 4);
      return round(Math.cos(num), 4);
    case "t":
      return unaryOprtration(num, 's', unit)/unaryOprtration(num, 'c', unit);
    case "S":
      if (unit === 'DEG')
        return 1 / round(Math.sin(toRad(num)), 4);
      return 1 / round(Math.sin(num), 4);
    case "C":
      if (unit === 'DEG')
        return 1 / round(Math.cos(toRad(num)), 4);
      return 1 / round(Math.cos(num), 4);
    case "T":
      return unaryOprtration(num, 'c', unit)/unaryOprtration(num, 's', unit);
  }
}

const toRad = deg => deg * (Math.PI / 180);
export const round = (number, decimals) => {
  if (isNaN(number) || isNaN(decimals)) return NaN;
  if (!Number.isFinite(number)) return number;

  const multiplier = Math.pow(10, decimals);
  return Math.round(number * multiplier) / multiplier;
}


// factorial calculator
const factorialFunc = (num)=> {
  if (num.toString().includes('.'))
    throw Error('Only integers are valid in factorial');
  let sign = num < 0? -1: 1;
  let result = 1;
  for (let i = 2; i <= Math.abs(num); i++) {
    result *= i;
  }
  return result * sign;
}


// calculator for RPN expressions
const postfixCalculator = (list, unit) => {
  const stack = [];
  const binOprtrs = ['+',
    '-',
    '×',
    '÷',
    '^',
    'l']
  const unarOprtrs = ['L',
    'n',
    '√',
    's',
    'c',
    't',
    '!',
    'S',
    'C',
    'T']
  for (const elem of list) {
    if (typeof elem === 'number') stack.push(elem);
    else {
      if (binOprtrs.includes(elem)) {
        const num2 = stack.pop();
        const num1 = stack.pop();
        stack.push(binaryOprtration(num1, num2, elem));
      } else {
        const num1 = stack.pop();
        stack.push(unaryOprtration(num1, elem, unit));
      }
    }
  }
  return stack[0];
};

// caller function for real time calculation
export const calculator = (text, unit)=> {
  const formattedText = inputFormatter(text);

  const separatedArray = separator(formattedText);
  const postfixNotation = postfixer(separatedArray);

  const value = postfixCalculator(postfixNotation, unit);

  if (isNaN(value) || value === undefined || value == Infinity || value == -Infinity)
    throw Error("Undefined number");

  return value;
}