export const rectanglesIntersect = (a?: DOMRect, b?: DOMRect): boolean => {
	if (!a || !b) return false;

	return !(
		a.right < b.left ||
		a.left > b.right ||
		a.bottom < b.top ||
		a.top > b.bottom
	);
};
