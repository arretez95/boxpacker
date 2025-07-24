// Box and Tape logic
import { clamp, update, fillBar, randbetween, numFormat } from './utils.js';
import { alertDiv, msgBox } from './dom.js';

export function chooseBox(gameData, x) {
	if (x < gameData.lrgBoxChance) {
		return 3;
	} else if (x < (gameData.lrgBoxChance + gameData.medBoxChance)) {
		return 2;
	} else {
		return 1;
	}
}

export function tapeGunRefill(gameData, settings, tapeRefillInterval, setTapeRefillInterval) {
	return function(percent = 1) {
		if (gameData.tapeLength >= gameData.tapeLengthMax) return;
		gameData.tapeLength = clamp(gameData.tapeLength + gameData.tapeRefill * percent, 0, gameData.tapeLengthMax);
		update("tapeGun", `${numFormat(
	      clamp((gameData.tapeLength / gameData.tapeLengthMax) * 100, 0, 100),
	      0,
	      settings.numtype
	    )}%`);
		fillBar("tape", gameData.tapeLength, gameData.tapeLengthMax, "gold", "transparent");
	}
}

export function tapeGun(gameData, settings, tapeRefillInterval, setTapeRefillInterval) {
	return function(percent = 1) {
		gameData.tapeLength = clamp(gameData.tapeLength - gameData.tapeUse * (gameData.boxSize*percent), 0, gameData.tapeLengthMax);
		update("tapeGun", `${numFormat(
	      clamp((gameData.tapeLength / gameData.tapeLengthMax) * 100, 0, 100),
	      1,
	      settings.numtype
	    )}%`);
		fillBar("tape", gameData.tapeLength, gameData.tapeLengthMax, "gold", "var(--resource-bg)");

		if (gameData.tapeLength === 0 && tapeRefillInterval.value === null) {
			document.getElementById("packBox").classList.add("disabled");
			document.getElementById("tape").style.cursor = "pointer";
			tapeRefillInterval.value = setInterval(() => {
				tapeGunRefill(gameData, settings, tapeRefillInterval, setTapeRefillInterval)();
				if (gameData.tapeLength >= gameData.tapeLengthMax) {
					clearInterval(tapeRefillInterval.value);
					tapeRefillInterval.value = null;
					document.getElementById("packBox").classList.remove("disabled");
					document.getElementById("tape").style.cursor = "default";
					msgBox("msgSuccess", "Tape Refilled!");
				}
			}, gameData.tapeRefillSpeed - (gameData.tapeRefillSpeed * gameData.level) / 100);
		}
	}
}

export function packBox(gameData, settings, tapeGun, chooseBox, levelCounter, tapeRefillInterval) {
	return function(percent = 1) {
		if (gameData.tapeLength > 0 && gameData.box < gameData.maxBoxes) {
			gameData.boxSize = chooseBox(gameData, randbetween(0, 99));
			if (percent < 1) {
				gameData.box = gameData.box + (gameData.boxSize*percent)
			} else {
				gameData.box = clamp((gameData.box + gameData.boxSize*gameData.boxPerClick), 0, gameData.maxBoxes);
			}
			update("boxCount", numFormat(gameData.box, 2, settings.numtype));
			fillBar("boxes", gameData.box, gameData.maxBoxes, "#bc8f8f", "var(--resource-bg)");
			tapeGun(percent);
			levelCounter(gameData.boxSize*gameData.boxPerClick*percent);
		}
		if (gameData.box >= gameData.maxBoxes) {
			msgBox("msgError", "You have too many boxes!");
		}
		if (tapeRefillInterval.value != null) {
			msgBox("msgError", "You're out of tape!");
		}
	}
}

export function shipBox(gameData, settings, levelCounter) {
	return function(percent = 1) {
		if (gameData.box < 1) return; //do nothing if no complete boxes

		const earned = gameData.boxPrice * gameData.shipAmt;

		if (gameData.box >= gameData.shipAmt && gameData.box >= 1) {
			gameData.dollars += earned * percent;
			gameData.box = clamp(gameData.box - (gameData.shipAmt*percent), 0, gameData.maxBoxes)
			levelCounter(gameData.shipAmt * 0.5 * percent);
		} else if (gameData.box < gameData.shipAmt && gameData.box >=1) {
			gameData.dollars += gameData.box * gameData.boxPrice * percent;
			levelCounter(gameData.box * gameData.boxSize * 0.5 * percent);
			gameData.box = clamp(gameData.box - (gameData.shipAmt*percent),0,gameData.maxBoxes);
		}
		update("boxCount", numFormat(gameData.box, 2, settings.numtype));
		update("dollars", numFormat(gameData.dollars, 2, settings.numtype));
		fillBar("boxes", gameData.box, gameData.maxBoxes, "rgb(188, 143, 143)", "var(--resource-bg)");
	}
}