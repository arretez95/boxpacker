// Settings
export const settings = {
	numtype: "scientific",
	autoSave: true,
	animationOn: true,
	tooltipsOn: true,
	themeName: "theme-light",
};
// Initial game data
export function getInitData () {
	return {
		tapeUse: 1,
		tapeLength: 30, // yards
		tapeLengthMax: 30,
		tapeRefill: 5,
		tapeRefillSpeed: 1000,
		box: 0,
		boxPerClick: 2,
		boxSize: 1,
		boxMaxSize: 1,
		dollars: 0,
		boxPrice: 0.01,
		maxBoxes: 100,
		shipAmt: 10,
		medBoxChance: 0,
		lrgBoxChance: 0,
		packer: 0,
		packEff: 0.1,
		shipper: 0,
		shipperEff: 0.1,
		lastTick: Date.now(),
	}
}

export function setTheme(themeName) {
	settings.themeName = themeName;
	document.documentElement.className = settings.themeName;
}

export function toggleTheme() {
	if (settings.themeName === 'theme-dark'){
		setTheme('theme-light')
	} else {
		setTheme('theme-dark');
	}
}

(function () {
   if (settings.themeName === 'theme-dark') {
       setTheme('theme-dark');
   } else {
       setTheme('theme-light');
   }
})();


// UI and settings (toggle functions could go in dom.js if desired)
export function toggleAnim() {
	const button = document.querySelector(".boxAnchor button");
	const toggleButton = document.getElementById("toggleAnim");
	settings.animationOn = !settings.animationOn;
	if (settings.animationOn) {
		button.classList.add("ring-animation");
		toggleButton.textContent = "ON";
	} else {
		button.classList.remove("ring-animation");
		toggleButton.textContent = "OFF";
	}
}

export function toggleTooltips() {
	const ui = document.querySelector(".ui");
	const toggleButton = document.getElementById("toggleTooltips");
	settings.tooltipsOn = !settings.tooltipsOn;
	if (settings.tooltipsOn) {
		ui.classList.add("tooltips-enabled");
		toggleButton.textContent = "ON";
	} else {
		ui.classList.remove("tooltips-enabled");
		toggleButton.textContent = "OFF";
	}
}