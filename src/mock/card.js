import {getRandomInteger, getRandomNumber, shuffleArray, getRandomItem, uniqueNumber} from "../utils.js";

const MIN_RATING = 0;
const MAX_RATING = 10;
const MIN_RELEASE = 1929;
const MAX_RELEASE = 2020;
const MIN_HOUR_TIME = 0;
const MAX_HOUR_TIME = 3;
const MIN_MINUTE_TIME = 0;
const MAX_MINUTE_TIME = 59;
const MIN_SENTENCES_AMOUNT = 1;
const MAX_SENTENCES_AMOUNT = 5;
const MIN_COMMENT_AMOUNT = 0;
const MAX_COMMENT_AMOUNT = 6;

const posters = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const titles = [`The Dance of Life`, `Sagebrush Trail`, `The Man with the Golden Arm`, `Santa Claus Conquers the Martians`, `Popeye the Sailor Meets Sindbad the Sailor`, `Bonnie and Clyde`, `Reservoir Dogs`, `Airplane!`, `Pan's Labyrinth`, `Doctor Zhivago`];
const directors = [`Nabeel Good`, `Zhane Howe`, `Lynsey Montes`, `Momina Mcmahon`, `Jorden Dotson`];
const writers = [[`Ashraf Haynes`, `Daphne Williamson`, `Odin Schroeder`, `Hira Stuart`], [`Rebeca Caldwell`, `Ilyas Odom`, `Catherine Rayner`, `Marius Roberts`], [`Karam Moyer`, `Alishia Kline`, `Kalvin Ward`, `Bryson Mcneill`]];
const actors = [[`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`, `Morgan Freeman`], [`Waleed Henry`, `Pedro Odling`, `Kole Heaton`], [`Marley Ritter`, `Luisa Marin`, `Keira Millington`, `Molly Sheldon`]];
const countries = [`USA`, `Germany`, `Russia`, `Austria`, `Spain`];
const authors = [`Tim Macoveev`, `John Doe`, `Vlasta Lucina`, `Florianne Wigheard`, `Theudhar Puneet`, `Erol Sara`];
const comments = [`Interesting setting and a good cast`, `Booooooooooring`, `Recommend`, `Don't recommend`, `A great movie`, `Liked a lot`, `Don't waste time`];
const emojies = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`];

const generateRating = () => {
  return getRandomNumber(MIN_RATING, MAX_RATING);
};

const generateRelease = () => {
  const currentDate = new Date();

  currentDate.setFullYear(getRandomInteger(MIN_RELEASE, MAX_RELEASE));

  return new Date(currentDate).getFullYear();
};


const generateGenre = () => {
  const genres = [`Horror`, `Musical`, `Comedy`, `Mystery`, `Drama`];

  const randomIndex = getRandomInteger(1, genres.length - 1);
  const randomGenre = shuffleArray(genres).slice(0, randomIndex);

  const CardDetailGenres = Object.create({}, {
    title: {
      get() {
        return randomGenre.length > 1 ? `Genres` : `Genre`;
      }
    },
    types: {
      value: randomGenre
    },
    age: {
      get() {
        return randomGenre.includes(`Horror`) ? `18+` : ``;
      }
    }
  });

  return CardDetailGenres;
};

const generateRunTime = () => {
  const hourRunningTime = getRandomInteger(MIN_HOUR_TIME, MAX_HOUR_TIME);
  const minuteRunningTime = getRandomInteger(MIN_MINUTE_TIME, MAX_MINUTE_TIME);

  if (hourRunningTime && minuteRunningTime) {
    return `${hourRunningTime}h ${minuteRunningTime}m`;
  } else if (!hourRunningTime && minuteRunningTime) {
    return `${minuteRunningTime}m`;
  } else if (hourRunningTime && !minuteRunningTime) {
    return `${hourRunningTime}h`;
  } else if (!hourRunningTime && !minuteRunningTime) {
    return `unknown`;
  }
  return `${hourRunningTime}`;
};

const generateDescription = () => {
  const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus`;
  const randomIndex = getRandomInteger(MIN_SENTENCES_AMOUNT, MAX_SENTENCES_AMOUNT + 1);
  return shuffleArray(description.split(`.`)).slice(0, randomIndex).join(`.`);
};

const groupComments = (item, amount) => {
  return new Array(amount).fill().map(item);
};

const generateCommentDate = () => {
  const currentDay = new Date();

  currentDay.setHours(23, 59, 59, 999);
  currentDay.setDate(currentDay.getDate());

  return new Date(currentDay);
};

const generateComments = () => {
  return {
    text: getRandomItem(comments),
    emoji: `./images/emoji/${getRandomItem(emojies)}`,
    author: getRandomItem(authors),
    date: generateCommentDate()
  };
};

const getId = uniqueNumber();

export const generateCard = () => {
  return {
    poster: `./images/posters/${getRandomItem(posters)}`,
    title: getRandomItem(titles),
    rating: generateRating(),
    release: generateRelease(),
    genre: generateGenre(),
    runTime: generateRunTime(),
    description: generateDescription(),
    isWatchlist: Boolean(getRandomInteger(0, 1)),
    isHistory: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    director: getRandomItem(directors),
    writers: getRandomItem(writers),
    actors: getRandomItem(actors),
    country: getRandomItem(countries),
    comments: groupComments(generateComments, getRandomInteger(MIN_COMMENT_AMOUNT, MAX_COMMENT_AMOUNT)),
    id: getId(),
  };
};
