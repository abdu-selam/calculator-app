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