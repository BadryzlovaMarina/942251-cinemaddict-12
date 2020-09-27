import AbstractView from "./abstract.js";

const createStatisticsTemplate = (cards) => {
  return (
    `<p>${cards.length} movies inside</p>`
  );
};

export default class Statistics extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createStatisticsTemplate(this._cards);
  }
}
