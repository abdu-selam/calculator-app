import {
	tryer
} from './calculationLogic.js';

// elements
const mainScreen = document.querySelector('.screen__main');
const resultScreen = document.querySelector('.screen__result');
const oprtrBtn = [...document.querySelectorAll('.optr')];
const oprators = oprtrBtn.map((btn)=>btn.innerText)
const equal = document.querySelector('.equal');
const dot = document.querySelector('.dot');
const leftBracket = document.querySelector('.left');
const rightBracket = document.querySelector('.right');
const clear = document.querySelector('.clr');
const back = document.querySelector('.back');
const numbers = [...document.querySelectorAll('.num')];
const numData = numbers.map((num)=>num.innerText)


// Theme toggler
document.querySelector(".theme-toggle").addEventListener('click', (e)=> {
	const body = document.querySelector("body");
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

	if (target.matches('.btn')) {
		let screenText = mainScreen.innerText;
		let lastI = screenText.length - 1;

		if (numbers.includes(target)) {
			if (screenText === '0') {
				mainScreen.innerText = target.innerText;
				return;
			}
			mainScreen.innerText += target.innerText;
			mainScreen.scrollLeft = mainScreen.scrollWidth;
		} else if (oprtrBtn.includes(target)) {

			if (screenText.length !== 0) {
				if (oprators.includes(screenText[lastI]) || screenText[lastI] === dot.innerText) {
					screenText = screenText.slice(0, lastI) + target.innerText;
					mainScreen.innerText = screenText;
				} else {
					mainScreen.innerText += target.innerText;
					mainScreen.scrollLeft = mainScreen.scrollWidth;
				}
			}
		} else {
			if (target === dot && numData.includes(screenText[lastI])) {
				mainScreen.innerText += target.innerText;
				mainScreen.scrollLeft = mainScreen.scrollWidth;
			} else if (screenText.length === 0) {
				mainScreen.innerText = `0${dot.innerText}`;
			} else if (target === equal) {
				tryer(screenText);
			}
		}
	}
})

document.querySelector('.btns__ctrl').addEventListener("click", (e)=> {
	const target = e.target;
	if (target === clear) {
		mainScreen.innerText = "";
	} else if (target === back) {
		let lastI = mainScreen.innerText.length - 1;
		mainScreen.innerText = mainScreen.innerText.slice(0, lastI);
	} else {
		mainScreen.innerText += target.innerText;
	}
})