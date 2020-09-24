import {createElement} from "../utils.js";

const createCardСontainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class CardСontainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCardСontainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
