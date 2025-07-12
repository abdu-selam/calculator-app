// handling negative sign when it comes with multiplication and division
const dblOprtrFormatter = (text)=> {
  const txtArray = [...text]; // using array of characters for better control
  const dblOprtr = [];
  for (let i = 0; i < txtArray.length; i++) {
    if (txtArray[i] === '-' && ['×', '÷'].includes(txtArray[i-1]))
      dblOprtr.push(i+(dblOprtr.length*2));
  }
  dblOprtr.forEach(index => {
    txtArray.splice(index, 0, '(');
    txtArray.splice(index+3, 0, ')');
  })

  return txtArray;
}


// adding multiplication sign on '6(7)' like expression
const multFormatter = (txtArray)=> {
  const mult = [];
  const preMultChars = ['(',
    's',
    'l',
    't',
    'c',
    '√',
    'π',
    'e',
  ]

  let i = -1;
  for (let char of txtArray) {
    i++;
    if (!isNaN(char)) {
      if (preMultChars.includes(txtArray[i+1]))
        mult.push(i+1+mult.length);
      else if ([')', '!'].includes(txtArray[i-1]))
        mult.push(i+mult.length);
    }
  }
  mult.forEach(index => txtArray.splice(index, 0, '×'));

  return txtArray;
}


// negative sign when it comes first and after opening bracket
const minusOprtrFormatter = (txtArray)=> {
  const [minus,
    amount] = [[],
    []];
  let i = -1;
  let isMinus = false;
  let counter = 0;
  for (let char of txtArray) {
    i++;
    if (isMinus) {
      if (!isNaN(char)) {
        counter++;
      } else {
        isMinus = !isMinus;
        amount.push(counter);
        counter = 0;
      }
    } else if (char === '-' && (i === 0 || txtArray[i-1] === '(')) {
      minus.push(i+minus.length);
      isMinus = !isMinus;
    }
    if (i === txtArray.length-1 && counter > 0)
      amount.push(counter);
  }

  minus.forEach(index => txtArray.splice(index, 0, 0));

  i = 0;
  for (let index of minus) {
    index += i * 2;
    i++;
    txtArray.splice(index, 0, '(');
    txtArray.splice(index+3+ amount[i-1], 0, ')');
  }

  return txtArray;
}


// function to format inappropriate input like unclosed bracket
const bracketFormatter = (txtArray)=> {
  let [open,
    close] = [0,
    0];

  // handling unclosed and unopened brackets and also
  let i = -1;
  for (let char of txtArray) {
    i++;
    if (char === '(')
      open++;
    else if (char === ')') {
      if (open !== 0)
        open--;
      else
        close++;
    }
  }

  return '('.repeat(close) + txtArray.join('') + ')'.repeat(open);
}


// advanced operators formatting, log, ln, sin, cos and tan
const txtOprtrFormatter = (text)=> {
  const oprtr = ['s',
    'l',
    't',
    'c',
    '√',
  ];

  const handler = {
    log10: {
      start: [],
      end: [],
      ico: 'L'
    },
    log: {
      start: [],
      end: [],
      ico: 'l'
    },
    ln: {
      start: [],
      end: [],
      ico: 'n'
    },
    sin: {
      start: [],
      end: [],
      ico: 's'
    },
    cos: {
      start: [],
      end: [],
      ico: 'c'
    },
    tan: {
      start: [],
      end: [],
      ico: 't'
    },
    csc: {
      start: [],
      end: [],
      ico: 'S'
    },
    sec: {
      start: [],
      end: [],
      ico: 'C'
    },
    cot: {
      start: [],
      end: [],
      ico: 'T'
    },
    radical: {
      start: [],
      end: [],
      ico: '√'
    }
  };
  const order = [];
  let i = -1;
  let [start,
    nxt] = [0,
    0];
  for (let char of [...text]) {
    i++;
    if (oprtr.includes(char)) {
      if (!['√'].includes(char) && (text[i+1] === '(' || text[i+1] === 'c'))
        continue;
      let key = ['√'].includes(char)?'radical': text.slice(i, i+3);
      start = i - nxt;
      if (char === 'l') {
        if (text[i+2] === '(') {
          key = 'ln';
        } else {
          let need = text.slice(i+4, braceTwins(text, i+3));
          need = braceRemover(need);
          if (need.includes(',') && need.slice(-1) !== ',') {
            key = 'log'
            nxt++;
          } else
            key = 'log10';
        }
      }
      let j = 1;
      if (!['√'].includes(char)) {
        nxt += 2
        j = 3;
      }
      if (key === 'ln') {
        nxt -= 1
        j = 2;
      }
      handler[key]['start'].push(start);
      handler[key]['end'].push(start+j);
      order.push(key);
    }
  }

  let def = 0;
  let preState = 0;
  for (let key of order) {
    let start = handler[key]['start'].shift()
    if (start < preState) {
      def++;
    } else {
      if (def > 0)
        def--;
    }
    start -= def;
    let end = handler[key]['end'].shift() - def

    let temp = text.slice(end+1, braceTwins(text, end));

    temp = braceRemover(temp);
    let i = firstOprtr(text.slice(start));

    if (text[end] === '(') {
      i = braceTwins(text, end);
    }
    let j = i;
    if (key == 'log') {
      i = temp.indexOf(',')+end;
      j = i + 1;
    }

    let ico = handler[key]['ico'];
    text = text.slice(0, start) + text.slice(end, i+1) + ico + text.slice(j+1);
    preState = text.length - text.slice(j+1).length - 1;
  }

  return text;
}



// bracket pair teller
export const braceTwins = (text, start)=> {
  const Twins = {};
  const [left,
    right] = [[],
    []];
  let i = -1;
  for (let char of text) {
    i++;
    if (char === '(') {
      left.push(i);
    } else if (char === ')') {
      let index = left.pop();
      Twins[index] = i;
    }
  }

  return Twins[start];
}

// brace remover in log function
const braceRemover = (txt) => {
  let text = txt.slice(0);
  const loopCount = text.split('(').length - 1;

  for (let i = 0; i < loopCount; i++) {
    let index = text.indexOf('(');

    if (index === -1) break;
    let j = braceTwins(text, index);
    if (index == 0) {
      if (j !== text.length -1)
        text = text.slice(0, index)+text.slice(j+1);
      else
        text = text.slice(i+1, j);
    } else
      text = text.slice(0, index)+text.slice(j+1);
  }

  return text;
}


// to get the first operator after radical
const firstOprtr = (text)=> {
  const oprtrs = ['+',
    '-',
    '×',
    '÷',
    '(',
    ')',
    '^',
    'L',
    'l',
    'n',
    '!',
    's',
    'c',
    't',
    '√',
    'S',
    'C',
    'T'];
  let char = "";
  let i = -1;
  for (let each of text) {
    i++;
    if (oprtrs.includes(each))
      return i;
  }
}

// input formatting wrapper function
export const inputFormatter = (text)=> {
  const formattedDblOprtr = dblOprtrFormatter(text);
  const formattedMultOprtr = multFormatter(formattedDblOprtr);
  const formattedMinusOprtr = minusOprtrFormatter(formattedMultOprtr);
  const formattedBracket = bracketFormatter(formattedMinusOprtr);
  const formattedArray = txtOprtrFormatter(formattedBracket);
  return formattedArray;
}