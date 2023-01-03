export default class StyledComponentUtil {
	static apply(key: Partial<CSSStyleDeclaration>, pp: any | undefined) {
		if (!pp) {
			return undefined;
		}
		return {
			[key as string]: pp
		}
	}
}
