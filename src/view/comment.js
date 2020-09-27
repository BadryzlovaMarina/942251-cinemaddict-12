import AbstractView from "./abstract.js";
import {humanizeCommentDate} from "../utils/card.js";

const createCardCommentTemplate = (card) => {
  const {text, author, date, emoji} = card;

  const commentDate = date !== null
    ? humanizeCommentDate(date)
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

export default class CardComment extends AbstractView {
  constructor(card) {
    super();
    this._card = card;
  }
  getTemplate() {
    return createCardCommentTemplate(this._card);
  }
}
