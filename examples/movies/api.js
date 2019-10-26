import { delay } from "./delay";

export const moviesOverview = [
  {
    id: 1,
    title: "Lady Bird",
    rating: 99,
    gross: "$52.9M"
  },
  {
    id: 2,
    title: "Downsizing",
    rating: 51,
    gross: "$24.5M"
  },
  {
    id: 3,
    title: "Black Panther",
    rating: 98,
    gross: "$403.6M"
  },
  {
    id: 4,
    title: "A Fantastic Woman",
    rating: 93,
    gross: "$0.6M"
  },
  {
    id: 5,
    title: "Father Figures",
    rating: 22,
    gross: "$17.5M"
  },
  {
    id: 6,
    title: "Early Man",
    rating: 81,
    gross: "$6.8M"
  }
];

export const movieDetailsJSON = {
  1: {
    title: "Lady Bird",
    rating: 99,
    gross: "$52.9M",
    consensus:
      "Lady Bird delivers fresh insights about the turmoil of adolescence -- and reveals writer-director Greta Gerwig as a fully formed filmmaking talent.",
    poster: "/img/lady-bird.png"
  },
  2: {
    title: "Downsizing",
    rating: 51,
    gross: "$24.5M",
    consensus:
      "Downsizing assembles a talented cast in pursuit of some truly interesting ideas -- which may be enough for some audiences to forgive the final product's frustrating shortcomings.",
    poster: "/img/downsizing.png"
  },
  3: {
    title: "Black Panther",
    rating: 98,
    gross: "$403.6M",
    consensus:
      "Black Panther elevates superhero cinema to thrilling new heights while telling one of the MCU's most absorbing stories -- and introducing some of its most fully realized characters.",
    poster: "/img/black-panther.png"
  },
  4: {
    title: "A Fantastic Woman",
    rating: 93,
    gross: "$0.6M",
    consensus:
      "Subtle and tender, A Fantastic Woman handles its timely, sensitive subject matter with care.",
    poster: "/img/a-fantastic-woman.png"
  },
  5: {
    title: "Father Figures",
    rating: 22,
    gross: "$17.5M",
    consensus: "No consensus yet.",
    poster: "/img/father-figures.png"
  },
  6: {
    title: "Early Man",
    rating: 81,
    gross: "$6.8M",
    consensus:
      "Early Man isn't quite as evolved as Aardman's best work, but still retains the unique visuals and sweet humor that have made the studio a favorite among animation enthusiasts.",
    poster: "/img/early-man.png"
  }
};

export const movieReviewsJSON = {
  1: [
    {
      summary:
        "Lady Bird is a brilliant little movie that deals with ideas both big and small. But, most powerful is the relationship between Lady Bird and Marion. It is harsh and funny and sometimes hard to watch. But it is undeniably and eternally there.",
      author: "Alexandra MacAaron, Women's Voices for Change"
    }
  ],
  2: [
    {
      summary:
        "The film, having launched a sprightly comic conceit, lets it glide away.",
      author: "Anthony Lane, New Yorker"
    }
  ],
  3: [
    {
      summary:
        'When it comes to creative visuals, engaging action and likable characters, "Black Panther" stands confidently next to the best fare offered up by the Marvel Cinematic Universe.',
      author: "Matthew Rozsa, Salon.com"
    }
  ],
  4: [
    {
      summary: "Fantastic is one word for it, another would be outstanding.",
      author: "Adam Graham, Detroit News"
    }
  ],
  5: [
    {
      summary:
        "Father Figures is not just painfully anti-charming, it is transparently desperate.",
      author: "Nick Allen, RogerEbert.com"
    }
  ],
  6: [
    {
      summary:
        "The story is thin, allowing little room for imaginative engagement, and the comedy uninspired. Early Man contains a nice anti-sexism message, but delivers it half-heartedly.",
      author: "Ben Sachs, Chicago Reader"
    }
  ]
};

export const fetchMovieDetails = async id => {
  await delay(100);
  return movieDetailsJSON[id];
};

export const fetchMovieReviews = async id => {
  await delay(2000);
  return movieReviewsJSON[id];
};
