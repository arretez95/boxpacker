// Leveling & Experience
import { clamp, update } from './utils.js';
import { alertDiv } from './dom.js';
import { upgrades, addUpgrade } from './upgrades.js'

export function levelCounter(gameData) {
	return function(xpGain) {
		gameData.xp += xpGain;
		const base = 10 * Math.pow(3, gameData.level);
		const xpNeeded = base * Math.sqrt(gameData.level * 2);
		if (gameData.xp >= xpNeeded) {
			gameData.xp -= xpNeeded;
			gameData.level += 1;
			update("level", gameData.level);
			alertDiv("success", "Level up!");

			//check upgrades
			for (let i = 0; i < upgrades.length; i++) {
						if (gameData.level >= upgrades[i].unlock) {
							addUpgrade(i, gameData);
						}
				}
		}
		const percent = (gameData.xp / xpNeeded) * 100;
		update("experience", `<span class="xp-slash">(${clamp(gameData.xp.toFixed(2), 0, xpNeeded)}/${xpNeeded.toFixed(0)})</span>
	     <span class="xp-percent">${Math.floor(percent)}%</span>`);
		const xpBar = document.querySelector(".xp-progress");
		if (xpBar) xpBar.style.width = `${percent}%`;
	}
}