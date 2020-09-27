import AbstractView from "./abstract.js";

const createCardListExtraTemplate = (title) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container"></div>
    </section>`
  );
};

export default class CardListExtra extends AbstractView {
  constructor(title) {
    super();
    this._title = title;
  }

  getTemplate() {
    return createCardListExtraTemplate(this._title);
  }

  getContainerElement() {
    return this.getElement().querySelector(`.films-list--extra .films-list__container`);
  }
}
