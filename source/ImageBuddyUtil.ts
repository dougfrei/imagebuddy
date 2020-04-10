export function stringToBoolean(attrVal: string): boolean {
	const refVal = attrVal.trim().toLowerCase();

	if (refVal === 'true') {
		return true;
	}

	if (refVal === 'false') {
		return false;
	}

	const numVal = parseInt(refVal, 10);

	return numVal > 0;
}
