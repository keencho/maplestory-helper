export const numberComma = (number: number) => {
	return number.toLocaleString('ko-KR');
}

export const numberToKorean = (number: number | undefined) => {
	if (number === undefined || number <= 0) {
		return number;
	}
	const unitWords    = ['', '만', '억', '조', '경'];
	const splitUnit    = 10000;
	const splitCount   = unitWords.length;
	const resultArray  = [];
	let resultString = '';
	
	for (let i = 0; i < splitCount; i++){
		let unitResult = (number % Math.pow(splitUnit, i + 1)) / Math.pow(splitUnit, i);
		unitResult = Math.floor(unitResult);
		if (unitResult > 0){
			resultArray[i] = unitResult;
		}
	}
	
	for (let i = 0; i < resultArray.length; i++){
		if(!resultArray[i]) continue;
		resultString = String(numberComma(resultArray[i])) + unitWords[i] + ' ' + resultString;
	}
	
	return resultString;
}

// https://stackoverflow.com/a/64489535/13160032
export const groupBy = <T>(array: T[], predicate: (value: T, index: number, array: T[]) => any) =>
	array.reduce((acc, value, index, array) => {
		(acc[predicate(value, index, array)] ||= []).push(value);
		return acc;
	}, {} as { [key: string]: T[] });
