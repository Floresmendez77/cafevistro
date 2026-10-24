import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { formatLempiras } from '../utils/formatCurrency';
import { Product } from '../types';

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
      foamPct: 20, // Crema dorada
      milkPct: 0,
      coffeePct: 80,
    },
    notes: ['Crema de Avellana', 'Chocolate Amargo', 'Notas Cítricas'],
    extractionRatio: '1:2 (18g in / 36g out)',
    image: '/espresso_shot.jpg',
  },
  {
    id: 'cortado',
    name: 'Cortado Tradicional',
    subtitle: 'Equilibrio 1:1 en Vaso Gibraltar',
    category: 'leche',
    basePrice: 65,
    description: 'Espresso doble cortado en partes iguales con leche texturizada sedosa que suaviza la acidez sin opacar el café.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 15,
      milkPct: 45,
      coffeePct: 40,
    },
    notes: ['Caramelo', 'Cacao Dulce', 'Cremoso'],
    extractionRatio: '1:1 Café y Leche (60ml / 60ml)',
    image: '/espresso_shot.jpg',
  },
  {
    id: 'flat-white',
    name: 'Flat White Barista',
    subtitle: 'Ristretto con Microespuma Sedosa',
    category: 'leche',
    basePrice: 75,
    description: 'Doble ristretto intenso con microespuma de leche aterciopelada de textura vítrea y latte art minimalista.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'ristretto',
    anatomy: {
      foamPct: 10,
      milkPct: 60,
      coffeePct: 30,
    },
    notes: ['Miel de Caña', 'Avellana Tostada', 'Mantequilla'],
    extractionRatio: '1:1.5 Ristretto con Leche Sedosa',
    image: '/flat_white_art.jpg',
  },
  {
    id: 'affogato-artesanal',
    name: 'Affogato al Caffè',
    subtitle: 'Gelato Fior di Latte & Espresso Hirviendo',
    category: 'especial',
    basePrice: 95,
    description: 'Esfera de gelato artesanal de vainilla de Roatán ahogada en el acto por un doppio espresso Marcala hirviendo.',
    defaultTemp: 'frio',
    defaultMilk: 'ninguna',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 15,
      milkPct: 0,
      coffeePct: 35,
      specialPct: 50,
      specialName: 'Gelato Vainilla Roatán',
    },
    notes: ['Contraste Térmico', 'Vainilla Silvestre', 'Crema Sedosa'],
    extractionRatio: '60ml Espresso Caliente sobre 90g Gelato',
    image: '/affogato_artesanal.jpg',
  },
  {
    id: 'carajillo-altura',
    name: 'Carajillo de Altura',
    subtitle: 'Licor 43 & Espresso Shaken en las Rocas',
    category: 'frio',
    basePrice: 135,
    description: 'Coctelería barista: espresso doble recién extraído agitado enérgicamente con Licor 43, hielo roca y piel de naranja.',
    defaultTemp: 'frio',
    defaultMilk: 'ninguna',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 15,
      milkPct: 0,
      coffeePct: 40,
      specialPct: 45,
      specialName: 'Licor 43 & Naranja',
    },
    notes: ['Licor Especiado', 'Naranja Quemada', 'Textura Aterciopelada'],
    extractionRatio: '60ml Espresso + 45ml Licor 43 Shaken',
    image: '/carajillo_espresso.jpg',
  },
  {
    id: 'capuchino',
    name: 'Capuchino Artesanal',
    subtitle: 'La Clásica Corona de Espuma',
    category: 'leche',
    basePrice: 70,
    description: 'Equilibrio perfecto en tres tercios: espresso intenso, leche caliente emulsionada y nube de espuma elástica.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 35,
      milkPct: 35,
      coffeePct: 30,
    },
    notes: ['Nuez Moscada', 'Vainilla', 'Textura Sedosa'],
    extractionRatio: '1/3 Espresso, 1/3 Leche, 1/3 Espuma',
    image: '/tazas_ceramica.jpg',
  },
  {
    id: 'latte-macchiato',
    name: 'Latte Macchiato Cristal',
    subtitle: 'Capas Visibles en Vidrio Puro',
    category: 'leche',
    basePrice: 80,
    description: 'Leche cremosa manchada al verter el espresso lentamente a través de la espuma, formando tres capas cristalinas.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'solo',
    anatomy: {
      foamPct: 25,
      milkPct: 55,
      coffeePct: 20,
    },
    notes: ['Dulzor Natural', 'Vainilla', 'Cuerpo Suave'],
    extractionRatio: '200ml Leche Texturizada + 30ml Espresso',
    image: '/iced_latte.jpg',
  },
  {
    id: 'mocha-olancho',
    name: 'Mocha Cacao de Olancho',
    subtitle: 'Ganache de Cacao Puro 75%',
    category: 'especial',
    basePrice: 85,
    description: 'Espresso doble fusionado con ganache fundido de cacao fino de aroma de Olancho, leche vaporizada y polvo amargo.',
    defaultTemp: 'caliente',
    defaultMilk: 'entera',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 15,
      milkPct: 45,
      coffeePct: 25,
      specialPct: 15,
      specialName: 'Ganache Cacao 75%',
    },
    notes: ['Cacao Ancestral', 'Frutos Rojos', 'Trufa'],
    extractionRatio: 'Espresso + 20g Ganache + 150ml Leche',
    image: '/cafe_marcala.jpg',
  },
  {
    id: 'cold-brew-tonic',
    name: 'Cold Brew Tonic Espumoso',
    subtitle: 'Extracción Fría 18h & Tónica',
    category: 'frio',
    basePrice: 85,
    description: 'Concentrado de cold brew infusionado 18 horas sobre agua tónica artesanal de quina, rodaja de naranja deshidratada y hielo.',
    defaultTemp: 'frio',
    defaultMilk: 'tonica',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 10,
      milkPct: 0,
      coffeePct: 45,
      specialPct: 45,
      specialName: 'Tónica de Quina & Hielo',
    },
    notes: ['Cítricos', 'Burbujas Finas', 'Acidez Refrescante'],
    extractionRatio: '90ml Cold Brew + 120ml Agua Tónica',
    image: '/cold_brew.jpg',
  },
  {
    id: 'iced-vanilla-latte',
    name: 'Iced Vanilla Latte Cristal',
    subtitle: 'Refrescante con Vainilla de Roatán',
    category: 'frio',
    basePrice: 85,
    description: 'Espresso doppio extraído al momento sobre hielo cristalino cortado a mano, leche cremosa y vaina pura de vainilla.',
    defaultTemp: 'frio',
    defaultMilk: 'avena',
    defaultShot: 'doppio',
    anatomy: {
      foamPct: 8,
      milkPct: 52,
      coffeePct: 25,
      specialPct: 15,
      specialName: 'Hielo Cristal & Vainilla',
    },
    notes: ['Vainilla Bourbon', 'Refrescante', 'Caramelo Rubio'],
    extractionRatio: '60ml Espresso + 140ml Leche sobre Hielo',
    image: '/iced_latte.jpg',
  },
];

