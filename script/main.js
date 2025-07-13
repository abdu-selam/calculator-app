import {
  constants,
  btnCompiler,
  textToWrite,
  calculator
} from './utils.js';
import {
  braceTwins
} from './formatter.js';

// elements
const mainScreen = document.querySelector('.screen__main'); // screen that show clicked numbers
const resultScreen = document.querySelector('.screen__result'); // screen that shows calculation result

// array of buttons
const OprtrBtn = [...document.querySelectorAll('.optr')]; // array of operators element
const operators = OprtrBtn.map((btn)=>btn.innerText);

const dagRadScreen = document.querySelector('.screen__deg-rag');

const numbers = [...document.querySelectorAll('.num')]; // array of number elements

let content = mainScreen.value;
let result = "";
let unit = dagRadScreen.innerText;

// Writer on screen
document.querySelector('.btns__nums').addEventListener('click', (e)=> {
  const target = e.target;

  if (!target.matches('.btn'))
    return;
  let lastChar = content.slice(-1);

  if (numbers.includes(target)) {
    let value = constants(target.innerText);
    if ((!isNaN(lastChar) && lastChar !== '' && ['π', 'e'].includes(target.innerText)) || lastChar === '!')
      value = "×" + constants(target.innerText);
    else if (lastChar === '.' && ['π', 'e'].includes(target.innerText))
      value = '0' + '×' + constants(target.innerText);

    content += value;
    result = calculator(content, unit, [resultScreen]);

  } else if (OprtrBtn.includes(target)) {
    let oprtr = btnCompiler(target.innerText);
    content = textToWrite(oprtr, lastChar, content);
    if (target.innerText === '!')
      result = calculator(content, unit, [resultScreen]);
    resultScreen.value = result;
  }

  mainScreen.value = content;
  if (result === "Error") {
    mainScreen.value = result;
    content = "";
    result = "";
  }
  if (mainScreen.value.length === 0)
    resultScreen.value = "";
  // prevent the text from sticking on the left corner
  mainScreen.scrollLeft = mainScreen.scrollWidth;
})


// handling dot
document.querySelector('.dot').addEventListener("click", (e)=> {
  const dot = e.targer;
  if ([...operators, '(', ')'].includes(content.slice(-1)))
    return;

  let parts = content.split(/[\+\-\÷\×\√\^]/);
  if (content.length === 0)
    content = '0.';
  else if (!parts[parts.length-1].includes('.'))
    content += '.';
  mainScreen.value = content;
})


// equal sign handler
document.querySelector('.equal').addEventListener('click', (e)=> {
  const target = e.target;
  content = calculator(content, unit).toString();
  if (content === "Error")
    content = "";
  mainScreen.value = content;
  resultScreen.value = content;
})


// handling clear button and back button
document.querySelector('.right').addEventListener("click",
  (e)=> {
    const target = e.target;
    let lastIndex = content.length - 1;

    // writing on screen brackets
    if (operators.includes(content[lastIndex]) || content[lastIndex] === '(')
      return;
    else if (content[lastIndex] === '.')
      content += `0${target.innerText}`;
    else if (content.length !== 0)
      content += target.innerText;
    mainScreen.value = content;
  })


document.querySelector('.left').addEventListener("click",
  (e)=> {
    const target = e.target;
    let lastIndex = content.length - 1;

    if (content[lastIndex] === ".")
      content += `0${target.innerText}`;
    else
      content += target.innerText;

    mainScreen.value = content;
  })


document.querySelector('.comma').addEventListener("click", (e)=> {
  const target = e.target;
  if (!content.includes('log'))
    return;
  let log = content.lastIndexOf('log');
  let twinBrace = braceTwins(content, log+3);
  if (content.length-1 > log+3 && twinBrace === undefined) {
    if (content.slice(log+3).includes(','))
      return;
    content += ',';
    mainScreen.value = content;
  }
})


// clear function
document.querySelector('.clr').addEventListener("click", ()=> {
  const cover = document.querySelector('.screen__cover');
  cover.classList.add('clearer');
  setTimeout(()=> cover.classList.remove('clearer'),
    700)
  setTimeout(()=> {
    content = "";
    mainScreen.value = content;
    resultScreen.value = content;
  },
    100)
})

// back function
document.querySelector('.back').addEventListener("click", ()=> {
  if (content !== "") {
    let part = /[gctns]/.test(content.slice(-2, -1));
    if (!part)
      content = content.slice(0, -1);
    else {
      if (content.slice(-3, -2) === 'l')
        content = content.slice(0, -3);
      else
        content = content.slice(0, -4);
    }
    mainScreen.value = content;
    if (calculator(content, unit) !== "Error")
      resultScreen.value = calculator(content, unit);
    if (content === "")
      resultScreen.value = content;
  }
})

// Theme toggler
document.querySelector(".theme-toggle").addEventListener('click', (e)=> {
  const body = document.body;
  let theme = body.getAttribute('data-theme')

  if (theme === "dark") {
    body.setAttribute('data-theme', "light");
    e.target.innerText = 'Dark'
  } else {
    body.setAttribute('data-theme', "dark");
    e.target.innerText = 'Light'
  }
})

document.querySelector(".deg-rad").addEventListener("click", (e)=> {
  const target = e.target;
  let data = dagRadScreen.innerText;
  if (data === 'DEG') {
    dagRadScreen.innerText = 'RAD';
    e.target.innerText = 'DEG';
    unit = "RAD";
  } else {
    dagRadScreen.innerText = 'DEG';
    e.target.innerText = 'RAD';
    unit = "DEG";
  }
  if (calculator(content, unit) !== "Error")
    result = calculator(content, unit, [resultScreen]);
})