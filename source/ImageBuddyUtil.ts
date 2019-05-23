export function parseBooleanString(boolStr: string): boolean {
	if (boolStr.toLowerCase() === 'true') {
		return true;
	}

	return Boolean(parseInt(boolStr, 10));
}
