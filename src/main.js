import UserProfileView from "./view/user-profile.js";
import FilterView from "./view/filter.js";
import SortingView from "./view/sorting.js";
import StatisticsView from "./view/statistics.js";
import {generateCard} from "./mock/card.js";
import MovieListPresenter from "./presenter/movie-list.js";
import {render, RenderPosition} from "./utils/render.js";

const CARD_COUNT = 16;

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
const siteMainElement = document.querySelector(`.main`);
const statisticsElement = document.querySelector(`.footer__statistics`);

render(siteHeaderElement, new UserProfileView(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(countFilters(cards)), RenderPosition.BEFOREEND);
render(siteMainElement, new SortingView(), RenderPosition.BEFOREEND);
render(statisticsElement, new StatisticsView(cards), RenderPosition.BEFOREEND);

new MovieListPresenter(siteMainElement).init(cards);
