import { alertDiv, msgBox } from './dom.js';

export function spawnInvader(ctx) {
	const { gameData, update, numFormat, fillBar, settings } = ctx;

	const clicker = document.getElementById("packBox");
	const clickerArea = document.getElementById("clickerArea");

	if (!clicker || !clickerArea) return;

	const invader = document.createElement("div");
	invader.classList.add("invader");

	const fromLeft = Math.random() < 0.5;
	const startX = fromLeft ? -50 : clickerArea.clientWidth + 50;
	const startY = Math.random() * (clickerArea.clientHeight - 40);

	invader.style.left = `${startX}px`;
	invader.style.top = `${startY}px`;

	clickerArea.appendChild(invader);

	// Get box position relative to clickerArea
	const areaRect = clickerArea.getBoundingClientRect();
	const boxRect = clicker.getBoundingClientRect();
	const targetX = boxRect.left - areaRect.left + clicker.offsetWidth / 2;
	const targetY = boxRect.top - areaRect.top + clicker.offsetHeight / 2;

	// Setup animation parameters
	let currentX = startX;
	let currentY = startY;

	const dx = targetX - startX;
	const dy = targetY - startY;
	const distance = Math.sqrt(dx * dx + dy * dy);
	const directionX = dx / distance;
	const directionY = dy / distance;
	const speed = 2; // pixels per frame

	let lastDmgTime = 0;
	const DAMAGE_INTERVAL = 1000; // ms

	function moveInvader() {
		const now = Date.now();
		const invaderRect = invader.getBoundingClientRect();
		const boxRect = clicker.getBoundingClientRect();

		const isColliding = !(
			invaderRect.right < boxRect.left ||
			invaderRect.left > boxRect.right ||
			invaderRect.bottom < boxRect.top ||
			invaderRect.top > boxRect.bottom
		);

		if (isColliding) {
			if (now - lastDmgTime >= DAMAGE_INTERVAL) {
				gameData.box = Math.max(0, gameData.box - gameData.level);
				update("boxCount", numFormat(gameData.box, 0, settings.numtype));
				fillBar("boxes", gameData.box, gameData.maxBoxes, "rgb(188, 143, 143)", "rgba(255, 255, 55, 0.5)");
				lastDmgTime = now;
			}
			// Stop moving while colliding
			requestAnimationFrame(moveInvader); // still keep damage over time
			return;
		}

		// Move position
		currentX += directionX * speed;
		currentY += directionY * speed;
		invader.style.left = `${currentX}px`;
		invader.style.top = `${currentY}px`;

		// Remove if offscreen
		if (
			currentX < -100 ||
			currentX > clickerArea.clientWidth + 100 ||
			currentY < -100 ||
			currentY > clickerArea.clientHeight + 100
		) {
			invader.remove();
			return;
		}

		requestAnimationFrame(moveInvader);
	}

	requestAnimationFrame(moveInvader);
}



export function randomSpawnLoop(start, end, ctx) {
	const delay = Math.random() * ((end - start) * 1000) + (start * 1000);

	setTimeout(() => {
		if (ctx.gameData.level > 3) {
			spawnInvader(ctx);
		}
		randomSpawnLoop(start, end, ctx); // Continue the loop
	}, delay);
}
