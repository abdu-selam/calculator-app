import {
	calculator
} from './calculationLogic.js';

// elements
const mainScreen = document.querySelector('.screen__main'); // screen that show clicked numbers
const resultScreen = document.querySelector('.screen__result'); // screen that shows calculation result
// single buttons
const equal = document.querySelector('.equal');
const dot = document.querySelector('.dot');
const leftBracket = document.querySelector('.left');
const rightBracket = document.querySelector('.right');
const clear = document.querySelector('.clr');
const back = document.querySelector('.back');

// array of buttons
const oprtrBtn = [...document.querySelectorAll('.optr')]; // array of operators element
const oprators = oprtrBtn.map((btn)=>btn.innerText);

const numbers = [...document.querySelectorAll('.num')]; // array of number elements
const numData = numbers.map((num)=>num.innerText);


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

// Writer on screen
document.querySelector('.btns__nums').addEventListener('click', (e)=> {
	const target = e.target;

	if (!target.matches('.btn')) return;
	let screenText = mainScreen.innerText;
	let lastIndex = screenText.length - 1;

	if (numbers.includes(target)) {
		if (screenText === '0') {
			// if '0' on the screen replace with clucked number
			mainScreen.innerText = target.innerText;
			return;
		}
		mainScreen.innerText += target.innerText;
	} else if (oprtrBtn.includes(target)) {

		// prevent writing operators on clear screen
		if (screenText.length === 0) {
			if (target.innerText !== '-') return;
			mainScreen.innerText = target.innerText;
			return
		}

		if (oprators.includes(screenText[lastIndex]) || screenText[lastIndex] === dot.innerText) {
			// prevent typing preceded operators and point
			if (screenText.length > 1) {
				screenText = screenText.slice(0, lastIndex) + target.innerText;
				mainScreen.innerText = screenText;
			}
		} else
			mainScreen.innerText += target.innerText;
	} else {
		if (target === dot) {
			if (numData.includes(screenText[lastIndex]))
				mainScreen.innerText += target.innerText;
			else if (screenText.length === 0)
				// for empty screen add 0 before point
			mainScreen.innerText = `0${dot.innerText}0`;
		} else if (target === equal) {
			let value = calculator(screenText);
			resultScreen.innerText = value;
		}
	}
	// prevent the text from sticking on the left corner
	mainScreen.scrollLeft = mainScreen.scrollWidth;
})

// handling clear button and back button
document.querySelector('.btns__ctrl').addEventListener("click",
	(e)=> {
		const target = e.target;
		let screenText = mainScreen.innerText;
		let lastIndex = screenText.length - 1;
		if (target === clear) {
			mainScreen.innerText = "";
			resultScreen.innerText = "";
		} else if (target === back) {
			mainScreen.innerText = screenText.slice(0, lastIndex);
		} else {
			// writing on screen brackets
			if (target.innerText === ')') {
				if (oprators.includes(screenText[lastIndex]))
					mainScreen.innerText = screenText.slice(0, lastIndex) + target.innerText;
				else if (screenText[lastIndex] === '(')
					mainScreen.innerText = screenText.slice(0, lastIndex);
				else
					mainScreen.innerText += target.innerText;
				return;
			}
			mainScreen.innerText += target.innerText;
		}
	})