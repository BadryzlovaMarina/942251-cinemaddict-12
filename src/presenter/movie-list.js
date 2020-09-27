import BoardView from "../view/board.js";
import CardListView from "../view/card-list.js";
import CardСontainerView from "../view/card-container.js";
import CardListExtraView from "../view/card-list-extra.js";
import CardView from "../view/card.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import CardDetailView from "../view/card-detail.js";
import NoDataView from "../view/no-data.js";
import Abstract from "../view/abstract.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const ESC_KEYCODE = 27;
const CARD_COUNT_PER_STEP = 5;
const TOP_RATED = 2;
const MOST_COMMENTED = 2;

const ExtraTitle = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`,
};

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedCardCount = CARD_COUNT_PER_STEP;

    this._boardComponent = new BoardView();
    this._cardListComponent = new CardListView();
    this._cardСontainerComponent = new CardСontainerView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._topRatedComponent = new CardListExtraView(ExtraTitle.TOP_RATED);
    this._mostCommentedComponent = new CardListExtraView(ExtraTitle.MOST_COMMENTED);
    this._noDataComponent = new NoDataView();

    this._handlerShowMoreButtonClick = this._handlerShowMoreButtonClick.bind(this);
  }

  init(cards) {
    this._cards = cards.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderMovies();
  }

  _renderCard(cardСontainer, card) {
    if (cardСontainer instanceof Abstract) {
      cardСontainer = cardСontainer.getElement();
    }

    const cardComponent = new CardView(card);
    const cardDetailsComponent = new CardDetailView(card);

    const onEscKeyDown = (evt) => {
      if (evt.keyCode === ESC_KEYCODE) {
        evt.preventDefault();
        closePopup();
      }
    };

    const closePopup = () => {
      document.querySelector(`.film-details`).remove();
      cardDetailsComponent.removeCloseHandlers();
    };

    const openPopup = () => {
      document.body.appendChild(cardDetailsComponent.getElement());

      cardDetailsComponent.setCloseClickHandler(closePopup);
      cardDetailsComponent.setKeydownHandler(onEscKeyDown);
    };

    cardComponent.setClickHandler(openPopup);
    render(cardСontainer, cardComponent, RenderPosition.BEFOREEND);
  }

  _renderCards(from, to) {
    this._cards
      .slice(from, to)
      .forEach((card) => this._renderCard(this._cardСontainerComponent, card));
  }

  _handlerShowMoreButtonClick() {
    this._renderCards(this._renderedCardCount, this._renderedCardCount + CARD_COUNT_PER_STEP);
    this._renderedCardCount += CARD_COUNT_PER_STEP;

    if (this._renderedCardCount >= this._cards.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._cardListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handlerShowMoreButtonClick);
  }

  _renderCardList() {
    this._renderCards(0, Math.min(this._cards.length, CARD_COUNT_PER_STEP));

    if (this._cards.length > CARD_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderBoard() {
    render(this._boardComponent, this._cardListComponent, RenderPosition.AFTERBEGIN);
    render(this._cardListComponent, this._cardСontainerComponent, RenderPosition.BEFOREEND);
    this._renderCardList();
  }

  _renderExtraCards(container, cards) {
    cards.forEach((card) => {
      this._renderCard(container, card);
    });
  }

  _renderExtraCardList() {
    const generateTopRatedCards = (item) => {
      return item
      .slice()
      .sort((a, b) => b.rating - a.rating)
      .slice(0, TOP_RATED);
    };

    render(this._boardComponent, this._topRatedComponent, RenderPosition.BEFOREEND);

    const topFilms = generateTopRatedCards(this._cards);
    this._renderExtraCards(this._topRatedComponent.getContainerElement(), topFilms);

    const generateMostCommentedCards = (item) => {
      return item
      .slice()
      .sort((a, b) => a.comments.length > b.comments.length ? -1 : 1)
      .slice(0, MOST_COMMENTED);
    };

    render(this._boardComponent, this._mostCommentedComponent, RenderPosition.BEFOREEND);

    const commentedFilms = generateMostCommentedCards(this._cards);

    this._renderExtraCards(this._mostCommentedComponent.getContainerElement(), commentedFilms);
  }

  _renderNoData() {
    render(this._boardComponent, this._noDataComponent, RenderPosition.BEFOREEND);
  }

  _renderMovies() {
    const cardsLength = this._cards.length;
    if (cardsLength <= 0) {
      this._renderNoData();
      return;
    }

    this._renderBoard();
    this._renderExtraCardList();
  }
}
