import {createUserProfileTemplate} from "./view/user-profile.js";
import {createNavTemplate} from "./view/nav.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createCardListTemplate} from "./view/card-list.js";
import {createCardListExtraTemplate} from "./view/card-list-extra.js";
import {createCardTemplate} from "./view/card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createStatisticsTemplate} from "./view/statistics.js";
import {createFilmDetailsTemplate} from "./view/film-details.js";

const CARD_COUNT = 5;
const CARD_EXTRA_BLOCK_COUNT = 2;
const CARD_EXTRA_COUNT = 2;
const CARD_EXTRA_TITLES = [`Top rated`, `Most commented`];

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserProfileTemplate(), `beforeend`);

const siteMainElement = document.querySelector(`.main`);

render(siteMainElement, createNavTemplate(), `beforeend`);
render(siteMainElement, createSortingTemplate(), `beforeend`);
render(siteMainElement, createCardListTemplate(), `beforeend`);

const cardBlockElement = siteMainElement.querySelector(`.films`);
const cardListElement = cardBlockElement.querySelector(`.films-list`);
const cardContainerElement = cardListElement.querySelector(`.films-list__container`);

for (let i = 0; i < CARD_COUNT; i++) {
  render(cardContainerElement, createCardTemplate(), `beforeend`);
}

render(cardListElement, createShowMoreButtonTemplate(), `beforeend`);

for (let i = 0; i < CARD_EXTRA_BLOCK_COUNT; i++) {
  render(cardBlockElement, createCardListExtraTemplate(), `beforeend`);

  const cardExtraListElement = cardBlockElement.querySelectorAll(`.films-list--extra`);
  const cardExtraBlockElement = cardExtraListElement[i];
  const cardExtraTitle = cardExtraBlockElement.querySelector(`.films-list__title`);
  const cardExtraContainerElement = cardExtraBlockElement.querySelector(`.films-list__container`);

  cardExtraTitle.textContent = CARD_EXTRA_TITLES[i];

  for (let j = 0; j < CARD_EXTRA_COUNT; j++) {
    render(cardExtraContainerElement, createCardTemplate(), `beforeend`);
  }
}

const siteFooterElement = document.querySelector(`.footer`);
const statisticsElement = document.querySelector(`.footer__statistics`);

render(statisticsElement, createStatisticsTemplate(), `beforeend`);

render(siteFooterElement, createFilmDetailsTemplate(), `afterend`);

const popupElement = document.body.querySelector(`.film-details`);
popupElement.style.display = `none`;
