export class REACombat extends Combat {
  async rollInitiative(ids, {formula, updateTurn = true} = {}) {
    formula ||= "1d20 + @agi"; // default initiative formula
    for (let id of ids) {
      const combatant = this.combatants.get(id);
      const actor = combatant.actor;
      const roll = new Roll(formula, { agi: actor.data.data.stats.agility }).roll({async: false});
      await combatant.update({ initiative: roll.total });
    }
    if (updateTurn) this.update({ turn: 0 });
  }
}
