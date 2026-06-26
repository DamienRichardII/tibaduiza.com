export type Format = {
  label: string;
  price: string;
};

export type Produit = {
  id: string;
  title: string;
  price: string;
  src: string;
  formats?: Format[];
  description?: string;
  dimensions?: string;
  nouveaute?: boolean;
};

export type CategorieBoutique = {
  id: string;
  title: string;
  produits: Produit[];
};

export const boutique: CategorieBoutique[] = [
  {
    id: "tirages",
    title: "Tirages",
    produits: [
      {
        id: "saut",
        title: "En suspension",
        price: "80€",
        src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
        formats: [
          { label: "20×30 cm", price: "80€" },
          { label: "30×40 cm", price: "120€" },
          { label: "40×60 cm", price: "180€" },
        ],
      },
      {
        id: "portrait-paris",
        title: "Paris, printemps",
        price: "90€",
        src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
        formats: [
          { label: "20×30 cm", price: "90€" },
          { label: "30×40 cm", price: "130€" },
          { label: "40×60 cm", price: "200€" },
        ],
      },
      {
        id: "andes",
        title: "Tierra de Gigantes I",
        price: "100€",
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        formats: [
          { label: "20×30 cm", price: "100€" },
          { label: "30×40 cm", price: "150€" },
          { label: "40×60 cm", price: "220€" },
        ],
      },
      {
        id: "brume",
        title: "Brume matinale",
        price: "100€",
        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        formats: [
          { label: "20×30 cm", price: "100€" },
          { label: "30×40 cm", price: "150€" },
          { label: "40×60 cm", price: "220€" },
        ],
      },
      {
        id: "silhouettes",
        title: "Silhouettes",
        price: "80€",
        src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
        formats: [
          { label: "20×30 cm", price: "80€" },
          { label: "30×40 cm", price: "120€" },
          { label: "40×60 cm", price: "180€" },
        ],
      },
      {
        id: "coucher",
        title: "Coucher de soleil",
        price: "90€",
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        formats: [
          { label: "20×30 cm", price: "90€" },
          { label: "30×40 cm", price: "130€" },
          { label: "40×60 cm", price: "200€" },
        ],
      },
      {
        id: "danse",
        title: "Danse I",
        price: "85€",
        src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
        formats: [
          { label: "20×30 cm", price: "85€" },
          { label: "30×40 cm", price: "125€" },
          { label: "40×60 cm", price: "190€" },
        ],
      },
      {
        id: "vegetal",
        title: "Végétation tropicale",
        price: "95€",
        src: "https://images.unsplash.com/photo-1440428237429-05dae3d7b6e6?w=800&q=80",
        formats: [
          { label: "20×30 cm", price: "95€" },
          { label: "30×40 cm", price: "140€" },
          { label: "40×60 cm", price: "210€" },
        ],
      },
    ],
  },
  {
    id: "cartes-postales",
    title: "Cartes postales",
    produits: [
      {
        id: "cp-saut",
        title: "En suspension",
        price: "5€",
        src: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
        description:
          "Carte postale de haute qualité, impression sur papier mat 350g. Idéale pour l'envoi ou la décoration.",
        dimensions: "10,5 × 14,8 cm (format A6)",
      },
      {
        id: "cp-paris",
        title: "Paris, printemps",
        price: "5€",
        src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
        description: "Carte postale impression haute qualité, papier mat 350g.",
        dimensions: "10,5 × 14,8 cm (format A6)",
      },
      {
        id: "cp-andes",
        title: "Tierra de Gigantes",
        price: "5€",
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        description: "Carte postale impression haute qualité, papier mat 350g.",
        dimensions: "10,5 × 14,8 cm (format A6)",
      },
      {
        id: "cp-brume",
        title: "Brume matinale",
        price: "5€",
        src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        description: "Carte postale impression haute qualité, papier mat 350g.",
        dimensions: "10,5 × 14,8 cm (format A6)",
      },
      {
        id: "cp-silhouettes",
        title: "Silhouettes",
        price: "5€",
        src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
        description: "Carte postale impression haute qualité, papier mat 350g.",
        dimensions: "10,5 × 14,8 cm (format A6)",
      },
      {
        id: "cp-danse",
        title: "Danse I",
        price: "5€",
        src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
        description: "Carte postale impression haute qualité, papier mat 350g.",
        dimensions: "10,5 × 14,8 cm (format A6)",
      },
    ],
  },
  {
    id: "tierra-de-gigantes",
    title: "Tierra de Gigantes",
    produits: [
      {
        id: "livre",
        title: "Tierra de gigantes",
        price: "45€",
        src: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        nouveaute: true,
        description:
          "Livre photographique réalisé lors d'un voyage dans les hautes terres de la cordillère des Andes en Colombie. Une série d'images contemplatives sur la relation entre l'homme et la montagne.",
        dimensions: "21 × 27 cm — 80 pages",
      },
    ],
  },
];

export function getCategorieById(id: string) {
  return boutique.find((c) => c.id === id);
}

export function getProduitById(categorieId: string, produitId: string) {
  const cat = getCategorieById(categorieId);
  return cat?.produits.find((p) => p.id === produitId);
}
