export class REAItem extends Item {
  /**
   * Define default options for the item sheet
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["rea", "sheet", "item"],
      template: "templates/item-sheet.html",
      width: 400,
      height: "auto",
      tabs: [{navSelector: ".tabs", contentSelector: ".sheet-body", initial: "details"}]
    });
  }

  /**
   * Activate listeners for interactive elements
   */
  activateListeners(html) {
    super.activateListeners(html);

    // Roll attack button
    html.find(".roll-attack").click(ev => this.rollAttack());
  }

 /**
 * Roll attack for a weapon item
 */
async rollAttack() {
  if (this.data.type !== "weapon") return ui.notifications.warn("This item cannot roll an attack.");

  const actor = this.actor;
  const formula = `1d20 + ${this.data.data.attack || 0}`;
  const roll = new Roll(formula).roll({async: false});
  roll.toMessage({
    speaker: ChatMessage.getSpeaker({actor}),
    flavor: `${this.name} Attack Roll`
  });
}

/**
 * Roll damage for a weapon item
 */
async rollDamage() {
  if (this.data.type !== "weapon") return ui.notifications.warn("This item cannot roll damage.");

  const actor = this.actor;
  const formula = this.data.data.damage || "1d6";
  const roll = new Roll(formula).roll({async: false});
  roll.toMessage({
    speaker: ChatMessage.getSpeaker({actor}),
    flavor: `${this.name} Damage Roll`
  });
}

async useItem() {
  const actor = this.actor;
  switch(this.data.type) {
    case "weapon":
      return this.rollAttack();
    case "consumable":
      const heal = this.data.data.effect || "1d4";
      const roll = new Roll(heal).roll({async: false});
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({actor}),
        flavor: `${actor.name} uses ${this.name} and heals`
      });
      return roll.total;

    case "spell":
      const spellDamage = this.data.data.damage || "1d6";
      const rollSpell = new Roll(spellDamage).roll({async: false});
      rollSpell.toMessage({
        speaker: ChatMessage.getSpeaker({actor}),
        flavor: `${actor.name} casts ${this.name}`
      });
      return rollSpell.total;

    default:
      ui.notifications.warn(`${this.name} cannot be used`);
  }
}
