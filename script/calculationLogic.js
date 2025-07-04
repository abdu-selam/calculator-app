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
			if (i < text.length)
				result.push(char);
			waiter = '';
		} else waiter += char;
	}
	return result;
}

const postfixer = (infix, output = [])=> {
	const presedence = new Map([['+', 1], ['-', 1], ['×', 2], ['÷', 2]]);
	const [stack,
		bracketStack] = [[],
		[]];
	let i = 0;
	let isBracket = 0;
	for (const elem of infix) {
		i++;
		if (elem === '(') isBracket++;
		if (isBracket !== 0) {
			if (elem === ')') {
				bracketStack.reverse().forEach((each)=> {
					output.push(each);
				})
				bracketStack.splice(0, bracketStack.length);
				isBracket = false;
			} else {
				if (typeof(elem) === 'number')
					output.push(elem);
				else {
					let j = bracketStack.length - 1;
					if (bracketStack.length === 0 || presedence.get(bracketStack[j]) <
						presedence.get(elem)) {
						if (elem !== '(')
							bracketStack.push(elem);
					} else {
						const oprtr = bracketStack.pop();
						output.push(oprtr);
						bracketStack.push(elem);
					}
				}
			}
		} else {

			if (typeof(elem) === 'number')
				output.push(elem);
			else {
				let j = stack.length - 1;
				if (stack.length === 0 || presedence.get(stack[j]) < presedence.get(elem))
					stack.push(elem);
				else {
					const oprtr = stack.pop();
					output.push(oprtr);
					stack.push(elem);
				}
			}
		}
		if (i === infix.length) {
			for (let k = stack.length-1; k >= 0; k--) {
				output.push(stack[k]);
			}
			delete stack;
		}
	}
	return output;
}
