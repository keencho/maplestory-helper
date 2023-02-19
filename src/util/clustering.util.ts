export function createHistogram(data: number[]): { range: string, count: number }[] {
	const sortedData = data.sort((a, b) => b - a);
	const rangeSize = 1000000000; // 1 billion
	const ranges = Array.from({length: 10}, (_, i) => i * rangeSize);
	
	const histogram = ranges.map((rangeStart, i) => {
		const rangeEnd = i === 99 ? Number.POSITIVE_INFINITY : ranges[i + 1];
		const count = sortedData.filter((d) => d >= rangeStart && d < rangeEnd).length;
		const range = `${rangeStart / 1000000}M-${rangeEnd / 1000000}M`;
		
		return {range, count};
	});
	
	return histogram;
}
