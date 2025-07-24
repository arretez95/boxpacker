function dialog(id) {
	const openSettings = document.querySelector("#settings");
			const dialog = document.querySelector("#popupSettings");
			openSettings.addEventListener('click', () => {
				dialog.showModal();
			});
			
			d.addEventListener('click', () => {
				dialog.close();
			});
}