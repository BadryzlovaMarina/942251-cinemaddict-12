import UserProfileView from "./view/user-profile.js";
import FilterView from "./view/filter.js";
import SortingView from "./view/sorting.js";
import BoardView from "./view/board.js";
import CardListView from "./view/card-list.js";
import CardСontainerView from "./view/card-container.js";
import CardListExtraView from "./view/card-list-extra.js";
import CardView from "./view/card.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import StatisticsView from "./view/statistics.js";
import CardDetailsView from "./view/film-details.js";
import CardCommentView from "./view/comment.js";
import CardGenreView from "./view/genre.js";
import {generateCard} from "./mock/card.js";
import {render, RenderPosition} from "./utils.js";

const ESC_KEYCODE = 27;
const CARD_COUNT = 16;
const CARD_COUNT_PER_STEP = 5;
const CARD_EXTRA_BLOCK_COUNT = 2;
const TOP_RATED = 2;
const MOST_COMMENTED = 2;

const cards = new Array(CARD_COUNT).fill().map(generateCard);

const countFilters = (added) => {
  const filterList = {
    watchlist: added.filter((index) => index.isWatchlist === true),
    history: added.filter((index) => index.isHistory === true),
    favorites: added.filter((index) => index.isFavorite === true),
  };
  return filterList;
};

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new UserProfileView().getElement(), RenderPosition.BEFOREEND);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, new FilterView(countFilters(cards)).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortingView().getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardView();
const cardListComponent = new CardListView();
const cardСontainerComponent = new CardСontainerView();

render(siteMainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
render(boardComponent.getElement(), cardListComponent.getElement(), RenderPosition.AFTERBEGIN);
render(cardListComponent.getElement(), cardСontainerComponent.getElement(), RenderPosition.BEFOREEND);

const renderCard = (cardListElement, card) => {
  const cardComponent = new CardView(card);

  render(cardListElement, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

for (let i = 0; i < Math.min(cards.length, CARD_COUNT_PER_STEP); i++) {
  renderCard(cardСontainerComponent.getElement(), cards[i]);
}

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
  render(boardComponent.getElement(), new CardListExtraView(title[i]).getElement(), RenderPosition.BEFOREEND);
}

const cardExtraRated = document.querySelector(`.films-list--extra`);
const cardExtraContainerRated = cardExtraRated.querySelector(`.films-list__container`);

for (const item of generateTopRatedCards(cards)) {
  render(cardExtraContainerRated, new CardView(item).getElement(), RenderPosition.BEFOREEND);
}

const cardExtraCommented = document.querySelector(`.films-list--extra:last-child`);
const cardExtraContainerCommented = cardExtraCommented.querySelector(`.films-list__container`);

for (const item of generateMostCommentedCards(cards)) {
  render(cardExtraContainerCommented, new CardView(item).getElement(), RenderPosition.BEFOREEND);
}

const statisticsElement = document.querySelector(`.footer__statistics`);

render(statisticsElement, new StatisticsView(cards).getElement(), RenderPosition.BEFOREEND);

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

const bodyTag = document.querySelector(`body`);

const closePopup = function () {

  const popup = document.querySelector(`.film-details`);
  if (popup) {
    bodyTag.removeChild(popup);
  }

  document.removeEventListener(`keydown`, onEscPress);
  document.removeEventListener(`click`, onCloseButtonClick);
};

const openPopup = (currentFilm) => {
  const CardDetailsComponent = new CardDetailsView(currentFilm);

  bodyTag.appendChild(CardDetailsComponent.getElement());

  const cardGenreTable = CardDetailsComponent.getElement().querySelector(`.film-details__table tbody`);
  const cardTableRows = cardGenreTable.querySelectorAll(`.film-details__row`);
  const cardGenreRow = cardTableRows[cardTableRows.length - 1];

  currentFilm.genre.types.forEach((card) => render(cardGenreRow.querySelector(`.film-details__cell`), new CardGenreView(card).getElement(), RenderPosition.BEFOREEND));

  const cardCommentListElement = CardDetailsComponent.getElement().querySelector(`.film-details__comments-list`);

  currentFilm.comments.forEach((card) => render(cardCommentListElement, new CardCommentView(card).getElement(), RenderPosition.BEFOREEND));

  document.addEventListener(`keydown`, onEscPress);
  document.addEventListener(`click`, onCloseButtonClick);
};

const findCard = (id) => {
  const cardPopup = cards.find((card) => card.id === Number(id));
  return cardPopup;
};

const cardClickHandler = (evt) => {
  if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
    const popupId = event.target.parentNode.dataset.id;
    const currentCard = findCard(popupId);
    openPopup(currentCard);
  }
};

boardComponent.getElement().addEventListener(`click`, cardClickHandler);

if (cards.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();

  render(cardListComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    cards
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((card) => renderCard(cardСontainerComponent.getElement(), card));
    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= cards.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}
