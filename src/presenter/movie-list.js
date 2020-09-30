import BoardView from "../view/board.js";
import SortingView from "../view/sorting.js";
import CardListView from "../view/card-list.js";
import CardСontainerView from "../view/card-container.js";
import CardListExtraView from "../view/card-list-extra.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import NoDataView from "../view/no-data.js";
import MoviePresenter from "./movie.js";
import {updateItem} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortCardDate, sortCardRating, sortByComments} from "../utils/card.js";
import {SortType} from "../const.js";

const CARD_COUNT_PER_STEP = 5;
const CARD_EXTRA_COUNT = 2;

const ExtraTitle = {
  TOP_RATED: `Top rated`,
  MOST_COMMENTED: `Most commented`,
};

export default class MovieList {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedCardCount = CARD_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._moviePresenter = {};

    this._boardComponent = new BoardView();
    this._sortComponent = new SortingView();
    this._cardListComponent = new CardListView();
    this._cardСontainerComponent = new CardСontainerView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._topRatedComponent = new CardListExtraView(ExtraTitle.TOP_RATED);
    this._mostCommentedComponent = new CardListExtraView(ExtraTitle.MOST_COMMENTED);
    this._noDataComponent = new NoDataView();

    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handlerShowMoreButtonClick = this._handlerShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._cardPresenterTopRatedList = {};
    this._cardPresenterMostCommentedList = {};
    this._sortedByRatings = {};
    this._sortedByComments = {};
  }

  init(cards) {
    this._cards = cards.slice();
    this._sourcedCards = cards.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModeChange() {
    [
      ...Object.values(this._moviePresenter),
      ...Object.values(this._cardPresenterTopRatedList),
      ...Object.values(this._cardPresenterMostCommentedList)
    ].forEach((presenter) => presenter.resetView());
  }

  _handleCardChange(updatedCard) {
    this._cards = updateItem(this._cards, updatedCard);
    this._sourcedCards = updateItem(this._sourcedCards, updatedCard);

    if (this._moviePresenter[updatedCard.id] !== undefined) {
      this._moviePresenter[updatedCard.id].init(updatedCard);
    }

    if (this._cardPresenterTopRatedList[updatedCard.id] !== undefined) {
      this._cardPresenterTopRatedList[updatedCard.id].init(updatedCard);
    }
    if (this._cardPresenterMostCommentedList[updatedCard.id] !== undefined) {
      this._cardPresenterMostCommentedList[updatedCard.id].init(updatedCard);
    }
  }

  _sortCards(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._cards.sort(sortCardDate);
        break;
      case SortType.RATING:
        this._cards.sort(sortCardRating);
        break;
      default:
        this._cards = this._sourcedCards.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortCards(sortType);
    this._clearCardList();
    this._renderCardList();
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderCard(cardСontainer, card) {
    const moviePresenter = new MoviePresenter(cardСontainer, this._handleCardChange, this._handleModeChange);
    moviePresenter.init(card);
    this._moviePresenter[card.id] = moviePresenter;
  }

  _generateTopRatedCards(container, movieCard) {
    const cardPresenterTopRatedList = new MoviePresenter(container, this._handleCardChange, this._handleModeChange);
    cardPresenterTopRatedList.init(movieCard);
    this._cardPresenterTopRatedList[movieCard.id] = cardPresenterTopRatedList;
  }

  _generateMostCommentedCards(container, movieCard) {
    const cardPresenterMostCommentedList = new MoviePresenter(container, this._handleCardChange, this._handleModeChange);
    cardPresenterMostCommentedList.init(movieCard);
    this._cardPresenterMostCommentedList[movieCard.id] = cardPresenterMostCommentedList;
  }

  _renderCards(from, to) {
    this._cards
      .slice(from, to)
      .forEach((card) => this._renderCard(this._cardСontainerComponent, card));
  }

  _renderNoData() {
    render(this._boardComponent, this._noDataComponent, RenderPosition.BEFOREEND);
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

  _clearCardList() {
    Object
      .values(this._moviePresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviePresenter = {};
    this._renderedCardCount = CARD_COUNT_PER_STEP;
  }

  _renderCardList() {
    render(this._cardListComponent, this._cardСontainerComponent, RenderPosition.BEFOREEND);
    this._renderCards(0, Math.min(this._cards.length, CARD_COUNT_PER_STEP));

    if (this._cards.length > CARD_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderTopRatedCardList() {
    render(this._boardComponent, this._topRatedComponent, RenderPosition.BEFOREEND);

    const topRatedListElement = this._topRatedComponent.getContainerElement();

    this._sortedByRatings = this._sourcedCards.slice().sort(sortCardRating);

    for (let i = 0; i < CARD_EXTRA_COUNT; i++) {
      this._generateTopRatedCards(topRatedListElement, this._sortedByRatings[i]);
    }
  }

  _renderMostCommentedCardList() {
    render(this._boardComponent, this._mostCommentedComponent, RenderPosition.BEFOREEND);

    const commentedCardsListElement = this._mostCommentedComponent.getContainerElement();

    this._sortedByComments = this._sourcedCards.slice().sort(sortByComments);

    for (let i = 0; i < CARD_EXTRA_COUNT; i++) {
      this._generateMostCommentedCards(commentedCardsListElement, this._sortedByComments[i]);
    }
  }

  _renderBoard() {
    this._renderSort();

    const cardsLength = this._cards.length;
    if (cardsLength <= 0) {
      this._renderNoData();
      return;
    }

    render(this._boardComponent, this._cardListComponent, RenderPosition.AFTERBEGIN);
    this._renderCardList();
    this._renderTopRatedCardList();
    this._renderMostCommentedCardList();
  }
}
