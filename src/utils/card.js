export const humanizeCommentDate = (dueDate) => {
  return dueDate.toLocaleString(`en-US`, {year: `numeric`, month: `numeric`, day: `numeric`, hour: `numeric`, minute: `numeric`, hour12: false});
};

export const sortCardDate = (cardA, cardB) => {
  return cardB.release - cardA.release;
};

export const sortCardRating = (cardA, cardB) => {
  return cardB.rating - cardA.rating;
};
