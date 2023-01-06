export default class StyledComponentUtil {
	static apply(object: any) {
		
		const result: any = { };
		
		Object.keys(object).forEach(k => result[k.replace(/[A-Z]/g, m => "-" + m.toLowerCase())] = object[k]);
		
		return result;
	}
}
