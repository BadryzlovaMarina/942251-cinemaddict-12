import BoardView from "../view/board.js";
import CardListView from "../view/card-list.js";
import CardСontainerView from "../view/card-container.js";
import CardListExtraView from "../view/card-list-extra.js";
import CardView from "../view/card.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import CardDetailView from "../view/card-detail.js";
import CardCommentView from "../view/comment.js";
import CardGenreView from "../view/genre.js";
import Abstract from "../view/abstract.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const ESC_KEYCODE = 27;
const CARD_COUNT_PER_STEP = 5;
const CARD_EXTRA_BLOCK_COUNT = 2;
const TOP_RATED = 2;
const MOST_COMMENTED = 2;

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedCardCount = CARD_COUNT_PER_STEP;

    this._boardComponent = new BoardView();
    this._cardListComponent = new CardListView();
    this._cardСontainerComponent = new CardСontainerView();

    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handlerShowMoreButtonClick = this._handlerShowMoreButtonClick.bind(this);
  }

  init(boardCards) {
    this._boardCards = boardCards.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._cardListComponent, RenderPosition.AFTERBEGIN);
    render(this._cardListComponent, this._cardСontainerComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
    this._renderExtraCardList();
    this._renderPopupCard();
  }

  _renderCard(cardСontainer, card) {
    if (cardСontainer instanceof Abstract) {
      cardСontainer = cardСontainer.getElement();
    }

    const cardComponent = new CardView(card);
    render(cardСontainer, cardComponent, RenderPosition.BEFOREEND);
  }

  _renderCards(from, to) {
    this._boardCards
      .slice(from, to)
      .forEach((boardCard) => this._renderCard(this._cardСontainerComponent, boardCard));
  }

  _handlerShowMoreButtonClick() {
    this._renderCards(this._renderedCardCount, this._renderedCardCount + CARD_COUNT_PER_STEP);
    this._renderedCardCount += CARD_COUNT_PER_STEP;

    if (this._renderedCardCount >= this._boardCards.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._cardListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handlerShowMoreButtonClick);
  }

  _renderCardList() {
    this._renderCards(0, Math.min(this._boardCards.length, CARD_COUNT_PER_STEP));

    if (this._boardCards.length > CARD_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderBoard() {
    this._renderCardList();
  }

  _renderPopupCard() {
    const onEscPress = (evt) => {
      if (evt.keyCode === ESC_KEYCODE) {
        closePopup();
      }
    };

    const onCloseButtonClick = (evt) => {
      if (evt.target.classList.contains(`film-details__close-btn`)) {
        closePopup();
      }
    };

    this._bodyTag = document.querySelector(`body`);

    const closePopup = () => {

      this._popup = document.querySelector(`.film-details`);
      if (this._popup) {
        this._bodyTag.removeChild(this._popup);
      }

      document.removeEventListener(`keydown`, onEscPress);
      document.removeEventListener(`click`, onCloseButtonClick);
    };

    const openPopup = (currentFilm) => {
      this._cardDetailsComponent = new CardDetailView(currentFilm);

      this._bodyTag.appendChild(this._cardDetailsComponent.getElement());

      this._cardGenreTable = this._cardDetailsComponent.getElement().querySelector(`.film-details__table tbody`);
      this._cardTableRows = this._cardGenreTable.querySelectorAll(`.film-details__row`);
      this._cardGenreRow = this._cardTableRows[this._cardTableRows.length - 1];

      currentFilm.genre.types.forEach((card) => render(this._cardGenreRow.querySelector(`.film-details__cell`), new CardGenreView(card), RenderPosition.BEFOREEND));

      this._cardCommentListElement = this._cardDetailsComponent.getElement().querySelector(`.film-details__comments-list`);

      currentFilm.comments.forEach((card) => render(this._cardCommentListElement, new CardCommentView(card), RenderPosition.BEFOREEND));

      document.addEventListener(`keydown`, onEscPress);
      document.addEventListener(`click`, onCloseButtonClick);
    };

    const findCard = (id) => {
      this._cardPopup = this._boardCards.find((card) => card.id === Number(id));
      return this._cardPopup;
    };

    const cardClickHandler = (evt) => {
      if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
        this._popupId = evt.target.parentNode.dataset.id;
        this._currentCard = findCard(this._popupId);
        openPopup(this._currentCard);
      }
    };

    this._boardComponent.setClickHandler(cardClickHandler);
  }

  _renderExtraCardList() {
    const generateTopRatedCards = (item) => {
      return item
      .slice()
      .sort((a, b) => a.rating > b.rating ? -1 : 1)
      .slice(0, TOP_RATED);
    };

    const generateMostCommentedCards = (item) => {
      return item
      .slice()
      .sort((a, b) => a.comments.length > b.comments.length ? -1 : 1)
      .slice(0, MOST_COMMENTED);
    };

    for (let i = 0; i < CARD_EXTRA_BLOCK_COUNT; i++) {
      const title = [`Top rated`, `Most commented`];
      render(this._boardComponent, new CardListExtraView(title[i]), RenderPosition.BEFOREEND);
    }

    this._cardExtraRated = document.querySelector(`.films-list--extra`);
    this._cardExtraContainerRated = this._cardExtraRated.querySelector(`.films-list__container`);

    for (const item of generateTopRatedCards(this._boardCards)) {
      render(this._cardExtraContainerRated, new CardView(item), RenderPosition.BEFOREEND);
    }

    this._cardExtraCommented = document.querySelector(`.films-list--extra:last-child`);
    this._cardExtraContainerCommented = this._cardExtraCommented.querySelector(`.films-list__container`);

    for (const item of generateMostCommentedCards(this._boardCards)) {
      render(this._cardExtraContainerCommented, new CardView(item), RenderPosition.BEFOREEND);
    }
  }
}
