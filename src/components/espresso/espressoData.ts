export interface EspressoDrinkRecipe {
  id: string;
  name: string;
  subtitle: string;
  category: 'espresso' | 'leche' | 'frio' | 'especial';
  basePrice: number;
  description: string;
  defaultTemp: 'caliente' | 'frio';
  defaultMilk: string;
  defaultShot: 'solo' | 'doppio' | 'ristretto' | 'lungo';
  anatomy: {
    foamPct: number;
    milkPct: number;
    coffeePct: number;
    specialPct?: number;
    specialName?: string;
  };
  notes: string[];
  extractionRatio: string;
  image: string;
}

export interface PastryPairingItem {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen_url: string;
  maridajeNota: string;
  maridajeRazon: string;
}

export const DRINK_PRESETS: EspressoDrinkRecipe[] = [
  {
    id: 'espresso-doppio',
    name: 'Espresso Doppio',
    subtitle: 'Extracción Pura Doble',
    category: 'espresso',
    basePrice: 55,
    description: 'Doble shot de café de especialidad con crema densa de avellana, cuerpo viscoso y acidez balanceada.',
    defaultTemp: 'caliente',
    defaultMilk: 'ninguna',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 20,
      milkPct: 0,
      coffeePct: 80,
    },
    notes: ['Crema de Avellana', 'Chocolate Amargo', 'Notas Cítricas'],
    extractionRatio: '1:2 (18g in / 36g out)',
    image: '/espresso_shot.jpg',
  },
  {
    id: 'flat-white',
    name: 'Flat White Austral',
    subtitle: 'Microespuma Sedosa & Doppio',
    category: 'leche',
    basePrice: 78,
    description: 'Doble ristretto extraído a presión perfecta coronado por microespuma brillante sin burbujas.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 15,
      milkPct: 45,
      coffeePct: 40,
    },
    notes: ['Textura Terciopelo', 'Dulzor Lácteo', 'Postgusto Prolongado'],
    extractionRatio: '1:1.5 Ristretto Barista',
    image: '/flat_white_art.jpg',
  },
  {
    id: 'cortado',
    name: 'Cortado Clásico',
    subtitle: 'Equilibrio 1:1 en Vaso Gibraltar',
    category: 'leche',
    basePrice: 65,
    description: 'Partes iguales de café espresso intenso y leche vaporizada a baja temperatura para conservar azúcares naturales.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 10,
      milkPct: 45,
      coffeePct: 45,
    },
    notes: ['Avellanas Tostadas', 'Toffee', 'Cuerpo Redondo'],
    extractionRatio: '1:2 con vaporizado a 62°C',
    image: '/espresso_shot.jpg',
  },
  {
    id: 'capuchino',
    name: 'Cappuccino Tradizionale',
    subtitle: 'Cúpula de Espuma Elástica',
    category: 'leche',
    basePrice: 72,
    description: 'El canon italiano de tres tercios iguales: espresso brillante, leche caliente sedosa y nube cremosa.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'solo',
    anatomy: {
      foamPct: 35,
      milkPct: 35,
      coffeePct: 30,
    },
    notes: ['Cacao Holandés', 'Miel Silvestre', 'Espuma Densa'],
    extractionRatio: 'Tercio Espresso / Vapor / Espuma',
    image: '/flat_white_art.jpg',
  },
  {
    id: 'latte-macchiato',
    name: 'Latte Macchiato',
    subtitle: 'Degradé Visual de Tres Capas',
    category: 'leche',
    basePrice: 85,
    description: 'Leche texturizada en vaso cristalino «manchada» con shot de espresso suspendido en el centro.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 20,
      milkPct: 60,
      coffeePct: 20,
    },
    notes: ['Vainilla Suave', 'Mantequilla Dulce', 'Equilibrio'],
    extractionRatio: 'Leche texturizada + Marcado espresso',
    image: '/iced_latte.jpg',
  },
  {
    id: 'mocha-olancho',
    name: 'Mocha Artesanal Olancho',
    subtitle: 'Espresso & Cacao de Altura 70%',
    category: 'especial',
    basePrice: 88,
    description: 'Ganache de cacao virgen de Olancho fundido en caliente con espresso doble y leche aterciopelada.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 15,
      milkPct: 40,
      coffeePct: 30,
      specialPct: 15,
      specialName: 'Cacao Olancho 70%',
    },
    notes: ['Chocolate Negro 70%', 'Notas de Frutos Rojos', 'Crema Suntuosa'],
    extractionRatio: 'Espresso doppio + Ganache artesanal',
    image: '/flat_white_art.jpg',
  },
  {
    id: 'cold-brew-tonic',
    name: 'Cold Brew Tonic Efervescente',
    subtitle: 'Maceración 18h & Quina Cítrica',
    category: 'frio',
    basePrice: 92,
    description: 'Concentrado de cold brew en frío vertido sobre agua tónica botánica, hielo de manantial y piel de naranja.',
    defaultTemp: 'frio',
    defaultMilk: 'tonica',
    defaultShot: 'solo',
    anatomy: {
      foamPct: 10,
      milkPct: 0,
      coffeePct: 40,
      specialPct: 50,
      specialName: 'Tónica de Quina & Hielo',
    },
    notes: ['Burbuja Fina', 'Cítricos Frescos', 'Ultra Refrescante'],
    extractionRatio: 'Extracción por goteo lento en frío',
    image: '/cold_brew.jpg',
  },
  {
    id: 'affogato-artesanal',
    name: 'Affogato al Caffè Roatán',
    subtitle: 'Gelato Fior di Latte & Espresso',
    category: 'especial',
    basePrice: 95,
    description: 'Bola de helado fior di latte con semillas de vainilla de Roatán ahogada con un shot hirviendo de espresso.',
    defaultTemp: 'frio',
    defaultMilk: 'ninguna',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 10,
      milkPct: 0,
      coffeePct: 45,
      specialPct: 45,
      specialName: 'Gelato de Vainilla Roatán',
    },
    notes: ['Choque Térmico', 'Vainilla Bourbon', 'Cremoso Intenso'],
    extractionRatio: 'Espresso hirviendo sobre gelato artesanal',
    image: '/affogato_artesanal.jpg',
  },
  {
    id: 'carajillo-altura',
    name: 'Carajillo Vistro Signature',
    subtitle: 'Licor 43, Hielo Cristalino & Café',
    category: 'especial',
    basePrice: 135,
    description: 'Coctelería barista: espresso recién extraído agitado enérgicamente con Licor 43 y perfume de corteza de naranja.',
    defaultTemp: 'frio',
    defaultMilk: 'ninguna',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 20,
      milkPct: 0,
      coffeePct: 45,
      specialPct: 35,
      specialName: 'Licor 43 & Cítricos',
    },
    notes: ['Vainilla Especiada', 'Espuma Shaken', 'Licor de Altura'],
    extractionRatio: 'Batido en coctelera de cobre',
    image: '/carajillo_espresso.jpg',
  },
  {
    id: 'iced-vanilla-latte',
    name: 'Iced Vanilla Roatán Latte',
    subtitle: 'Espresso, Vainilla & Hielo Tallado',
    category: 'frio',
    basePrice: 85,
    description: 'Sirope de vainilla natural, leche fresca emulsionada sobre cubos de hielo y doble shot flotante.',
    defaultTemp: 'frio',
    defaultMilk: 'entera',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 10,
      milkPct: 55,
      coffeePct: 35,
    },
    notes: ['Vainilla Natural', 'Dulzura Fría', 'Cuerpo Ligero'],
    extractionRatio: 'Extracción directa sobre hielo tallado',
    image: '/iced_latte.jpg',
  },
];

