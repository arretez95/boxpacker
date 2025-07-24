import {
	settings,
	getInitData,
	setTheme,
	toggleTheme,
	toggleTooltips,
	toggleAnim,
} from './js/settings.js';
import {
	update,
	fillBar,
	clamp,
	numFormat
} from './js/utils.js';
import {
	clickEffect,
	dialogOpen,
	dialogClose,
	alertDiv,
	msgBox
} from './js/dom.js';
import {
	levelCounter as makeLevelCounter
} from './js/level.js';
import {
	chooseBox,
	tapeGunRefill,
	tapeGun,
	packBox,
	shipBox
} from './js/box.js';
import {
	saveGame,
	loadGame,
	clearData
} from './js/storage.js';
import {
	resource,
	utility,
	upgrades,
	purchaseUpgrade,
	buildResourceElement,
	addUpgrade
} from './js/upgrades.js';
/* import { randomSpawnLoop } from './js/shooter.js'; */

// Game runtime data (clone of initData + extras)
const gameData = structuredClone(getInitData());
gameData.level = 1;
gameData.xp = 0;

// Runtime state (use .value for interval ref to keep module linkage)
let tapeRefillInterval = {
	value: null,
};

// Compose logic with closures
const gameContext = {
	gameData,
	update,
	numFormat,
	fillBar,
	settings
};

const _tapeGunRefill = tapeGunRefill(gameData, settings, tapeRefillInterval, v => tapeRefillInterval.value = v);
const _tapeGun = tapeGun(gameData, settings, tapeRefillInterval, v => tapeRefillInterval.value = v);
const _chooseBox = (g, x) => chooseBox(g, x);
const _levelCounter = makeLevelCounter(gameData);
const _packBox = packBox(gameData, settings, _tapeGun, _chooseBox, _levelCounter, tapeRefillInterval);
const _shipBox = shipBox(gameData, settings, _levelCounter);


function refreshUI() {
	update("boxCount", numFormat(gameData.box, 0, settings.numtype));
	update("dollars", numFormat(gameData.dollars, 2, settings.numtype));
	update("level", gameData.level);
	update("tapeGun", `${numFormat(clamp((gameData.tapeLength / gameData.tapeLengthMax) * 100, 0, 100), 0, settings.numtype)}%`);
	fillBar("tape", gameData.tapeLength, gameData.tapeLengthMax, "gold", "transparent");
	fillBar("boxes", gameData.box, gameData.maxBoxes, "rgb(188, 143, 143)", "rgba(255, 255, 55, 0.5)");
	_levelCounter(0);
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
	// Add resources to resource bar
	const resources = document.querySelector('.resource-menu');
	const utils = document.querySelector('.utility-menu');

	resource.forEach(resource => { //load resource into sidebar
		const el = buildResourceElement(resource);
		resources.appendChild(el);
	});

	utility.forEach(utility => { //load utility into sidebar
		const el = buildResourceElement(utility);
		utils.appendChild(el)
	})

	for (let i = 0; i < upgrades.length; i++) {
			if (gameData.level >= upgrades[i].unlock) {
				addUpgrade(i, gameData);
			}
	}

	// Load game
	/* loadGame(gameData);
	refreshUI(); */

	//Clickers
	const clickHandlers = {
		//Clickers
		tape: () => {
			if (tapeRefillInterval.value !== null) _tapeGunRefill(0.1);
		},
		shipBoxes: () =>{_shipBox(1)},
		packBox: () => {
			_packBox();
			clickEffect(gameData);
		},

		//Settings
		settings: () => {
			dialogOpen("settingsDialog");
		},
		toggleTheme: toggleTheme,
		toggleTooltips: toggleTooltips,
		toggleAnim: toggleAnim,
		closeSettings: () => {dialogClose("settingsDialog")},
		save: () => saveGame(gameData, settings),
		clear: () => {
			clearData(gameData);
			refreshUI();
		},
	};

	Object.entries(clickHandlers).forEach(([id, handler]) => {
		const el = document.getElementById(id);
		if (el) el.addEventListener("click", handler);
	});

	document.querySelector('.rightbar').addEventListener('click', function(evt) {
	const upgradeDiv = evt.target.closest('.upgrade');
	if (upgradeDiv && upgradeDiv.dataset.upgradeIndex !== undefined) {
		purchaseUpgrade(Number(upgradeDiv.dataset.upgradeIndex), gameData);
	}
});

	const eventHandlers = {
		themeSelect: (e) => setTheme(e.target.value),
	}

	
	Object.entries(eventHandlers).forEach(([id, handler]) => {
		const el = document.getElementById(id);
		if (el) el.addEventListener("change", handler);
	});

	document.getElementById("scaleRange").addEventListener("input", (e) => {
		const scale = e.target.value / 100;
		const ui = document.getElementById("uiContainer");

		// Scale visually
		ui.style.transform = `scale(${scale})`;

		// Compensate layout so it fills screen even when scaled down
		ui.style.width = `${100 / scale}vw`;
		ui.style.height = `${100 / scale}vh`;
		});



// HOT KEYS YAAAAAAAY
	document.addEventListener("keyup", (event) => {
		if (event.key === "z" && tapeRefillInterval.value === null) {
			_packBox();
			clickEffect(gameData);
		}
		if (event.key === "x") {
			_shipBox(1);
		}
		if (event.key === "c" && tapeRefillInterval.value !== null) {
			_tapeGunRefill(0.2);
		}
	});


	//Ticker
	setInterval(() => {
		if (gameData.packer > 0 && tapeRefillInterval.value === null) {
			_packBox(gameData.packer * gameData.packEff);
		}

		if (gameData.shipper > 0 && gameData.box >= 1) {
			_shipBox(gameData.shipper*gameData.shipperEff);
		}

		gameData.lastTick = Date.now();
	}, 1000);

	/* randomSpawnLoop(5 / gameData.level, 10 / gameData.level, gameContext); */
});