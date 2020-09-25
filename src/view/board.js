import AbstractView from "./abstract.js";

const createBoardTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class Board extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createBoardTemplate();
  }

  _clickHandler(evt) {
    this._callback.click(evt);
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