export const PASTRY_PAIRINGS: Record<string, PastryPairingItem> = {
  'espresso-doppio': {
    id: 12,
    nombre: 'Tiramisú Tradicional al Espresso Marcala',
    categoria: 'Repostería de Autor',
    precio: 110,
    imagen_url: '/tiramisu_espresso.jpg',
    maridajeNota: 'Mascarpone auténtico & cacao puro holandés',
    maridajeRazon: 'La acidez brillante del doppio corta la densidad del queso mascarpone, equilibrando el paladar.'
  },
  'affogato-artesanal': {
    id: 16,
    nombre: 'Éclair Francés de Crema de Espresso',
    categoria: 'Repostería de Autor',
    precio: 75,
    imagen_url: '/eclair_espresso.jpg',
    maridajeNota: 'Masa choux aireada & ganache brillante',
    maridajeRazon: 'El crujiente de la masa horneada aporta el contrapunto textural al gelato frío y fundente.'
  },
  'carajillo-altura': {
    id: 14,
    nombre: 'Basque Burnt Cheesecake de Café',
    categoria: 'Repostería de Autor',
    precio: 125,
    imagen_url: '/cheesecake_espresso.jpg',
    maridajeNota: 'Superficie tostada & sal marina San Lorenzo',
    maridajeRazon: 'Los toques cítricos y licorosos del cóctel potencian el centro cremoso acaramelado de la tarta vasca.'
  },
  'flat-white': {
    id: 13,
    nombre: 'Croissant Artesanal & Glaseado de Café',
    categoria: 'Repostería de Autor',
    precio: 68,
    imagen_url: '/croissant_cafe.jpg',
    maridajeNota: 'Hojaldre 72h & almendras laminadas',
    maridajeRazon: 'La microespuma de seda láctea y las capas quebradizas de pura mantequilla forman la combinación perfecta.'
  },
  'cortado': {
    id: 13,
    nombre: 'Croissant Artesanal & Glaseado de Café',
    categoria: 'Repostería de Autor',
    precio: 68,
    imagen_url: '/croissant_cafe.jpg',
    maridajeNota: 'Mantequilla francesa & glaseado espresso',
    maridajeRazon: 'El corte 1:1 de leche resalta los hojaldres dorados caramelizados al horno.'
  },
  'latte-macchiato': {
    id: 12,
    nombre: 'Tiramisú Tradicional al Espresso Marcala',
    categoria: 'Repostería de Autor',
    precio: 110,
    imagen_url: '/tiramisu_espresso.jpg',
    maridajeNota: 'Capas de savoiardi & cacao amargo',
    maridajeRazon: 'La suavidad del latte en copa cristalina complementa la caricia suave del postre italiano.'
  },
  'capuchino': {
    id: 14,
    nombre: 'Basque Burnt Cheesecake de Café',
    categoria: 'Repostería de Autor',
    precio: 125,
    imagen_url: '/cheesecake_espresso.jpg',
    maridajeNota: 'Corazón fundente & caramelo profundo',
    maridajeRazon: 'La clásica corona de espuma elástica eleva la suntuosidad del queso crema tostado.'
  },
  'mocha-olancho': {
    id: 16,
    nombre: 'Éclair Francés de Crema de Espresso',
    categoria: 'Repostería de Autor',
    precio: 75,
    imagen_url: '/eclair_espresso.jpg',
    maridajeNota: 'Ganache de cacao puro & choux crujiente',
    maridajeRazon: 'Una sinfonía de chocolates finos y café que satisface a los paladares más exigentes.'
  },
  'cold-brew-tonic': {
    id: 14,
    nombre: 'Basque Burnt Cheesecake de Café',
    categoria: 'Repostería de Autor',
    precio: 125,
    imagen_url: '/cheesecake_espresso.jpg',
    maridajeNota: 'Contraste efervescente & cremosidad láctea',
    maridajeRazon: 'La quina tónica y las burbujas limpian el paladar con cada bocado de tarta caramelizada.'
  },
  'iced-vanilla-latte': {
    id: 13,
    nombre: 'Croissant Artesanal & Glaseado de Café',
    categoria: 'Repostería de Autor',
    precio: 68,
    imagen_url: '/croissant_cafe.jpg',
    maridajeNota: 'Vainilla natural & hojaldre crujiente',
    maridajeRazon: 'Dúo vespertino idóneo: fresco, perfumado y con notas a mantequilla tostada.'
  }
};

