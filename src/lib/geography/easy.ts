export interface EasyQuestion {
  text: string;
  accepted_answers: string[];
  display_answer: string;
}

export const EASY_QUESTIONS: EasyQuestion[] = [
  {
    text: "Quelle est la capitale de la France ?",
    accepted_answers: ["Paris"],
    display_answer: "Paris",
  },
  {
    text: "Quel est le numéro du département de Paris ?",
    accepted_answers: ["75"],
    display_answer: "75",
  },
  {
    text: "Dans quel département se trouve la ville de Marseille ?",
    accepted_answers: ["Bouches-du-Rhône", "Bouches du Rhone", "13"],
    display_answer: "Bouches-du-Rhône",
  },
  {
    text: "Dans quel département se trouve la ville de Lyon ?",
    accepted_answers: ["Rhône", "Rhone", "69"],
    display_answer: "Rhône",
  },
  {
    text: "Dans quel département se trouve la ville de Toulouse ?",
    accepted_answers: ["Haute-Garonne", "Haute Garonne", "31"],
    display_answer: "Haute-Garonne",
  },
  {
    text: "Dans quel département se trouve la ville de Bordeaux ?",
    accepted_answers: ["Gironde", "33"],
    display_answer: "Gironde",
  },
  {
    text: "Dans quel département se trouve la ville de Lille ?",
    accepted_answers: ["Nord", "59"],
    display_answer: "Nord",
  },
  {
    text: "Dans quel département se trouve la ville de Nice ?",
    accepted_answers: ["Alpes-Maritimes", "Alpes Maritimes", "06"],
    display_answer: "Alpes-Maritimes",
  },
  {
    text: "Dans quel département se trouve la ville de Nantes ?",
    accepted_answers: ["Loire-Atlantique", "Loire Atlantique", "44"],
    display_answer: "Loire-Atlantique",
  },
  {
    text: "Dans quel département se trouve la ville de Strasbourg ?",
    accepted_answers: ["Bas-Rhin", "Bas Rhin", "67"],
    display_answer: "Bas-Rhin",
  },
  {
    text: "Quel fleuve traverse Paris ?",
    accepted_answers: ["Seine"],
    display_answer: "Seine",
  },
  {
    text: "Quel département porte le numéro 75 ?",
    accepted_answers: ["Paris"],
    display_answer: "Paris",
  },
  {
    text: "Quel département porte le numéro 13 ?",
    accepted_answers: ["Bouches-du-Rhône", "Bouches du Rhone"],
    display_answer: "Bouches-du-Rhône",
  },
  {
    text: "Quelle est la préfecture du Rhône ?",
    accepted_answers: ["Lyon"],
    display_answer: "Lyon",
  },
  {
    text: "Quelle est la préfecture des Bouches-du-Rhône ?",
    accepted_answers: ["Marseille"],
    display_answer: "Marseille",
  },
  {
    text: "Quelle est la préfecture de la Gironde ?",
    accepted_answers: ["Bordeaux"],
    display_answer: "Bordeaux",
  },
  {
    text: "Quelle est la préfecture de la Haute-Garonne ?",
    accepted_answers: ["Toulouse"],
    display_answer: "Toulouse",
  },
  {
    text: "Quelle est la préfecture du Nord ?",
    accepted_answers: ["Lille"],
    display_answer: "Lille",
  },
  {
    text: "Dans quelle région se trouve Paris ?",
    accepted_answers: ["Île-de-France", "Ile de France"],
    display_answer: "Île-de-France",
  },
  {
    text: "Dans quelle région se trouve Marseille ?",
    accepted_answers: ["Provence-Alpes-Côte d'Azur", "PACA"],
    display_answer: "Provence-Alpes-Côte d'Azur",
  },
];
