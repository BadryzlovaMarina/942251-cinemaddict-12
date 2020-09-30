import CardView from "../view/card.js";
import CardDetailView from "../view/card-detail.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Movie {
  constructor(cardСontainer, changeData, changeMode) {
    this._cardСontainer = cardСontainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._cardDetailsComponent = null;
    this._mode = Mode.DEFAULT;

    this._clickHandler = this._clickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(card) {
    this._card = card;

    const prevCardComponent = this._cardComponent;
    const prevCardDetailsComponent = this._cardDetailsComponent;

    this._cardComponent = new CardView(card);
    this._cardDetailsComponent = new CardDetailView(card);

    this._cardComponent.setClickHandler(this._clickHandler);
    this._cardComponent.setWatchlistClickHandler(this._watchlistClickHandler);
    this._cardComponent.setWatchedClickHandler(this._watchedClickHandler);
    this._cardComponent.setFavoriteClickHandler(this._favoriteClickHandler);

    this._cardDetailsComponent.setWatchlistClickHandler(this._watchlistClickHandler);
    this._cardDetailsComponent.setWatchedClickHandler(this._watchedClickHandler);
    this._cardDetailsComponent.setFavoriteClickHandler(this._favoriteClickHandler);
    this._cardDetailsComponent.setCloseClickHandler(this._onCloseButtonClick);

    if (prevCardComponent === null || prevCardDetailsComponent === null) {
      render(this._cardСontainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    } else {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._cardDetailsComponent, prevCardDetailsComponent);
    }

    remove(prevCardComponent);
    remove(prevCardDetailsComponent);
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._cardDetailsComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _openPopup() {
    document.body.appendChild(this._cardDetailsComponent.getElement());

    this._cardDetailsComponent.setCloseClickHandler(this._onCloseButtonClick);
    document.addEventListener(`keydown`, this._escKeyDownHandler);

    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _closePopup() {
    document.querySelector(`.film-details`).remove();
    this._cardDetailsComponent.removeCloseHandlers();
    document.removeEventListener(`keydown`, this._escKeyDownHandler);

    this._mode = Mode.DEFAULT;
  }

  _clickHandler() {
    this._openPopup();
  }

  _onCloseButtonClick() {
    this._closePopup();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _watchlistClickHandler() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              isWatchlist: !this._card.isWatchlist
            }
        )
    );
  }

  _watchedClickHandler() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              isHistory: !this._card.isHistory
            }
        )
    );
  }

  _favoriteClickHandler() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              isFavorite: !this._card.isFavorite
            }
        )
    );
  }
}
