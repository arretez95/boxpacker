// DOM and UI Effects
export function toggleClickerIcon(add, remove) {
	const clicker = document.getElementById("packBox");
	clicker.classList.add(add);
	clicker.classList.remove(remove);
}

export function clickEffect(gameData) {
	const clicker = document.getElementById("packBox");
	toggleClickerIcon("game-icons--cardboard-box-closed", "game-icons--cardboard-box");
	if (gameData.boxSize > 1) {
		clicker.style.filter = "hue-rotate(90deg) brightness(1.5)";
		clicker.style.zoom = "150%";
		setTimeout(() => {
			clicker.style.filter = "";
			clicker.style.zoom = "100%";
		}, 400);
	};
	setTimeout(() => {
		toggleClickerIcon("game-icons--cardboard-box", "game-icons--cardboard-box-closed");
	}, 400);
}

export function alertDiv(className, content) {
	const div = document.createElement("div");
	div.classList.add(className);
	div.innerHTML = content;
	document.body.append(div);
	setTimeout(() => div.remove(), 3000);
}

export function msgBox(className, content) {
	const p = document.createElement("p");
	p.classList.add(className);
	const event = new Date();
	const timeString = event.toLocaleTimeString();
	p.innerHTML = `<span class="timestamp">${timeString}</span>${content}`;
	document.getElementById("msgBox").appendChild(p);
	p.scrollIntoView();
}

export function dialogOpen(id) {
	document.getElementById(id).showModal();
}

export function dialogClose(id) {
	document.getElementById(id).close();
}