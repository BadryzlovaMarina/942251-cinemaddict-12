import SmartView from "./smart.js";
import CardCommentView from "../view/comment.js";
import CardGenreView from "../view/genre.js";
import {RenderPosition, render, createElement} from "../utils/render.js";
import {EMOJIES} from '../const.js';

const getEmoji = (currentEmoji) => {
  return EMOJIES.map((emoji) =>`<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji.split(`.`)[0]}" value="${emoji.split(`.`)[0]}" ${emoji.split(`.`)[0] === currentEmoji ? `checked` : ``}>
  <label class="film-details__emoji-label" for="emoji-${emoji.split(`.`)[0]}">
    <img src="./images/emoji/${emoji}" width="30" height="30" alt="emoji" data-emoji="${emoji.split(`.`)[0]}">
  </label>
  `).join(``);
};

const insertChosenEmoji = (chosenEmoji) => {
  return `<img src="./images/emoji/${chosenEmoji}.png" width="55" height="55" alt="emoji">`;
};

const createCardDetailsTemplate = (data, emoji) => {
  const {poster, title, rating, director, writers, actors, release, runTime, country, genre, description, comments, isWatchlist, isHistory, isFavorite} = data;

  const emojiTemplate = getEmoji(emoji);

  const watchlistClassName = isWatchlist
    ? `checked`
    : ``;

  const watchedClassName = isHistory
    ? `checked`
    : ``;

  const favoriteClassName = isFavorite
    ? `checked`
    : ``;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">
              <p class="film-details__age">${genre.age}</p>
            </div>
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${title}</p>
                </div>
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${release}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runTime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.title}</td>
                  <td class="film-details__cell"></td>
                </tr>
              </table>
              <p class="film-details__film-description">
                ${description}.
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistClassName}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedClassName}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteClassName}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
            <ul class="film-details__comments-list">
            </ul>
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">
                ${emoji ? `${insertChosenEmoji(emoji)}` : ``}
              </div>
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
              <div class="film-details__emoji-list">
                ${emojiTemplate}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class CardDetails extends SmartView {
  constructor(data) {
    super();
    this._data = data;
    this._emoji = null;
    this._data = CardDetails.parseCardToData(data);

    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._onEmojiClick = this._onEmojiClick.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createCardDetailsTemplate(this._data, this._emoji);
  }

  reset(card) {
    this.updateData(
        CardDetails.parseCardToData(card)
    );
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll(`.film-details__emoji-label`).forEach((emoji) => emoji.addEventListener(`click`, this._onEmojiClick));
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setCloseClickHandler(this._callback.click);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
      this._renderGenre(this._element);
      this._renderComments(this._element);
    }
    return this._element;
  }

  _renderGenre(element) {
    this._filmGenreTable = element.querySelector(`.film-details__table tbody`);
    this._filmTableRows = this._filmGenreTable.querySelectorAll(`.film-details__row`);
    this._filmGenreRow = this._filmTableRows[this._filmTableRows.length - 1];

    this._data.genre.types.forEach((genre) => render(this._filmGenreRow.querySelector(`.film-details__cell`), new CardGenreView(genre), RenderPosition.BEFOREEND));
  }

  _renderComments(element) {
    this._filmPopupCommentList = element.querySelector(`.film-details__comments-list`);

    this._data.comments.forEach((comment) => render(this._filmPopupCommentList, new CardCommentView(comment), RenderPosition.BEFOREEND));
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    this._callback.click(CardDetails.parseDataTocard(this._data));
  }

  setCloseClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._onCloseButtonClick);
  }

  removeCloseHandlers() {
    this._callback.click = null;
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, this._onCloseButtonClick);
  }

  _chosenEmoji(emoji) {
    this._emoji = emoji;
  }

  _onEmojiClick(evt) {
    evt.preventDefault();
    this._chosenEmoji(evt.target.dataset.emoji);
    this.updateData(this._data);
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick(CardDetails.parseDataTocard(this._data));
    this.updateData({
      isWatchlist: !this._data.isWatchlist
    });
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick(CardDetails.parseDataTocard(this._data));
    this.updateData({
      isHistory: !this._data.isHistory
    });
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick(CardDetails.parseDataTocard(this._data));
    this.updateData({
      isFavorite: !this._data.isFavorite
    });
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._watchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  static parseCardToData(card) {
    return Object.assign(
        {},
        card,
        {
          isWatchlist: card.isWatchlist,
          isHistory: card.isHistory,
          isFavorite: card.isFavorite
        }
    );
  }

  static parseDataTocard(data) {
    data = Object.assign({}, data);

    delete data.isWatchlist;
    delete data.isHistory;
    delete data.isFavorite;

    return data;
  }
}
