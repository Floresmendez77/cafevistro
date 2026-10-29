import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { formatLempiras } from '../utils/formatCurrency';
import { Product } from '../types';
import {
  DRINK_PRESETS,
  PASTRY_PAIRINGS,
  ORIGINS,
  MILK_OPTIONS,
  TOPPING_OPTIONS,
  EspressoDrinkRecipe,
} from './espresso/espressoData';
import { DrinkVisualizer } from './espresso/DrinkVisualizer';
import { RecipeSelector } from './espresso/RecipeSelector';
import { CustomizationControls } from './espresso/CustomizationControls';
import { PastryPairingCard } from './espresso/PastryPairingCard';

export { DRINK_PRESETS, PASTRY_PAIRINGS, ORIGINS, MILK_OPTIONS, TOPPING_OPTIONS };
export type { EspressoDrinkRecipe };

export const InteractiveEspressoBar: React.FC = () => {
  const { addToCart, showToast } = useStore();

  const [activeCategory, setActiveCategory] = useState<'todos' | 'espresso' | 'leche' | 'frio' | 'especial'>('todos');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('espresso-doppio');

  const [selectedOrigin, setSelectedOrigin] = useState<string>('marcala');
  const [selectedMilk, setSelectedMilk] = useState<string>('ninguna');
  const [selectedShot, setSelectedShot] = useState<'solo' | 'doppio' | 'ristretto' | 'lungo'>('doppio');
  const [selectedTemp, setSelectedTemp] = useState<'caliente' | 'frio'>('caliente');
  const [selectedTopping, setSelectedTopping] = useState<string>('ninguno');

  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [orderAddedToast, setOrderAddedToast] = useState(false);
  const [pairingAddedToast, setPairingAddedToast] = useState(false);
  const [comboAddedToast, setComboAddedToast] = useState(false);

  const activeRecipe = useMemo(() => {
    return DRINK_PRESETS.find((r) => r.id === selectedRecipeId) || DRINK_PRESETS[0];
  }, [selectedRecipeId]);

  const currentPairing = useMemo(() => {
    return PASTRY_PAIRINGS[selectedRecipeId] || PASTRY_PAIRINGS['espresso-doppio'];
  }, [selectedRecipeId]);

  const handleSelectRecipe = (recipe: EspressoDrinkRecipe) => {
    setSelectedRecipeId(recipe.id);
    setSelectedTemp(recipe.defaultTemp);
    setSelectedMilk(recipe.defaultMilk);
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
    setTilt({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleAddCustomDrinkToCart = () => {
    const customProduct: Product = {
      id: 99000 + Math.floor(Math.random() * 999),
      nombre: `${activeRecipe.name} Personalizado (${currentOrigin.name})`,
      descripcion: `Creación Barista: ${activeRecipe.name} con ${currentOrigin.name}, shot ${selectedShot.toUpperCase()}, ${currentMilk.name}, ${currentTopping.name} (${selectedTemp}).`,
      precio: totalPrice,
      stock: 50,
      imagen_url: activeRecipe.image,
      categoria: 'Bebidas Preparadas',
      eco_impact: 'Servido en empaque 100% compostable o vaso térmico reutilizable',
    };

    addToCart(customProduct, 1, undefined);
    setOrderAddedToast(true);
    showToast(`☕ ¡${activeRecipe.name} agregado al carrito!`, 'success');
    setTimeout(() => setOrderAddedToast(false), 2200);
  };

  const handleAddPairingToCart = () => {
    const pairingProduct: Product = {
      id: currentPairing.id,
      nombre: currentPairing.nombre,
      descripcion: `Maridaje sugerido: ${currentPairing.maridajeRazon}`,
      precio: currentPairing.precio,
      stock: 30,
      imagen_url: currentPairing.imagen_url,
      categoria: currentPairing.categoria,
      eco_impact: 'Repostería artesanal horneada con energía limpia',
    };

    addToCart(pairingProduct, 1, undefined);
    setPairingAddedToast(true);
    showToast(`🥐 ¡${currentPairing.nombre} agregado al carrito!`, 'success');
    setTimeout(() => setPairingAddedToast(false), 2200);
  };

  const handleAddComboToCart = () => {
    const customProduct: Product = {
      id: 99000 + Math.floor(Math.random() * 999),
      nombre: `${activeRecipe.name} (${currentOrigin.name})`,
      descripcion: `Creación Barista: ${activeRecipe.name} con ${currentOrigin.name}, shot ${selectedShot.toUpperCase()}, ${currentMilk.name}.`,
      precio: totalPrice,
      stock: 50,
      imagen_url: activeRecipe.image,
      categoria: 'Bebidas Preparadas',
      eco_impact: 'Servido en empaque 100% compostable',
    };

    const pairingProduct: Product = {
      id: currentPairing.id,
      nombre: currentPairing.nombre,
      descripcion: `Maridaje Barista: ${currentPairing.maridajeRazon}`,
      precio: currentPairing.precio,
      stock: 30,
      imagen_url: currentPairing.imagen_url,
      categoria: currentPairing.categoria,
      eco_impact: 'Repostería artesanal con ingredientes de comercio justo',
    };

    addToCart(customProduct, 1, undefined);
    addToCart(pairingProduct, 1, undefined);

    setComboAddedToast(true);
    showToast(`★ ¡Dúo Barista (${activeRecipe.name} + ${currentPairing.nombre}) agregado!`, 'success');
    setTimeout(() => setComboAddedToast(false), 2400);
  };

  return (
    <div className="relative my-8 rounded-3xl overflow-hidden p-1">
      {/* BACKGROUND DEFOCUSED SHAPES & ORBS FOR PARALLAX GLASS DEPTH */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="orb-animate-1 absolute -top-24 -left-20 w-96 h-96 rounded-full bg-gradient-to-tr from-[#B89778]/35 to-amber-600/30 blur-[90px]" />
        <div className="orb-animate-2 absolute -bottom-32 -right-16 w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-orange-950/40 via-[#B89778]/25 to-amber-700/30 blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-amber-500/15 blur-[80px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* MAIN GLASS CONTAINER */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-2xl">
        <RecipeSelector
          filteredRecipes={filteredRecipes}
          activeRecipe={activeRecipe}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onSelectRecipe={handleSelectRecipe}
        />

        {/* WORKSTATION: INTERACTIVE GLASS CUP ANATOMY + CUSTOMIZER */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <DrinkVisualizer
            activeRecipe={activeRecipe}
            selectedTemp={selectedTemp}
            selectedMilk={selectedMilk}
            selectedShot={selectedShot}
            currentMilkName={currentMilk.name}
            tilt={tilt}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />

          {/* RIGHT 7 COLS: CUSTOMIZER PANELS */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <CustomizationControls
              selectedOrigin={selectedOrigin}
              setSelectedOrigin={setSelectedOrigin}
              selectedShot={selectedShot}
              setSelectedShot={setSelectedShot}
              selectedTemp={selectedTemp}
              setSelectedTemp={setSelectedTemp}
              selectedMilk={selectedMilk}
              setSelectedMilk={setSelectedMilk}
              selectedTopping={selectedTopping}
              setSelectedTopping={setSelectedTopping}
              currentOrigin={currentOrigin}
              currentMilk={currentMilk}
            />

            <PastryPairingCard
              currentPairing={currentPairing}
              totalPrice={totalPrice}
              pairingAddedToast={pairingAddedToast}
              comboAddedToast={comboAddedToast}
              onAddPairing={handleAddPairingToCart}
              onAddCombo={handleAddComboToCart}
            />

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