export interface PastryPairingItem {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen_url: string;
  maridajeNota: string;
  maridajeRazon: string;
}

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

const ORIGINS = [
  { id: 'marcala', name: 'Marcala Honey SHG', notes: 'Miel de caña, durazno, chocolate con leche', priceMod: 0 },
  { id: 'geisha', name: 'Geisha Santa Bárbara', notes: 'Jazmín, flor de azahar, bergamota', priceMod: 35 },
  { id: 'montecillos', name: 'Montecillos Lavado', notes: 'Cacao amargo, avellana, crema densa', priceMod: 10 },
];

const MILK_OPTIONS = [
  { id: 'entera', name: 'Leche Entera Cremosa Barista', priceMod: 0 },
  { id: 'avena', name: 'Leche de Avena Barista (Plant-Based)', priceMod: 15 },
  { id: 'almendra', name: 'Leche de Almendras Tostadas', priceMod: 15 },
  { id: 'tonica', name: 'Agua Tónica de Quina Artesanal', priceMod: 20 },
  { id: 'ninguna', name: 'Puro / Sin leche', priceMod: 0 },
];

const TOPPING_OPTIONS = [
  { id: 'ninguno', name: 'Sin adición aromática', priceMod: 0 },
  { id: 'canela', name: 'Canela en rama de Ceiba rallada', priceMod: 5 },
  { id: 'vainilla', name: 'Vaina de Vainilla de Roatán', priceMod: 12 },
  { id: 'miel', name: 'Miel de Abeja Silvestre de la Sierra', priceMod: 10 },
];

