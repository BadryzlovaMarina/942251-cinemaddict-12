import AbstractView from "./abstract.js";

const createGenreTemplate = (genres) => {
  return `<span class="film-details__genre">${genres}</span>`;
};

export default class CardGenre extends AbstractView {
  constructor(genres) {
    super();
    this._genres = genres;
  }
  getTemplate() {
    return createGenreTemplate(this._genres);
  }
}
