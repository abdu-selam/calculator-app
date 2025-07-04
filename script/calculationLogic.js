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

