import {createElement} from "../utils.js";

const createGenreTemplate = (genres) => {
  return `<span class="film-details__genre">${genres}</span>`;
};

export default class CardGenre {
  constructor(genres) {
    this._genres = genres;
    this._element = null;
  }
  getTemplate() {
    return createGenreTemplate(this._genres);
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
