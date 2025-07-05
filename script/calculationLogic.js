const formatter = (text)=> {
	const txtArray = text.split('');
	let [open,
		close] = [0,
		0]
	const [mult,
		minus] = [[],
		[]];
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

	mult.forEach(index => txtArray.splice(index, 0, '×'));
	minus.forEach(index => txtArray.splice(index, 0, 0));

	i = 0;
	for (let index of minus) {
		index += i * 2;
		i++;
		txtArray.splice(index, 0, '(');
		txtArray.splice(index+4, 0, ')');
	}

	text = '('.repeat(close) + txtArray.join('') + ')'.repeat(open);

	return text;
}


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

			delete stack;
			delete bracketStack;
		}
	}
	return output;
}
