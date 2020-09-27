import AbstractView from "./abstract.js";

const createCardListTemplate = () => {
  return (
    `<section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
    </section>`
  );
};

export default class CardList extends AbstractView {
  getTemplate() {
    return createCardListTemplate();
  }
}
