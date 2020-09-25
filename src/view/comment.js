import {getCommentDate, createElement} from "../utils.js";

const createCardCommentTemplate = (card) => {
  const {text, author, date, emoji} = card;

  const commentDate = date !== null
    ? getCommentDate(date)
    : ` `;

  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="${emoji}" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${commentDate}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};

export default class CardComment {
  constructor(card) {
    this._card = card;
    this._element = null;
  }
  getTemplate() {
    return createCardCommentTemplate(this._card);
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
