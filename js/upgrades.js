import { update, numFormat } from './utils.js';
import { settings } from './settings.js';
import { alertDiv, msgBox } from './dom.js';

export const resource = [
  {
    id: "tape",
    name: "Tape",
    unlock: 0, 
    tooltip: `Tape helps you pack boxes.<br>Refills when empty.<br>Click to reload faster!`,
    icon: "game-icons--measure-tape-small",
    idCount: "tapeGun",
    amount: "100%",
  },
  {
    id: "boxes",
    name: "Boxes",
    unlock: 0, 
    tooltip: "Ship boxes to make money!",
    icon: "game-icons--cardboard-box-closed-small",
    idCount: "boxCount",
    amount: 0
  },
];

export const utility = [
  {
    id: "packers",
    name: "Packers",
    unlock: 2,
    tooltip: "Automatically pack a number of boxes.",
    icon: "game-icons--arrow-dunk",
    idCount: "packerCount",
    amount: 0,
  }, {
    id: "shippers",
    name: "Shippers",
    unlock: 2,
    tooltip: "Automatically ship a number of boxes",
    icon: "game-icons--hand-truck",
    idCount: "shipperCount",
    amount: 0,
  }, 
]

export const upgrades = [
  {
    id: "upgrade1",
    name: "Bigger Tape",
    desc: "More tape, more boxes! More boxes, more money!",
    unlock: 1,
    stat: {name: "Tape Length", amt: 30, unit: " yards"},
    baseCost: 0.3,
    level: 0,
    maxLevel: 50,
    costMultiplier: 1.5,
    effect(gameData) {
      gameData.tapeLengthMax += 10;
      this.stat.amt += 10;
    },
  },
  {
    id: "upgrade2",
    name: "Medium Boxes",
    desc: "Use larger boxes and save time on packing!",
    unlock: 1,
    stat: {name: "Chance", amt: 0, unit: "%"},
    baseCost: 1.0,
    level: 0,
    maxLevel: 3,
    costMultiplier: 3.0,
    effect(gameData) {
      gameData.boxMaxSize = 2;
      gameData.medBoxChance += 10;
      this.stat.amt += 10;
    },
  },
  {
    id: "upgrade3",
    name: "Packers",
    desc: "The boxes are getting to be a bit much...",
    unlock: 3,
    stat: {name: "Amount", amt: 0, unit: ""},
    baseCost: 1.0,
    level: 0,
    maxLevel: 10,
    costMultiplier: 1.75,
    effect(gameData) {
      gameData.packer += 1;
      this.stat.amt += 1;
      document.getElementById("packerCount").textContent = gameData.packer;
    },
  }, {
    id: "upgrade4",
    name: "Shippers",
    desc: "Who wants to carry boxes by themselves?",
    unlock: 3,
    stat: {name: "Amount", amt: 0, unit: ""},
    baseCost: 2.0,
    level: 0,
    maxLevel: 10,
    costMultiplier: 1.75,
    effect(gameData) {
      gameData.shipper += 1;z
      this.stat.amt += 1;
      document.getElementById("shipperCount").textContent = gameData.packer;
    },
  },
  {
    id: "upgrade5",
    name: "Shelving",
    desc: "Why keep everything on the floor?",
    unlock: 5,
    stat: {name: "Amount", amt: 0, unit: ""},
    baseCost: 5.0,
    level: 0,
    maxLevel: 50,
    costMultiplier: 5.0,
    effect(gameData) {
      gameData.shelving += 1;
      this.stat.amt += 1;
      gameData.maxBoxes = 100 + gameData.shelving * 20;
      document.getElementById("shelfCount").textContent = gameData.shelving;
    },
  },
];

export function purchaseUpgrade(index, gameData) {
  const upgrade = upgrades[index];
  if (upgrade.level >= upgrade.maxLevel) {
    alert(`${upgrade.name} is fully upgraded!`);
    return;
  }
  const currentCost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level);
  if (gameData.dollars >= currentCost) {
    gameData.dollars -= currentCost;
    upgrade.level++;
    upgrade.effect(gameData);
    update("dollars", numFormat(gameData.dollars, 2, settings.numtype));
    document.getElementById(`${upgrade.id}-cost`).innerText =
      upgrade.level >= upgrade.maxLevel
        ? "MAX"
        : `$${(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level)).toFixed(2)}`;
    const levelEl = document.getElementById(`${upgrade.id}-level`);
    if (levelEl) levelEl.innerText = `${upgrade.level}/${upgrade.maxLevel}`;
    const statEl = document.getElementById(`${upgrade.id}-stat`);
    if (statEl) statEl.innerText = `${upgrade.stat.amt}${upgrade.stat.unit}`;
  } else {
    alertDiv("msgError","Not enough money!");
  }
}

export function buildUpgradeElement(upgrade, index) {
  const div = document.createElement("div");
  div.classList.add('upgrade');
  div.id = upgrade.id;
  div.dataset.upgradeIndex = index;

  div.innerHTML = `
    <span class="tooltip">
      Level: <span id="${upgrade.id}-level">${upgrade.level}/${upgrade.maxLevel}</span><br>
      ${upgrade.stat.name}: <span id="${upgrade.id}-stat">${upgrade.stat.amt}${upgrade.stat.unit}</span>
    </span>
    <div class="upgrade-name">${upgrade.name}</div>
    <div class="upgrade-desc">${upgrade.desc || ''}</div>
    <div class="upgrade-cost">
      <span id="${upgrade.id}-cost">
        ${upgrade.level >= upgrade.maxLevel
          ? 'MAX'
          : '$' + (upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level)).toFixed(2)
        }
      </span>
    </div>
  `;
  return div;
}

export function buildResourceElement(resource) {
  const div = document.createElement("div");
  div.classList.add("resource");
  div.setAttribute('id',resource.id);
  div.innerHTML = `
      <span class="tooltip">${resource.tooltip}</span>
      <div class="resource-name"><span class="${resource.icon}"></span>${resource.name}</div>
      <div class="resource-amount"><span id="${resource.idCount}">${resource.amount}</span></div>
  `;
  return div;
}

export function addUpgrade(index, gameData) {
  const upgrade = upgrades[index];

  // only insert when the unlock condition is met
  if (gameData.level < upgrade.unlock) return;

  // avoid duplicates
  if (document.getElementById(upgrade.id)) return;
  const rightbar = document.querySelector('.rightbar');
  const newUpgradeEl = buildUpgradeElement(upgrade, index);;

  rightbar.appendChild(newUpgradeEl);
}