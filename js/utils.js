// Helpers & Utilities
export function update(id, content) {
	document.getElementById(id).innerHTML = content;
}

export function fillBar(id, currentAmt, max, color1, color2) {
	const percent = (currentAmt / max) * 100;
	document.getElementById(id).style.background = `linear-gradient(to right, ${color1} ${percent}%, ${color2} ${percent}%)`;
}

export const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

export function numFormat(number, places, type) {
	if (number === 0) return "0";
	const exponent = Math.floor(Math.log10(number));
	const mantissa = number / Math.pow(10, exponent);
	if (exponent < 9) return parseFloat(number.toFixed(places)).toLocaleString();
	if (type === "scientific") return mantissa.toFixed(2) + "e" + exponent;
	if (type === "engineering") return (Math.pow(10, exponent % 3) * mantissa).toFixed(2) + "e" + Math.floor(exponent / 3) * 3;
}

export function randbetween(min, max) {
	return Math.random() * (max - min) + min;
}