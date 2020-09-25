import AbstractView from "./abstract.js";

const createCardСontainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class CardСontainer extends AbstractView {
  getTemplate() {
    return createCardСontainerTemplate();
  }
}
