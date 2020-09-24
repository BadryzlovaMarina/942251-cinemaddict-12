import {createElement} from "../utils.js";

const createCardTemplate = (card) => {
  const MAX_DESCRIPTION_LENGTH = 140;
  const {poster, title, rating, release, genre, runTime, description, comments, isWatchlist, isHistory, isFavorite, id} = card;

  const getShortDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength - 1) + `...`;
    }
    return text;
  };

  const watchlistClassName = isWatchlist
    ? `film-card__controls-item--active`
    : ``;

  const watchedClassName = isHistory
    ? `film-card__controls-item--active`
    : ``;

  const favoriteClassName = isFavorite
    ? `film-card__controls-item--active`
    : ``;

  return (
    `<article class="film-card" data-id="${id}">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${release}</span>
        <span class="film-card__duration">${runTime}</span>
        <span class="film-card__genre">${genre.types[0]}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getShortDescription(description, MAX_DESCRIPTION_LENGTH)}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class Card {
  constructor(card) {
    this._card = card;
    this._element = null;
  }

  getTemplate() {
    return createCardTemplate(this._card);
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
