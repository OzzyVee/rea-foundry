export function registerDiceMechanics() {
  // Example: add a custom dice roll flavor
  CONFIG.Dice.terms["REA"] = class READice extends Die {
    constructor(termData) {
      super(termData);
    }

    evaluate({ minimize = false, maximize = false } = {}) {
      super.evaluate({ minimize, maximize });
      this.total = this.total + 2; // example: +2 bonus on all rolls
      return this.total;
    }
  };
  console.log("REA | Custom dice registered");
}
