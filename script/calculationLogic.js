// function to format inappropriate input like unclosed bracket
const inputFormatter = (text)=> {
	const txtArray = [...text]; // using array of characters for better control
	let [open,
		close] = [0,
		0]
	const [mult,
		minus,
		dblOprtr] = [[],
		[],
		[]];

	// handling negative sign when it comes with multiplication and division
	for (let i = 0; i < txtArray.length; i++) {
		if (txtArray[i] === '-' && ['×', '÷'].includes(txtArray[i-1]))
			dblOprtr.push(i+(dblOprtr.length*2));
	}
	dblOprtr.forEach(index => {
		txtArray.splice(index, 0, '(');
		txtArray.splice(index+3, 0, ')');
	})

	/* handling unclosed and unopened brackets and also
	negative sign when it comes first and after opening bracket */
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
		} else if (!isNaN(char)) {
			if (txtArray[i+1] === '(')
				mult.push(i+1+mult.length);
			else if (txtArray[i-1] === ')')
				mult.push(i+mult.length);
		} else if (char === '-' && (i === 0 || txtArray[i-1] === '(')) {
			minus.push(i+mult.length+minus.length);
		}
	}

	// adding multiplication sign on '6(7)' like expression
	mult.forEach(index => txtArray.splice(index, 0, '×'));

	minus.forEach(index => txtArray.splice(index, 0, 0));

	i = 0;
	for (let index of minus) {
		index += i * 2;
		i++;
		txtArray.splice(index, 0, '(');
		txtArray.splice(index+4, 0, ')');
	}

	return '('.repeat(close) + txtArray.join('') + ')'.repeat(open);
}


// separator function to separate numbers and signs from the given string
const separator = (text)=> {
	const operators = ['+',
		'-',
		'×',
		'÷',
		'(',
		')'];
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
			if (i < text.length || char === ')')
				result.push(char);
			waiter = '';
		} else waiter += char;
	}
	return result;
}


// RPN generator from given infix notation
const postfixer = (infix)=> {
	const presedence = new Map([['+', 1], ['-', 1], ['×', 2], ['÷', 2], ['(', 0]]);
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
const calcLogic = (num1, num2, oprtr)=> {
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
	}
}


// calculator for RPN expressions
const postfixCalculator = (list) => {
	const stack = [];
	for (const elem of list) {
		if (typeof elem === 'number') stack.push(elem);
		else {
			const num2 = stack.pop();
			const num1 = stack.pop();
			stack.push(calcLogic(num1, num2, elem));
		}
	}
	return stack[0];
};

// caller function for real time calculation
export const calculator = (text)=> {
	const formattedText = inputFormatter(text);
	const separatedArray = separator(formattedText);
	const postfixNotation = postfixer(separatedArray);
	const value = postfixCalculator(postfixNotation);

	return isNaN(value)?undefined: value;
}