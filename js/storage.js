// Save/Load/Clear
import { alertDiv } from './dom.js';
import { settings, getInitData } from './settings.js';

export function saveGame(gameData, settings) {
	localStorage.setItem("saveFile", JSON.stringify(gameData));
	localStorage.setItem("saveSettings", JSON.stringify(settings));
	console.log("Game saved!");
	alertDiv("success", "Game saved!");
}

export function loadGame(gameData, settings) {
	if (localStorage.getItem("saveFile") != null) {
		Object.assign(gameData, JSON.parse(localStorage.getItem("saveFile")));
	}

	if (localStorage.getItem("saveSettings") != null) {
		Object.assign(settings, JSON.parse(localStorage.getItem("saveSettings")));
	}
}

export function clearData(gameData) {
	localStorage.removeItem("saveFile");
	Object.assign(gameData, getInitData());
	gameData.level = 1;
	gameData.xp = 0;
}