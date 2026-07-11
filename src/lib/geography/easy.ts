export interface EasyQuestion {
  text: string;
  accepted_answers: string[];
  display_answer: string;
  /** Expert-calibrated difficulty; defaults to 1. */
  difficulty?: number;
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
    text: "Quelle mer borde Marseille ?",
    accepted_answers: ["Méditerranée", "mer Méditerranée"],
    display_answer: "La mer Méditerranée",
  },
  {
    text: "Quel océan borde la côte ouest de la France ?",
    accepted_answers: ["Atlantique", "océan Atlantique"],
    display_answer: "L'océan Atlantique",
  },
  {
    text: "Quelle chaîne de montagnes sépare la France de l'Espagne ?",
    accepted_answers: ["Pyrénées"],
    display_answer: "Les Pyrénées",
  },
  {
    text: "Quelle chaîne de montagnes sépare la France de l'Italie ?",
    accepted_answers: ["Alpes"],
    display_answer: "Les Alpes",
  },
  {
    text: "Sur quelle île se trouve la ville d'Ajaccio ?",
    accepted_answers: ["Corse"],
    display_answer: "La Corse",
  },
  {
    text: "Quelle mer sépare la France de l'Angleterre ?",
    accepted_answers: ["Manche", "la Manche"],
    display_answer: "La Manche",
  },
  {
    text: "Dans quelle ville se trouve la tour Eiffel ?",
    accepted_answers: ["Paris"],
    display_answer: "Paris",
  },
  {
    text: "Dans quelle ville se trouve le musée du Louvre ?",
    accepted_answers: ["Paris"],
    display_answer: "Paris",
  },
  {
    text: "Quelle est la plus grande ville de France ?",
    accepted_answers: ["Paris"],
    display_answer: "Paris",
  },
  {
    text: "Dans quelle ville se trouve l'Arc de Triomphe ?",
    accepted_answers: ["Paris"],
    display_answer: "Paris",
  },
  {
    text: "Quelle est la deuxième plus grande ville de France ?",
    accepted_answers: ["Marseille"],
    display_answer: "Marseille",
    difficulty: 2,
  },
  {
    text: "Quelle ville est surnommée la Ville rose ?",
    accepted_answers: ["Toulouse"],
    display_answer: "Toulouse",
    difficulty: 2,
  },
  {
    text: "Dans quelle ville se trouve le stade Vélodrome ?",
    accepted_answers: ["Marseille"],
    display_answer: "Marseille",
    difficulty: 2,
  },
  {
    text: "Dans quelle ville se trouve la Promenade des Anglais ?",
    accepted_answers: ["Nice"],
    display_answer: "Nice",
    difficulty: 2,
  },
  {
    text: "Dans quelle ville se trouve le Vieux-Port ?",
    accepted_answers: ["Marseille"],
    display_answer: "Marseille",
    difficulty: 2,
  },
  {
    text: "Quelle est la plus grande île française de Méditerranée ?",
    accepted_answers: ["Corse"],
    display_answer: "La Corse",
    difficulty: 2,
  },
  {
    text: "Quelle ville abrite le palais des Papes ?",
    accepted_answers: ["Avignon"],
    display_answer: "Avignon",
    difficulty: 3,
  },
  {
    text: "Dans quelle ville se trouve la basilique Notre-Dame de Fourvière ?",
    accepted_answers: ["Lyon"],
    display_answer: "Lyon",
    difficulty: 3,
  },
  {
    text: "Quelle ville est surnommée la Cité phocéenne ?",
    accepted_answers: ["Marseille"],
    display_answer: "Marseille",
    difficulty: 3,
  },
  {
    text: "Quel fleuve se jette dans la mer Méditerranée en Camargue ?",
    accepted_answers: ["Rhône", "Rhone"],
    display_answer: "Rhône",
    difficulty: 3,
  },
  {
    text: "Quelle région est réputée pour ses volcans, dont la chaîne des Puys ?",
    accepted_answers: ["Auvergne", "Auvergne-Rhône-Alpes"],
    display_answer: "L'Auvergne",
    difficulty: 3,
  },
  {
    text: "Dans quelle ville se trouve la cathédrale où étaient sacrés les rois de France ?",
    accepted_answers: ["Reims"],
    display_answer: "Reims",
    difficulty: 3,
  },
  {
    text: "Quel détroit sépare la Corse de la Sardaigne ?",
    accepted_answers: ["Bouches de Bonifacio", "Bonifacio"],
    display_answer: "Les bouches de Bonifacio",
    difficulty: 3,
  },
  {
    text: "Dans quel département se trouve la ville de Marseille ?",
    accepted_answers: ["Bouches-du-Rhône", "Bouches du Rhone", "13"],
    display_answer: "Bouches-du-Rhône",
    difficulty: 2,
  },
  {
    text: "Dans quel département se trouve la ville de Lyon ?",
    accepted_answers: ["Rhône", "Rhone", "69"],
    display_answer: "Rhône",
    difficulty: 2,
  },
  {
    text: "Dans quel département se trouve la ville de Toulouse ?",
    accepted_answers: ["Haute-Garonne", "Haute Garonne", "31"],
    display_answer: "Haute-Garonne",
    difficulty: 2,
  },
  {
    text: "Dans quel département se trouve la ville de Bordeaux ?",
    accepted_answers: ["Gironde", "33"],
    display_answer: "Gironde",
    difficulty: 2,
  },
  {
    text: "Dans quel département se trouve la ville de Lille ?",
    accepted_answers: ["Nord", "59"],
    display_answer: "Nord",
    difficulty: 2,
  },
  {
    text: "Dans quel département se trouve la ville de Nice ?",
    accepted_answers: ["Alpes-Maritimes", "Alpes Maritimes", "06"],
    display_answer: "Alpes-Maritimes",
    difficulty: 3,
  },
  {
    text: "Dans quel département se trouve la ville de Nantes ?",
    accepted_answers: ["Loire-Atlantique", "Loire Atlantique", "44"],
    display_answer: "Loire-Atlantique",
    difficulty: 3,
  },
  {
    text: "Dans quel département se trouve la ville de Strasbourg ?",
    accepted_answers: ["Bas-Rhin", "Bas Rhin", "67"],
    display_answer: "Bas-Rhin",
    difficulty: 3,
  },
  {
    text: "Quel fleuve traverse Paris ?",
    accepted_answers: ["Seine"],
    display_answer: "Seine",
    difficulty: 2,
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
    difficulty: 2,
  },
  {
    text: "Quelle est la préfecture du Rhône ?",
    accepted_answers: ["Lyon"],
    display_answer: "Lyon",
    difficulty: 2,
  },
  {
    text: "Quelle est la préfecture des Bouches-du-Rhône ?",
    accepted_answers: ["Marseille"],
    display_answer: "Marseille",
    difficulty: 2,
  },
  {
    text: "Quelle est la préfecture de la Gironde ?",
    accepted_answers: ["Bordeaux"],
    display_answer: "Bordeaux",
    difficulty: 3,
  },
  {
    text: "Quelle est la préfecture de la Haute-Garonne ?",
    accepted_answers: ["Toulouse"],
    display_answer: "Toulouse",
    difficulty: 2,
  },
  {
    text: "Quelle est la préfecture du Nord ?",
    accepted_answers: ["Lille"],
    display_answer: "Lille",
    difficulty: 2,
  },
  {
    text: "Dans quelle région se trouve Paris ?",
    accepted_answers: ["Île-de-France", "Ile de France"],
    display_answer: "Île-de-France",
    difficulty: 2,
  },
  {
    text: "Dans quelle région se trouve Marseille ?",
    accepted_answers: ["Provence-Alpes-Côte d'Azur", "PACA"],
    display_answer: "Provence-Alpes-Côte d'Azur",
    difficulty: 3,
  },
];
