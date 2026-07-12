export interface ExpertQuestion {
  text: string;
  accepted_answers: string[];
  display_answer: string;
  difficulty: 4 | 5 | 6;
}

export const EXPERT_QUESTIONS: ExpertQuestion[] = [
  // Difficulty 5 — challenging
  {
    text: "Quelle est la sous-préfecture la plus au nord du département de l'Ain ?",
    accepted_answers: ["Gex"],
    display_answer: "Gex",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Cahors ?",
    accepted_answers: ["Lot"],
    display_answer: "Lot",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Mende ?",
    accepted_answers: ["Lot"],
    display_answer: "Lot",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Albi ?",
    accepted_answers: ["Tarn"],
    display_answer: "Tarn",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Orléans ?",
    accepted_answers: ["Loire"],
    display_answer: "Loire",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Rouen ?",
    accepted_answers: ["Seine"],
    display_answer: "Seine",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Besançon ?",
    accepted_answers: ["Doubs"],
    display_answer: "Doubs",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Metz ?",
    accepted_answers: ["Moselle", "Seille"],
    display_answer: "Moselle",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Perpignan ?",
    accepted_answers: ["Têt"],
    display_answer: "Têt",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Montpellier ?",
    accepted_answers: ["Lez"],
    display_answer: "Lez",
    difficulty: 6,
  },
  {
    text: "Quel est le département le plus peuplé de France ?",
    accepted_answers: ["Nord", "59"],
    display_answer: "Nord",
    difficulty: 5,
  },
  {
    text: "Quel est le deuxième département le plus peuplé de France ?",
    accepted_answers: ["Bouches-du-Rhône", "Bouches du Rhone", "13"],
    display_answer: "Bouches-du-Rhône",
    difficulty: 5,
  },
  {
    text: "Quel département a le plus de communes ?",
    accepted_answers: ["Pas-de-Calais", "Pas de Calais", "62"],
    display_answer: "Pas-de-Calais",
    difficulty: 6,
  },
  {
    text: "Quel département métropolitain a la plus faible densité de population ?",
    accepted_answers: ["Lozère", "48"],
    display_answer: "Lozère",
    difficulty: 6,
  },
  {
    text: "Quel département métropolitain a la plus forte densité de population ?",
    accepted_answers: ["Paris", "75"],
    display_answer: "Paris",
    difficulty: 5,
  },
  {
    text: "Quel département borde le plus d'autres départements (8 voisins) ?",
    accepted_answers: ["Cher", "18"],
    display_answer: "Cher",
    difficulty: 5,
  },
  {
    text: "Dans quel département se trouve le col du Tourmalet ?",
    accepted_answers: ["Hautes-Pyrénées", "Hautes Pyrenees", "65"],
    display_answer: "Hautes-Pyrénées",
    difficulty: 5,
  },
  {
    text: "Dans quel département se trouve le Mont Ventoux ?",
    accepted_answers: ["Vaucluse", "84"],
    display_answer: "Vaucluse",
    difficulty: 5,
  },
  {
    text: "Dans quel département se trouve le Puy de Dôme ?",
    accepted_answers: ["Puy-de-Dôme", "Puy de Dome", "63"],
    display_answer: "Puy-de-Dôme",
    difficulty: 5,
  },
  {
    text: "Quelle sous-préfecture du Finistère se trouve à l'extrémité ouest ?",
    accepted_answers: ["Brest"],
    display_answer: "Brest",
    difficulty: 5,
  },
  {
    text: "Dans quel département se trouve le viaduc de Millau ?",
    accepted_answers: ["Aveyron", "12"],
    display_answer: "Aveyron",
    difficulty: 5,
  },
  {
    text: "Quelle est la sous-préfecture de la Creuse ?",
    accepted_answers: ["Aubusson"],
    display_answer: "Aubusson",
    difficulty: 5,
  },
  {
    text: "Dans quel département se trouve le Mont-Saint-Michel ?",
    accepted_answers: ["Manche", "50"],
    display_answer: "Manche",
    difficulty: 4,
  },
  {
    text: "Quel département est entièrement enclavé dans un autre département ?",
    accepted_answers: ["Territoire de Belfort", "90"],
    display_answer: "Territoire de Belfort",
    difficulty: 6,
  },
  {
    text: "Quels départements composent la Corse ?",
    accepted_answers: ["Corse-du-Sud", "Haute-Corse", "2A", "2B"],
    display_answer: "Corse-du-Sud et Haute-Corse",
    difficulty: 5,
  },
  {
    text: "Dans quelle région se trouve le département des Côtes-d'Armor ?",
    accepted_answers: ["Bretagne"],
    display_answer: "Bretagne",
    difficulty: 5,
  },
  {
    text: "Dans quelle région se trouve le département du Cantal ?",
    accepted_answers: ["Auvergne-Rhône-Alpes"],
    display_answer: "Auvergne-Rhône-Alpes",
    difficulty: 5,
  },
  {
    text: "Quel fleuve forme une partie de la frontière entre la France et l'Allemagne ?",
    accepted_answers: ["Rhin"],
    display_answer: "Rhin",
    difficulty: 5,
  },
  {
    text: "Quel fleuve forme une partie de la frontière entre la France et l'Espagne ?",
    accepted_answers: ["Pyrénées", "Pyrenees"],
    display_answer: "Les Pyrénées",
    difficulty: 5,
  },
  {
    text: "Dans quel département se trouve la ville de Saint-Malo ?",
    accepted_answers: ["Ille-et-Vilaine", "35"],
    display_answer: "Ille-et-Vilaine",
    difficulty: 5,
  },

  // Difficulty 6 — expert / joker pool
  {
    text: "Quelle est la sous-préfecture du département de la Lozère ?",
    accepted_answers: ["Florac"],
    display_answer: "Florac",
    difficulty: 6,
  },
  {
    text: "Quel est le plus haut sommet du Massif central ?",
    accepted_answers: ["Puy de Sancy", "Sancy"],
    display_answer: "Puy de Sancy",
    difficulty: 5,
  },
  {
    text: "Quel fleuve traverse la ville de Guéret ?",
    accepted_answers: ["Creuse"],
    display_answer: "Creuse",
    difficulty: 6,
  },
  {
    text: "Quel fleuve traverse la ville de Privas ?",
    accepted_answers: ["Ardèche", "Ardeche"],
    display_answer: "Ardèche",
    difficulty: 6,
  },
  {
    text: "Quel fleuve traverse la ville de Aurillac ?",
    accepted_answers: ["Cère", "Cere", "Jordanne"],
    display_answer: "Cère",
    difficulty: 6,
  },
  {
    text: "Dans quel département se trouve la ville de Vervins ?",
    accepted_answers: ["Aisne", "02"],
    display_answer: "Aisne",
    difficulty: 6,
  },
  {
    text: "Dans quel département se trouve la ville de Nyons ?",
    accepted_answers: ["Drôme", "Drome", "26"],
    display_answer: "Drôme",
    difficulty: 6,
  },
  {
    text: "Dans quel département se trouve la ville de Largentière ?",
    accepted_answers: ["Ardèche", "Ardeche", "07"],
    display_answer: "Ardèche",
    difficulty: 6,
  },
  {
    text: "Quelle est la préfecture du département le moins peuplé de France métropolitaine ?",
    accepted_answers: ["Mende"],
    display_answer: "Mende",
    difficulty: 6,
  },
  {
    text: "Combien de départements composent la France métropolitaine ?",
    accepted_answers: ["96", "quatre-vingt-seize"],
    display_answer: "96",
    difficulty: 6,
  },
  {
    text: "Quel département a pour préfecture Foix ?",
    accepted_answers: ["Ariège", "Ariege", "09"],
    display_answer: "Ariège",
    difficulty: 6,
  },
  {
    text: "Quel département a pour préfecture Bar-le-Duc ?",
    accepted_answers: ["Meuse", "55"],
    display_answer: "Meuse",
    difficulty: 6,
  },
  {
    text: "Quel département a pour préfecture Chaumont ?",
    accepted_answers: ["Haute-Marne", "Haute Marne", "52"],
    display_answer: "Haute-Marne",
    difficulty: 6,
  },
  {
    text: "Dans quel estuaire se rejettent la Garonne et la Dordogne ?",
    accepted_answers: ["Gironde", "estuaire de la Gironde"],
    display_answer: "L'estuaire de la Gironde",
    difficulty: 5,
  },
  {
    text: "Dans quel département se trouvent les gorges du Verdon ?",
    accepted_answers: ["Alpes-de-Haute-Provence", "Var", "04", "83"],
    display_answer: "Alpes-de-Haute-Provence / Var",
    difficulty: 6,
  },
  {
    text: "Dans quel département se trouve le lac du Salagou ?",
    accepted_answers: ["Hérault", "Herault", "34"],
    display_answer: "Hérault",
    difficulty: 6,
  },
  {
    text: "Dans quel département se trouve le Parc national des Cévennes ?",
    accepted_answers: ["Lozère", "Gard", "48", "30"],
    display_answer: "Lozère / Gard",
    difficulty: 6,
  },
  {
    text: "Dans quel département se trouve le gouffre de Padirac ?",
    accepted_answers: ["Lot", "46"],
    display_answer: "Lot",
    difficulty: 6,
  },
  {
    text: "Dans quel département se trouve le cirque de Gavarnie ?",
    accepted_answers: ["Hautes-Pyrénées", "Hautes Pyrenees", "65"],
    display_answer: "Hautes-Pyrénées",
    difficulty: 6,
  },
  // --- Comparaisons démographiques préfecture vs plus grande ville ---
  // (profil Patrick 2026-07: sa seule faiblesse confirmée, à retester
  // régulièrement sous des formes variées)
  {
    text: "Quelle est la ville la plus peuplée des Alpes-de-Haute-Provence ?",
    accepted_answers: ["Manosque"],
    display_answer: "Manosque (et non Digne-les-Bains, la préfecture)",
    difficulty: 6,
  },
  {
    text: "Quelle est la ville la plus peuplée de l'Ardèche ?",
    accepted_answers: ["Annonay"],
    display_answer: "Annonay (et non Privas, la préfecture)",
    difficulty: 6,
  },
  {
    text: "Quelle est la préfecture la moins peuplée de France métropolitaine ?",
    accepted_answers: ["Privas"],
    display_answer: "Privas (Ardèche)",
    difficulty: 6,
  },
  {
    text: "Quelle est la ville la plus peuplée de la Marne ?",
    accepted_answers: ["Reims"],
    display_answer: "Reims (et non Châlons-en-Champagne, la préfecture)",
    difficulty: 5,
  },
  {
    text: "Quelle est la ville la plus peuplée de Seine-Maritime ?",
    accepted_answers: ["Le Havre", "Havre"],
    display_answer: "Le Havre (et non Rouen, la préfecture)",
    difficulty: 5,
  },
  {
    text: "Quelle est la ville la plus peuplée du département 62 ?",
    accepted_answers: ["Calais"],
    display_answer: "Calais (et non Arras, la préfecture)",
    difficulty: 5,
  },
  {
    text: "Quelle est la ville la plus peuplée de la Manche ?",
    accepted_answers: ["Cherbourg-en-Cotentin", "Cherbourg"],
    display_answer: "Cherbourg-en-Cotentin (et non Saint-Lô, la préfecture)",
    difficulty: 5,
  },
  {
    text: "Quelle est la ville la plus peuplée de l'Aisne ?",
    accepted_answers: ["Saint-Quentin", "Saint Quentin"],
    display_answer: "Saint-Quentin (et non Laon, la préfecture)",
    difficulty: 5,
  },
  {
    text: "Quelle est la ville la plus peuplée de la Haute-Marne ?",
    accepted_answers: ["Saint-Dizier", "Saint Dizier"],
    display_answer: "Saint-Dizier (et non Chaumont, la préfecture)",
    difficulty: 6,
  },
  {
    text: "Quelle est la ville la plus peuplée de Saône-et-Loire ?",
    accepted_answers: ["Chalon-sur-Saône", "Chalon sur Saone", "Chalon"],
    display_answer: "Chalon-sur-Saône (et non Mâcon, la préfecture)",
    difficulty: 6,
  },
  {
    text: "Quelle est la ville la plus peuplée du Jura ?",
    accepted_answers: ["Dole"],
    display_answer: "Dole (et non Lons-le-Saunier, la préfecture)",
    difficulty: 6,
  },
  {
    text: "Quelle est la ville la plus peuplée de l'Allier ?",
    accepted_answers: ["Montluçon", "Montlucon"],
    display_answer: "Montluçon (et non Moulins, la préfecture)",
    difficulty: 6,
  },
  {
    text: "Quelle est la ville la plus peuplée des Hauts-de-Seine ?",
    accepted_answers: ["Boulogne-Billancourt", "Boulogne Billancourt"],
    display_answer: "Boulogne-Billancourt (et non Nanterre, la préfecture)",
    difficulty: 5,
  },
  {
    text: "Quelle est la ville la plus peuplée du département 93 ?",
    accepted_answers: ["Saint-Denis", "Saint Denis"],
    display_answer: "Saint-Denis (et non Bobigny, la préfecture)",
    difficulty: 5,
  },

  // --- Frontières internationales ---
  {
    text: "Quel département est frontalier à la fois de la Suisse et de l'Italie ?",
    accepted_answers: ["Haute-Savoie", "Haute Savoie", "74"],
    display_answer: "Haute-Savoie",
    difficulty: 6,
  },
  {
    text: "Quel département est frontalier à la fois de l'Allemagne et de la Suisse ?",
    accepted_answers: ["Haut-Rhin", "Haut Rhin", "68"],
    display_answer: "Haut-Rhin",
    difficulty: 5,
  },
  {
    text: "Quel département est frontalier à la fois de l'Allemagne et du Luxembourg ?",
    accepted_answers: ["Moselle", "57"],
    display_answer: "Moselle",
    difficulty: 5,
  },
  {
    text: "Quel département d'outre-mer est frontalier de deux pays ?",
    accepted_answers: ["Guyane", "973"],
    display_answer: "Guyane (Brésil et Suriname)",
    difficulty: 5,
  },
  {
    text: "Citez un département frontalier à la fois de l'Espagne et de l'Andorre.",
    accepted_answers: ["Ariège", "Ariege", "Pyrénées-Orientales", "Pyrenees Orientales", "09", "66"],
    display_answer: "Ariège ou Pyrénées-Orientales",
    difficulty: 6,
  },
  {
    text: "Quel département est frontalier à la fois de l'Italie et de Monaco ?",
    accepted_answers: ["Alpes-Maritimes", "Alpes Maritimes", "06"],
    display_answer: "Alpes-Maritimes",
    difficulty: 5,
  },

  // --- Exceptions et histoire administratives ---
  {
    text: "Quel département portait autrefois le nom de Basses-Alpes ?",
    accepted_answers: ["Alpes-de-Haute-Provence", "Alpes de Haute Provence", "04"],
    display_answer: "Alpes-de-Haute-Provence (renommé en 1970)",
    difficulty: 5,
  },
  {
    text: "Quel département portait autrefois le nom de Seine-Inférieure ?",
    accepted_answers: ["Seine-Maritime", "Seine Maritime", "76"],
    display_answer: "Seine-Maritime (renommé en 1955)",
    difficulty: 5,
  },
  {
    text: "Quel département portait autrefois le nom de Basses-Pyrénées ?",
    accepted_answers: ["Pyrénées-Atlantiques", "Pyrenees Atlantiques", "64"],
    display_answer: "Pyrénées-Atlantiques (renommé en 1969)",
    difficulty: 5,
  },
  {
    text: "Quel numéro de département n'est plus attribué en métropole depuis 1976 ?",
    accepted_answers: ["20", "vingt"],
    display_answer: "20 (remplacé par 2A et 2B)",
    difficulty: 6,
  },
  {
    text: "Depuis 2015, quelle collectivité exerce les compétences départementales sur le territoire de Lyon ?",
    accepted_answers: ["Métropole de Lyon", "Metropole de Lyon", "Grand Lyon"],
    display_answer: "La Métropole de Lyon",
    difficulty: 6,
  },
  {
    text: "Combien de départements compte la France, outre-mer inclus ?",
    accepted_answers: ["101", "cent un"],
    display_answer: "101",
    difficulty: 5,
  },
  {
    text: "Combien de régions compte la France, outre-mer inclus ?",
    accepted_answers: ["18", "dix-huit"],
    display_answer: "18 (13 métropolitaines + 5 d'outre-mer)",
    difficulty: 5,
  },
  {
    text: "En quelle année les régions métropolitaines sont-elles passées de 22 à 13 ?",
    accepted_answers: ["2016"],
    display_answer: "2016",
    difficulty: 6,
  },
  {
    text: "Citez un département métropolitain qui ne possède aucune sous-préfecture.",
    accepted_answers: ["Paris", "Territoire de Belfort", "75", "90"],
    display_answer: "Paris ou le Territoire de Belfort",
    difficulty: 6,
  },

  // --- Sources et cours d'eau (pièges) ---
  {
    text: "Dans quel département la Loire prend-elle sa source ?",
    accepted_answers: ["Ardèche", "Ardeche", "07"],
    display_answer: "Ardèche (au mont Gerbier-de-Jonc)",
    difficulty: 5,
  },
  {
    text: "Dans quel département la Seine prend-elle sa source ?",
    accepted_answers: ["Côte-d'Or", "Cote d'Or", "Cote d Or", "21"],
    display_answer: "Côte-d'Or",
    difficulty: 6,
  },
  {
    text: "Dans quel département la Garonne entre-t-elle en France ?",
    accepted_answers: ["Haute-Garonne", "Haute Garonne", "31"],
    display_answer: "Haute-Garonne (elle prend sa source en Espagne)",
    difficulty: 6,
  },

  // --- Sous-préfectures (filon apprécié) ---
  {
    text: "Quelle sous-préfecture de la Marne est célèbre pour ses maisons de champagne ?",
    accepted_answers: ["Épernay", "Epernay"],
    display_answer: "Épernay",
    difficulty: 5,
  },
  {
    text: "Quelle sous-préfecture du Calvados est célèbre pour sa tapisserie ?",
    accepted_answers: ["Bayeux"],
    display_answer: "Bayeux",
    difficulty: 5,
  },
  {
    text: "Quelle est la sous-préfecture la moins peuplée de France métropolitaine ?",
    accepted_answers: ["Castellane"],
    display_answer: "Castellane (Alpes-de-Haute-Provence, ~1 500 habitants)",
    difficulty: 6,
  },
  {
    text: "Quel fleuve se jette dans la Manche au Havre ?",
    accepted_answers: ["Seine"],
    display_answer: "Seine",
    difficulty: 6,
  },
  {
    text: "Dans quel département se trouve la ville de Montdidier ?",
    accepted_answers: ["Somme", "80"],
    display_answer: "Somme",
    difficulty: 6,
  },
  {
    text: "Dans quel département se trouve la ville de Clamecy ?",
    accepted_answers: ["Nièvre", "Nievre", "58"],
    display_answer: "Nièvre",
    difficulty: 6,
  },
  {
    text: "Quel fleuve traverse la ville de Épinal ?",
    accepted_answers: ["Moselle"],
    display_answer: "Moselle",
    difficulty: 6,
  },
  {
    text: "Quel fleuve traverse la ville de Nevers ?",
    accepted_answers: ["Loire"],
    display_answer: "Loire",
    difficulty: 6,
  },
  {
    text: "Quel fleuve traverse la ville de Auxerre ?",
    accepted_answers: ["Yonne"],
    display_answer: "Yonne",
    difficulty: 6,
  },
  {
    text: "Quel est le numéro du département des Hautes-Pyrénées ?",
    accepted_answers: ["65"],
    display_answer: "65",
    difficulty: 6,
  },
  {
    text: "Quel est le numéro du département de la Haute-Loire ?",
    accepted_answers: ["43"],
    display_answer: "43",
    difficulty: 6,
  },
  {
    text: "Quel est le numéro du département de l'Indre ?",
    accepted_answers: ["36"],
    display_answer: "36",
    difficulty: 6,
  },
  {
    text: "Quelle région administrative regroupe les départements du Rhône et de l'Ain ?",
    accepted_answers: ["Auvergne-Rhône-Alpes", "Auvergne Rhone Alpes"],
    display_answer: "Auvergne-Rhône-Alpes",
    difficulty: 6,
  },
  {
    text: "Quelle région administrative regroupe les départements du Finistère et du Morbihan ?",
    accepted_answers: ["Bretagne"],
    display_answer: "Bretagne",
    difficulty: 6,
  },
];
