import {createUserProfileTemplate} from "./view/user-profile.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createCardListTemplate} from "./view/card-list.js";
import {createCardListExtraTemplate} from "./view/card-list-extra.js";
import {createCardTemplate} from "./view/card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createStatisticsTemplate} from "./view/statistics.js";
import {createFilmDetailsTemplate} from "./view/film-details.js";
import {createFilmCommentTemplate} from "./view/comment.js";
import {createGenreTemplate} from "./view/genre.js";
import {createGenreItemTemplate} from "./view/genre.js";
import {generateCard} from "./mock/card.js";

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

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserProfileTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, createFilterTemplate(countFilters(cards)), `beforeend`);
render(siteMainElement, createSortingTemplate(), `beforeend`);
render(siteMainElement, createCardListTemplate(), `beforeend`);

const cardBlockElement = siteMainElement.querySelector(`.films`);
const cardListElement = cardBlockElement.querySelector(`.films-list`);
const cardContainerElement = cardListElement.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(cards.length, CARD_COUNT_PER_STEP); i++) {
  render(cardContainerElement, createCardTemplate(cards[i]), `beforeend`);
}

if (cards.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  render(cardListElement, createShowMoreButtonTemplate(), `beforeend`);

  const showMoreButton = cardListElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    cards
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((card) => render(cardContainerElement, createCardTemplate(card), `beforeend`));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= cards.length) {
      showMoreButton.remove();
    }
  });
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
  render(cardBlockElement, createCardListExtraTemplate(title[i]), `beforeend`);
}

const cardExtraRated = cardBlockElement.querySelector(`.films-list--extra`);
const cardExtraContainerRated = cardExtraRated.querySelector(`.films-list__container`);

for (const item of generateTopRatedCards(cards)) {
  render(cardExtraContainerRated, createCardTemplate(item), `beforeend`);
}

const cardExtraCommented = cardBlockElement.querySelector(`.films-list--extra:last-child`);
const cardExtraContainerCommented = cardExtraCommented.querySelector(`.films-list__container`);

for (const item of generateMostCommentedCards(cards)) {
  render(cardExtraContainerCommented, createCardTemplate(item), `beforeend`);
}

const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = document.querySelector(`.footer__statistics`);

render(statisticsElement, createStatisticsTemplate(cards), `beforeend`);

const getPopup = () => document.querySelector(`.film-details`);

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

const closePopup = () => {
  if (getPopup()) {
    getPopup().remove();
  }

  document.removeEventListener(`keydown`, onEscPress);
  document.removeEventListener(`click`, onCloseButtonClick);
};

const openPopup = (currentFilm) => {
  render(siteFooterElement, createFilmDetailsTemplate(currentFilm), `afterend`);

  const cardCommentListElement = document.querySelector(`.film-details__comments-list`);
  const cardTableElement = document.querySelector(`.film-details__table`);

  currentFilm.comments.forEach((card) => render(cardCommentListElement, createFilmCommentTemplate(card), `beforeend`));

  render(cardTableElement, createGenreTemplate(currentFilm), `beforeend`);

  const cardTableRows = cardTableElement.querySelectorAll(`.film-details__row`);
  const cardGenreRow = cardTableRows[cardTableRows.length - 1];

  currentFilm.genre.types.forEach((card) => render(cardGenreRow.querySelector(`.film-details__cell`), createGenreItemTemplate(card), `beforeend`));

  document.addEventListener(`keydown`, onEscPress);
  document.addEventListener(`click`, onCloseButtonClick);
};

const cardClickHandler = (evt) => {
  if (evt.target.classList.contains(`film-card__poster`) || evt.target.classList.contains(`film-card__title`) || evt.target.classList.contains(`film-card__comments`)) {
    closePopup();
    openPopup(cards[0]);
  }
};

cardBlockElement.addEventListener(`click`, cardClickHandler);
