export class REAActor extends Actor {
  prepareData() {
    super.prepareData();

    const actorData = this.data;

    // Example: calculate derived stats
    actorData.data.health.max = actorData.data.stats.stamina * 10;
    actorData.data.health.current = Math.min(actorData.data.health.current, actorData.data.health.max);
  }

  // Custom roll example
  async rollSkill(skillName) {
    const skill = this.data.data.skills[skillName];
    if (!skill) return ui.notifications.error(`Skill ${skillName} not found`);

    const roll = new Roll("1d20 + @mod", { mod: skill.mod }).roll({async: false});
    roll.toMessage({speaker: ChatMessage.getSpeaker({actor: this})});
    return roll.total;
  }
  /**
 * Roll a skill check
 * @param {string} skillName - Name of the skill to roll
 */
async rollSkill(skillName, bonus = 0) {
  const skill = this.data.data.skills[skillName];
  if (!skill) return ui.notifications.error(`Skill "${skillName}" not found`);

  const formula = `1d20 + ${skill.mod || 0} + ${bonus}`;
  const roll = new Roll(formula).roll({async: false});
  roll.toMessage({
    speaker: ChatMessage.getSpeaker({actor: this}),
    flavor: `${this.name} rolls ${skillName} ${bonus !== 0 ? `(Modifier: ${bonus})` : ""}`
  });
  return roll.total;
}


/**
 * Roll an attack with a weapon from the actor's inventory
 * @param {string} itemId - ID of the weapon item
 */
async rollWeaponAttack(itemId) {
  const item = this.items.get(itemId);
  if (!item || item.data.type !== "weapon") {
    return ui.notifications.warn("Invalid weapon item for attack.");
  }

  const formula = `1d20 + ${item.data.data.attack || 0}`;
  const roll = new Roll(formula).roll({async: false});

  // Check for critical and fumble
  const d20 = roll.terms[0].results[0].result; // first die in roll
  let flavor = `${this.name} attacks with ${item.name}`;

  if (d20 === 20) flavor += " (Critical Hit!)";
  else if (d20 === 1) flavor += " (Fumble!)";

  roll.toMessage({
    speaker: ChatMessage.getSpeaker({actor: this}),
    flavor: flavor
  });

  return roll.total;
}


/**
 * Roll damage for a weapon item
 * @param {string} itemId - ID of the weapon item
 */
async rollWeaponDamage(itemId, bonus = 0) {
  const item = this.items.get(itemId);
  if (!item || item.data.type !== "weapon") return ui.notifications.warn("Invalid weapon item for damage roll.");

  const formula = `${item.data.data.damage || "1d6"} + ${bonus}`;
  const roll = new Roll(formula).roll({async: false});
  roll.toMessage({
    speaker: ChatMessage.getSpeaker({actor: this}),
    flavor: `${this.name} deals damage with ${item.name} ${bonus !== 0 ? `(Modifier: ${bonus})` : ""}`
  });

  return roll.total;
}