export const InteractiveEspressoBar: React.FC = () => {
  const { addToCart, setIsCartDrawerOpen } = useStore();

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('espresso-doppio');
  const [activeCategory, setActiveCategory] = useState<'todos' | 'espresso' | 'leche' | 'frio' | 'especial'>('todos');
  
  // Customization state
  const [selectedOrigin, setSelectedOrigin] = useState<string>('marcala');
  const [selectedMilk, setSelectedMilk] = useState<string>('ninguna');
  const [selectedTemp, setSelectedTemp] = useState<'caliente' | 'frio'>('caliente');
  const [selectedShot, setSelectedShot] = useState<'solo' | 'doppio' | 'ristretto' | 'lungo'>('doppio');
  const [selectedTopping, setSelectedTopping] = useState<string>('ninguno');
  const [orderAddedToast, setOrderAddedToast] = useState(false);
  const [pairingAddedToast, setPairingAddedToast] = useState(false);
  const [comboAddedToast, setComboAddedToast] = useState(false);

  // Parallax tilt effect values
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const activeRecipe = useMemo(() => {
    return DRINK_PRESETS.find((r) => r.id === selectedRecipeId) || DRINK_PRESETS[0];
  }, [selectedRecipeId]);

  const currentPairing = useMemo(() => {
    return PASTRY_PAIRINGS[selectedRecipeId] || PASTRY_PAIRINGS['espresso-doppio'];
  }, [selectedRecipeId]);

  // When recipe changes, preset defaults
  const handleSelectRecipe = (recipe: EspressoDrinkRecipe) => {
    setSelectedRecipeId(recipe.id);
    setSelectedMilk(recipe.defaultMilk);
    setSelectedTemp(recipe.defaultTemp);
    setSelectedShot(recipe.defaultShot);
    setSelectedTopping('ninguno');
  };

  const currentOrigin = ORIGINS.find((o) => o.id === selectedOrigin) || ORIGINS[0];
  const currentMilk = MILK_OPTIONS.find((m) => m.id === selectedMilk) || MILK_OPTIONS[0];
  const currentTopping = TOPPING_OPTIONS.find((t) => t.id === selectedTopping) || TOPPING_OPTIONS[0];

  const shotMod = selectedShot === 'doppio' ? 10 : selectedShot === 'lungo' ? 5 : 0;
  const totalPrice = activeRecipe.basePrice + currentOrigin.priceMod + currentMilk.priceMod + currentTopping.priceMod + shotMod;

  const filteredRecipes = useMemo(() => {
    if (activeCategory === 'todos') return DRINK_PRESETS;
    return DRINK_PRESETS.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleAddCustomDrinkToCart = () => {
    const customProduct: Product = {
      id: 9000 + Math.floor(Math.random() * 900),
      nombre: `${activeRecipe.name} • Barista Custom`,
      descripcion: `${activeRecipe.subtitle} preparado con ${currentOrigin.name}, base ${currentMilk.name}, extracción ${selectedShot.toUpperCase()}, ${selectedTemp === 'caliente' ? 'Caliente 65°C' : 'Sobre Hielo'} y ${currentTopping.name}.`,
      precio: totalPrice,
      imagen_url: activeRecipe.image,
      categoria: 'Bebidas de Especialidad',
      stock: 99,
      eco_impact: '100% Orgánico Hondureño',
    };

    addToCart(customProduct, 1);
    setOrderAddedToast(true);
    setTimeout(() => {
      setOrderAddedToast(false);
      setIsCartDrawerOpen(true);
    }, 900);
  };

  const handleAddPairingToCart = () => {
    const pairingProduct: Product = {
      id: currentPairing.id,
      nombre: currentPairing.nombre,
      descripcion: `${currentPairing.maridajeNota}. Maridaje ideal con ${activeRecipe.name}: ${currentPairing.maridajeRazon}`,
      precio: currentPairing.precio,
      imagen_url: currentPairing.imagen_url,
      categoria: currentPairing.categoria,
      stock: 50,
      eco_impact: 'Elaboración artesanal local 100% fresca',
    };

    addToCart(pairingProduct, 1);
    setPairingAddedToast(true);
    setTimeout(() => {
      setPairingAddedToast(false);
      setIsCartDrawerOpen(true);
    }, 900);
  };

  const handleAddComboToCart = () => {
    // Add drink
    const customProduct: Product = {
      id: 9000 + Math.floor(Math.random() * 900),
      nombre: `${activeRecipe.name} • Barista Custom`,
      descripcion: `${activeRecipe.subtitle} preparado con ${currentOrigin.name}, base ${currentMilk.name}, extracción ${selectedShot.toUpperCase()}, ${selectedTemp === 'caliente' ? 'Caliente 65°C' : 'Sobre Hielo'} y ${currentTopping.name}.`,
      precio: totalPrice,
      imagen_url: activeRecipe.image,
      categoria: 'Bebidas de Especialidad',
      stock: 99,
      eco_impact: '100% Orgánico Hondureño',
    };
    addToCart(customProduct, 1);

    // Add pairing pastry
    const pairingProduct: Product = {
      id: currentPairing.id,
      nombre: `${currentPairing.nombre} (Dúo Barista)`,
      descripcion: `Maridaje perfecto de autor con ${activeRecipe.name}. ${currentPairing.maridajeNota}`,
      precio: currentPairing.precio,
      imagen_url: currentPairing.imagen_url,
      categoria: currentPairing.categoria,
      stock: 50,
      eco_impact: 'Elaboración artesanal diaria',
    };
    addToCart(pairingProduct, 1);

    setComboAddedToast(true);
    setTimeout(() => {
      setComboAddedToast(false);
      setIsCartDrawerOpen(true);
    }, 1000);
  };

  return (
    <div className="relative my-8 rounded-3xl overflow-hidden p-1">
      {/* BACKGROUND DEFOCUSED SHAPES & ORBS FOR PARALLAX GLASS DEPTH */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="orb-animate-1 absolute -top-24 -left-20 w-96 h-96 rounded-full bg-gradient-to-tr from-[#B89778]/35 to-amber-600/30 blur-[90px]" />
        <div className="orb-animate-2 absolute -bottom-32 -right-16 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-orange-950/40 via-[#B89778]/25 to-amber-700/30 blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-amber-500/15 blur-[80px]" />
        {/* Subtle glass reflection noise & grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* MAIN GLASS CONTAINER */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
        
        {/* HEADER SECTION WITH GLASS BADGE */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[#D4B99F] text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Barra de Espresso Interactiva • Glassmorphism Barista Station
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight drop-shadow-md">
              Crea tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EED5B8] via-[#B89778] to-[#8F6A48]">Extracción Perfecta</span>
            </h2>
            <p className="text-sm md:text-base text-[#D4B99F]/90 max-w-2xl mt-2 leading-relaxed font-sans">
              Menú interactivo translúcido con perfiles de extracción artesanal, visualización anatómica de capas en vaso de vidrio y personalización de granos hondureños de altura.
            </p>
          </div>

          {/* CATEGORY SELECTOR PILLS */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'espresso', label: 'Puros' },
              { id: 'leche', label: 'Con Leche' },
              { id: 'frio', label: 'En las Rocas' },
              { id: 'especial', label: 'De Autor' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'glass-pill-active border-amber-300/40 text-white shadow-[0_0_15px_rgba(184,151,120,0.5)]'
                    : 'glass-pill border-white/10 text-[#D4B99F] hover:text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* DRINK PRESETS CAROUSEL / GRID */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-widest font-mono text-[#B89778] font-bold">
              1. Selecciona tu Receta de Base
            </span>
            <span className="text-xs text-[#D4B99F]">
              {filteredRecipes.length} recetas de espresso
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {filteredRecipes.map((recipe) => {
              const isSelected = recipe.id === activeRecipe.id;
              return (
                <button
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe)}
                  className={`group relative p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border ${
                    isSelected
                      ? 'bg-white/15 border-[#B89778] shadow-[0_8px_30px_rgba(184,151,120,0.3)] scale-[1.03] -translate-y-1'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Glass reflective gloss */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                  <div className="relative w-14 h-14 rounded-xl overflow-hidden mb-2.5 border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                    />
                    {recipe.category === 'frio' && (
                      <span className="absolute bottom-0.5 right-0.5 bg-blue-500/80 text-[10px] text-white px-1 rounded-sm">
                        ❄
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight font-serif line-clamp-1">
                    {recipe.name}
                  </h4>
                  <span className="text-[11px] font-mono text-[#D4B99F] font-semibold mt-1">
                    {formatLempiras(recipe.basePrice)}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B89778] mt-1.5 shadow-[0_0_8px_#B89778]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* WORKSTATION: INTERACTIVE GLASS CUP ANATOMY + CUSTOMIZER */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT 5 COLS: INTERACTIVE 3D GLASS CUP & LIQUID ANATOMY */}
          <div
            className="lg:col-span-5 relative glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/15 overflow-hidden transition-transform duration-300"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            }}
          >
            {/* Top Gloss Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none" />

            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#EED5B8] uppercase">
                <i className="fas fa-layer-group text-[#B89778]"></i> Anatomía en Vidrio
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-mono border border-white/10">
                {activeRecipe.extractionRatio}
              </span>
            </div>

            {/* THE VISUAL GLASS CUP */}
            <div className="relative my-4 flex flex-col items-center justify-center min-h-[300px]">
              
              {/* Hot Steam or Ice Drops effect */}
              {selectedTemp === 'caliente' ? (
                <div className="flex gap-3 mb-2 opacity-70">
                  <span className="w-1.5 h-6 rounded-full bg-white/30 blur-[1px] animate-pulse" />
                  <span className="w-1.5 h-8 rounded-full bg-white/40 blur-[1px] animate-pulse delay-150" />
                  <span className="w-1.5 h-5 rounded-full bg-white/25 blur-[1px] animate-pulse delay-300" />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs text-cyan-200/80 mb-2 font-mono">
                  <span>🧊 Hielo Cristalino Templado</span>
                </div>
              )}

              {/* The Glass Container with Beveled Rim and Liquid Layers */}
              <div className="relative w-44 sm:w-52 h-64 rounded-b-[40px] rounded-t-lg border-2 border-white/35 p-1 bg-gradient-to-b from-white/15 via-white/5 to-white/10 backdrop-blur-md shadow-[0_20px_45px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-end">
                
                {/* Specular highlights on glass edges */}
                <div className="absolute top-0 left-3 w-1.5 h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-full" />
                <div className="absolute top-0 right-3 w-1 h-full bg-gradient-to-b from-white/20 via-transparent to-white/5 pointer-events-none" />
                <div className="absolute top-1 inset-x-2 h-2 rounded-full border border-white/40 bg-white/10 pointer-events-none" />

                {/* LIQUID LAYER 1: FOAM / CREMA / MICROFOAM (TOP) */}
                {activeRecipe.anatomy.foamPct > 0 && (
                  <div
                    style={{ height: `${activeRecipe.anatomy.foamPct}%` }}
                    className="w-full relative transition-all duration-700 bg-gradient-to-b from-[#E7CBAF] via-[#D4B99F] to-[#B89778] rounded-t-sm border-b border-amber-900/30 flex items-center justify-center shadow-inner group"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:4px_4px]" />
                    <span className="relative z-10 text-[10px] font-bold text-[#2A1C15] tracking-tight uppercase px-1">
                      {selectedMilk === 'ninguna' ? 'Crema Dorada (25%)' : 'Microespuma Sedosa'}
                    </span>
                  </div>
                )}

                {/* LIQUID LAYER 2: MILK / WATER / TONIC (MIDDLE) */}
                {activeRecipe.anatomy.milkPct > 0 && (
                  <div
                    style={{ height: `${activeRecipe.anatomy.milkPct}%` }}
                    className="w-full relative transition-all duration-700 bg-gradient-to-b from-[#F7EFE7]/90 via-[#EFE3D5]/80 to-[#E4D1BF]/90 flex items-center justify-center border-b border-white/20 shadow-inner"
                  >
                    <span className="relative z-10 text-[10px] font-bold text-[#4A372E] uppercase px-1">
                      {currentMilk.name.split('(')[0].replace('Leche de ', '')}
                    </span>
                  </div>
                )}

                {/* LIQUID LAYER 2.5: SPECIAL LAYER (CACAO / TONIC) */}
                {activeRecipe.anatomy.specialPct && activeRecipe.anatomy.specialPct > 0 && (
                  <div
                    style={{ height: `${activeRecipe.anatomy.specialPct}%` }}
                    className="w-full relative transition-all duration-700 bg-gradient-to-b from-amber-950 via-[#3B2219] to-[#20100A] flex items-center justify-center border-b border-white/10 shadow-inner"
                  >
                    <span className="relative z-10 text-[10px] font-bold text-amber-200 uppercase px-1">
                      {activeRecipe.anatomy.specialName}
                    </span>
                  </div>
                )}

                {/* LIQUID LAYER 3: PURE ESPRESSO EXTRACTION (BOTTOM) */}
                {activeRecipe.anatomy.coffeePct > 0 && (
                  <div
                    style={{ height: `${activeRecipe.anatomy.coffeePct}%` }}
                    className="w-full relative transition-all duration-700 bg-gradient-to-b from-[#4A2E1F] via-[#2F1A12] to-[#1A0D08] flex items-center justify-center rounded-b-[36px] shadow-2xl"
                  >
                    <span className="relative z-10 text-[10px] font-mono font-bold text-[#D4B99F] uppercase px-1">
                      Espresso ({selectedShot.toUpperCase()})
                    </span>
                  </div>
                )}
              </div>

              {/* Glass Shadow & Refraction on Surface */}
              <div className="w-36 h-4 rounded-full bg-black/60 blur-md mt-2 shadow-[0_10px_20px_rgba(0,0,0,0.8)]" />
            </div>

            {/* SENSORY TASTING NOTES BADGES */}
            <div className="relative z-10 pt-4 border-t border-white/10">
              <span className="text-[11px] font-mono uppercase text-[#B89778] block mb-2 font-bold">
                Notas Sensoriales en Taza:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeRecipe.notes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-[#F8F1E9] font-medium"
                  >
                    ☕ {note}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS: CUSTOMIZER PANELS */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* INGREDIENTS ACCORDION / TOGGLES */}
            <div className="space-y-5">
              
              {/* OPTION 1: ORIGIN SELECTION */}
              <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2">
                    <i className="fas fa-mountain text-[#B89778]"></i> 2. Finca y Variedad de Grano
                  </label>
                  <span className="text-xs text-[#D4B99F] font-mono">
                    {currentOrigin.priceMod > 0 ? `+${formatLempiras(currentOrigin.priceMod)}` : 'Incluido'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {ORIGINS.map((orig) => (
                    <button
                      key={orig.id}
                      onClick={() => setSelectedOrigin(orig.id)}
                      className={`p-3 rounded-xl text-left transition-all border ${
                        selectedOrigin === orig.id
                          ? 'bg-white/20 border-[#B89778] text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
                      }`}
                    >
                      <div className="font-bold text-xs font-serif text-white">{orig.name}</div>
                      <div className="text-[10px] text-[#D4B99F]/80 line-clamp-1 mt-0.5">{orig.notes}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* OPTION 2: SHOT EXTRACTION & TEMPERATURE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Shots */}
                <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
                  <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2 mb-3">
                    <i className="fas fa-filter text-[#B89778]"></i> 3. Tipo de Extracción
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'solo', label: 'Solo (30ml)' },
                      { id: 'doppio', label: 'Doppio (60ml)' },
                      { id: 'ristretto', label: 'Ristretto (20ml)' },
                      { id: 'lungo', label: 'Lungo (90ml)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedShot(s.id as any)}
                        className={`p-2 rounded-xl text-center font-semibold transition-all border ${
                          selectedShot === s.id
                            ? 'bg-[#B89778] text-[#2A1C15] font-bold border-transparent shadow'
                            : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Temperature */}
                <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
                  <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2 mb-3">
                    <i className="fas fa-thermometer-half text-[#B89778]"></i> 4. Temperatura
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => setSelectedTemp('caliente')}
                      className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                        selectedTemp === 'caliente'
                          ? 'bg-amber-600/40 text-amber-200 border-amber-400/50 shadow'
                          : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
                      }`}
                    >
                      <i className="fas fa-fire-alt text-amber-400"></i> Caliente (65°C)
                    </button>
                    <button
                      onClick={() => setSelectedTemp('frio')}
                      className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                        selectedTemp === 'frio'
                          ? 'bg-cyan-600/40 text-cyan-200 border-cyan-400/50 shadow'
                          : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
                      }`}
                    >
                      <i className="fas fa-snowflake text-cyan-300"></i> Sobre Hielo
                    </button>
                  </div>
                </div>
              </div>

              {/* OPTION 3: MILK & INFUSION BASE */}
              <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2">
                    <i className="fas fa-tint text-[#B89778]"></i> 5. Texturizado o Base
                  </label>
                  <span className="text-xs text-[#D4B99F] font-mono">
                    {currentMilk.priceMod > 0 ? `+${formatLempiras(currentMilk.priceMod)}` : 'Sin recargo'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {MILK_OPTIONS.map((milk) => (
                    <button
                      key={milk.id}
                      onClick={() => setSelectedMilk(milk.id)}
                      className={`p-2.5 rounded-xl text-left transition-all border ${
                        selectedMilk === milk.id
                          ? 'bg-white/20 border-[#B89778] text-white shadow-sm font-bold'
                          : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
                      }`}
                    >
                      <div className="truncate">{milk.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* OPTION 4: BOTANICAL AROMA & SWEETNESS */}
              <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
                <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2 mb-3">
                  <i className="fas fa-seedling text-[#B89778]"></i> 6. Toque Botánico / Topping
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {TOPPING_OPTIONS.map((top) => (
                    <button
                      key={top.id}
                      onClick={() => setSelectedTopping(top.id)}
                      className={`p-2.5 rounded-xl text-left transition-all border ${
                        selectedTopping === top.id
                          ? 'bg-white/20 border-[#B89778] text-white font-bold shadow-sm'
                          : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
                      }`}
                    >
                      <div className="truncate">{top.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CURATED PASTRY PAIRING (MARIDAJE DE REPOSTERÍA) */}
              <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#B89778]/40 bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-[#B89778]/10 relative overflow-hidden group">
                {/* Subtle golden ambient glow */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B89778] animate-pulse" />
                    <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8]">
                      Maridaje de Autor Sugerido
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#B89778] font-bold">
                    Armonía Barista
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
                  {/* Pastry Image */}
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
                    <img
                      src={currentPairing.imagen_url}
                      alt={currentPairing.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] uppercase tracking-wider font-bold bg-[#1C120C]/80 px-1.5 py-0.5 rounded text-[#D4B99F]">
                      Artesanal
                    </span>
                  </div>

                  {/* Pastry Info & Tasting Note */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                        {currentPairing.nombre}
                      </h4>
                      <span className="font-mono font-black text-sm text-[#EED5B8]">
                        {formatLempiras(currentPairing.precio)}
                      </span>
                    </div>

                    <p className="text-xs text-[#D4B99F]/90 mt-1 line-clamp-2 leading-relaxed">
                      {currentPairing.maridajeRazon}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 justify-center sm:justify-start">
                      <span className="text-[10px] text-amber-200/90 font-mono bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                        ✨ {currentPairing.maridajeNota}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct 1-Click Buttons for Pastry & Combo */}
                <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 relative z-10">
                  <span className="text-[11px] text-[#D4B99F]">
                    Disfruta la experiencia gastronómica completa:
                  </span>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleAddPairingToCart}
                      disabled={pairingAddedToast}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                        pairingAddedToast
                          ? 'bg-emerald-500 text-white border-transparent'
                          : 'bg-white/10 border-white/20 text-[#F8F1E9] hover:bg-white/20'
                      }`}
                    >
                      {pairingAddedToast ? '✓ ¡Repostería Agregada!' : `+ Solo Repostería (${formatLempiras(currentPairing.precio)})`}
                    </button>

                    <button
                      onClick={handleAddComboToCart}
                      disabled={comboAddedToast}
                      className={`px-4 py-1.5 rounded-lg text-xs font-serif font-black tracking-wide transition-all shadow cursor-pointer ${
                        comboAddedToast
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gradient-to-r from-amber-500 to-[#B89778] text-[#1E130D] hover:shadow-lg hover:scale-102'
                      }`}
                    >
                      {comboAddedToast ? '✓ ¡Dúo Agregado al Carrito!' : `★ Dúo Barista (${formatLempiras(totalPrice + currentPairing.precio)})`}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* ACTION & PRICING BAR */}
            <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs text-[#D4B99F] uppercase tracking-wider font-mono font-semibold block">
                  Total Extracción Artesanal:
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-serif font-black text-white">
                    {formatLempiras(totalPrice)}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <i className="fas fa-leaf"></i> +12 Puntos Eco
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handleAddCustomDrinkToCart}
                  disabled={orderAddedToast}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-xl font-serif font-black text-sm tracking-wide transition-all duration-300 shadow-xl flex items-center justify-center gap-3 cursor-pointer ${
                    orderAddedToast
                      ? 'bg-emerald-500 text-white shadow-emerald-500/50 scale-105'
                      : 'bg-gradient-to-r from-[#D4B99F] via-[#B89778] to-[#997354] text-[#1E130D] hover:shadow-[0_0_25px_rgba(184,151,120,0.6)] hover:scale-[1.02]'
                  }`}
                >
                  {orderAddedToast ? (
                    <>
                      <i className="fas fa-check text-lg"></i>
                      <span>¡Agregado a tu Orden!</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-mug-hot text-lg"></i>
                      <span>Ordenar esta Creación</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
