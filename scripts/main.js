Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

import { REAActor } from "./actor.js";
import { REAItem } from "./item.js";
import { registerDiceMechanics } from "./dice.js";
import { REACombat } from "./combat.js";

Hooks.once("init", async function () {
  console.log("REA | Initializing REA system");

  // Register Actor and Item classes
  CONFIG.Actor.documentClass = REAActor;
  CONFIG.Item.documentClass = REAItem;

  // Register Dice Mechanics
  registerDiceMechanics();

  // Register custom combat class
  CONFIG.Combat.documentClass = REACombat;
});

Hooks.once("ready", async function () {
  console.log("REA | System ready");
});
