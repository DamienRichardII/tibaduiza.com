export type Photo = {
  id: string;
  title: string;
  lieu?: string;
  description?: string;
  src: string;
  width: number;
  height: number;
};

export type Serie = {
  id: string;
  title: string;
  coverSrc: string;
  photos: Photo[];
};

export type Categorie = {
  id: string;
  title: string;
  coverSrc: string;
  series: Serie[];
};

export const travaux: Categorie[] = [
  {
    id: "noir-et-blanc",
    title: "Noir et blanc",
    coverSrc: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
    series: [
      {
        id: "portraits-nb",
        title: "Portraits N&B",
        coverSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
        photos: [
          {
            id: "1",
            title: "Portrait I",
            lieu: "Paris, France",
            description:
              "Série de portraits en noir et blanc réalisée dans les rues de Paris. Lumière naturelle, regard direct.",
            src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "2",
            title: "Portrait II",
            lieu: "Paris, France",
            description: "Étude de lumière sur visage en contre-jour.",
            src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "3",
            title: "Portrait III",
            lieu: "Montmartre, Paris",
            description: "Fragment urbain, texture et ombre.",
            src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80",
            width: 900,
            height: 600,
          },
        ],
      },
      {
        id: "danse",
        title: "Danse",
        coverSrc: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
        photos: [
          {
            id: "1",
            title: "En suspension",
            lieu: "Studio, Paris",
            description: "Corps en mouvement, instant suspendu.",
            src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "2",
            title: "L'envol",
            lieu: "Studio, Paris",
            description: "La danse comme langage du corps.",
            src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "3",
            title: "Silhouette",
            lieu: "Studio, Paris",
            description: "Contraste entre ombre et lumière.",
            src: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900&q=80",
            width: 900,
            height: 600,
          },
        ],
      },
    ],
  },
  {
    id: "couleurs",
    title: "Couleurs",
    coverSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    series: [
      {
        id: "portraits-couleurs",
        title: "Portraits couleurs",
        coverSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
        photos: [
          {
            id: "1",
            title: "Paris, printemps",
            lieu: "Paris, France",
            description:
              "Portraits en lumière dorée, couleurs chaudes et textures douces.",
            src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "2",
            title: "Été colombien",
            lieu: "Bogotá, Colombie",
            description: "La chaleur des couleurs de ma terre natale.",
            src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "3",
            title: "Portrait III",
            lieu: "Paris, France",
            description: "Jeu de couleurs complémentaires.",
            src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&q=80",
            width: 900,
            height: 600,
          },
        ],
      },
      {
        id: "reportage",
        title: "Reportage",
        coverSrc: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80",
        photos: [
          {
            id: "1",
            title: "La fête",
            lieu: "Paris, France",
            description: "Reportage sur les fêtes de quartier parisien.",
            src: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "2",
            title: "Sport",
            lieu: "Paris, France",
            description: "Énergie et mouvement dans la ville.",
            src: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "3",
            title: "Quotidien",
            lieu: "Paris, France",
            description: "La vie parisienne au quotidien.",
            src: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=900&q=80",
            width: 900,
            height: 600,
          },
        ],
      },
    ],
  },
  {
    id: "tierra-de-gigantes",
    title: "Tierra de Gigantes",
    coverSrc: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    series: [
      {
        id: "paysages",
        title: "Paysages",
        coverSrc: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        photos: [
          {
            id: "1",
            title: "Tierra de Gigantes",
            lieu: "Colombie",
            description:
              "Série photographique réalisée en Colombie, dans les hautes terres de la cordillère des Andes. Une terre de contrastes et de géants.",
            src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "2",
            title: "Brume matinale",
            lieu: "Andes, Colombie",
            description: "Les montagnes émergent de la brume au lever du soleil.",
            src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "3",
            title: "Silhouettes",
            lieu: "Andes, Colombie",
            description: "Figures humaines dans un paysage gigantesque.",
            src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "4",
            title: "Végétation tropicale",
            lieu: "Andes, Colombie",
            description: "La luxuriance de la végétation andine.",
            src: "https://images.unsplash.com/photo-1440428237429-05dae3d7b6e6?w=900&q=80",
            width: 900,
            height: 600,
          },
          {
            id: "5",
            title: "Coucher de soleil",
            lieu: "Andes, Colombie",
            description: "Le ciel s'embrase au-dessus des montagnes.",
            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80",
            width: 900,
            height: 600,
          },
        ],
      },
    ],
  },
];
