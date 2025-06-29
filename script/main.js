// elements
const mainScreen = document.querySelector('.screen__main');
const oprtrBtn = [...document.querySelectorAll('.optr')];
const oprators = oprtrBtn.map((btn)=>btn.innerText)
const equal = document.querySelector('.equal');
const dot = document.querySelector('.dot');
const leftCursor = document.querySelector('.left');
const rightCursor = document.querySelector('.right');
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
      mainScreen.innerText += target.innerText;
    } else if (oprtrBtn.includes(target)) {

      if (screenText.length !== 0) {
        if (oprators.includes(screenText[lastI]) || screenText[lastI] === dot.innerText) {
          screenText = screenText.slice(0, lastI) + target.innerText;
          mainScreen.innerText = screenText;
        } else {
          mainScreen.innerText += target.innerText;
        }
      }
    } else {
      if (target.innerText === dot.innerText && numData.includes(screenText[lastI])) {
        mainScreen.innerText += target.innerText;
      } else if (screenText.length === 0) {
        mainScreen.innerText = `0${dot.innerText}`
      }
    }
  }
})