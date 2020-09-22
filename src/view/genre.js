export const createGenreTemplate = (card) => {
  const {genre} = card;
  return `<tr class="film-details__row">
    <td class="film-details__term">${genre.title}</td>
    <td class="film-details__cell"></td>
    </tr>`;
};

export const createGenreItemTemplate = (genre) => {
  return `<span class="film-details__genre">${genre}</span>`;
};
