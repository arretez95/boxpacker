function upgradeSkill1_1() {
  if (prestige.currentskillPts >= 1) {
	prestige.currentskillPts -= 1;
	getElement("skillPts").innerHTML = prestige.currentskillPts

	gameData.Switches.automate = 1;
	gameData.Switches.autoShip = 1;
	
	maxed("automationUpgrade");
	unlock("packerUpgrade");

	maxed("autoShipUpgrade");
	unlock("upShipAmount");

	setTimeout(boxLoop, gameData.Switches.automateDelay);
	setTimeout(shipLoop, gameData.Switches.autoShipDelay);
    setTimeout(upSkill, 1000);
  }
	
	if (gameData.dollars >= gameData.Switches.upShipAmtCost) {
    gameData.dollars -= gameData.Switches.upShipAmtCost
    gameData.Switches.autoShipAmount += 10;
    gameData.Switches.upShipAmtCost *= 1.5;
    updateDollars();
    getElement("shipAmount").innerHTML = Math.floor(gameData.Switches.autoShipAmount);
    updateCost("upShipAmount", gameData.Switches.upShipAmtCost);
  }
}