export const ORIGINS = [
  { id: 'marcala', name: 'Marcala Honey SHG', notes: 'Miel de caña, durazno, chocolate con leche', priceMod: 0 },
  { id: 'geisha', name: 'Geisha Santa Bárbara', notes: 'Jazmín, flor de azahar, bergamota', priceMod: 35 },
  { id: 'montecillos', name: 'Montecillos Lavado', notes: 'Cacao amargo, avellana, crema densa', priceMod: 10 },
];

export const MILK_OPTIONS = [
  { id: 'entera', name: 'Leche Entera Cremosa Barista', priceMod: 0 },
  { id: 'avena', name: 'Leche de Avena Barista (Plant-Based)', priceMod: 15 },
  { id: 'almendra', name: 'Leche de Almendras Tostadas', priceMod: 15 },
  { id: 'tonica', name: 'Agua Tónica de Quina Artesanal', priceMod: 20 },
  { id: 'ninguna', name: 'Puro / Sin leche', priceMod: 0 },
];

export const TOPPING_OPTIONS = [
  { id: 'ninguno', name: 'Sin adición aromática', priceMod: 0 },
  { id: 'canela', name: 'Canela en rama de Ceiba rallada', priceMod: 5 },
  { id: 'vainilla', name: 'Vaina de Vainilla de Roatán', priceMod: 12 },
  { id: 'miel', name: 'Miel de Abeja Silvestre de la Sierra', priceMod: 10 },
];
