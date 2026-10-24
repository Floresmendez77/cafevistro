import { Product, BlogPost, User, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    nombre: 'Café Especial Marcala Reserva Orgánica',
    descripcion: 'Café de estricta altura (SHG) cultivado bajo sombra a 1,650 msnm en Marcala, La Paz. Perfil aromático con notas a chocolate amargo, avellana tostada y miel de caña.',
    precio: 195.0,
    stock: 45,
    imagen_url: '/cafe_marcala.jpg',
    categoria: 'Café en Grano y Molido',
    eco_impact: 'Cultivo 100% orgánico bajo sombra que protege las aves y cuencas de Honduras',
    variantes: [
      { nombre_variante: '340g Grano Entero (Tueste Medio)', precio_adicional: 0 },
      { nombre_variante: '340g Molido Medio para Cafetera', precio_adicional: 0 },
      { nombre_variante: '1 Kg Grano Entero (Ahorro Familiar)', precio_adicional: 280 }
    ]
  },
  {
    id: 2,
    nombre: 'Café Geisha Santa Bárbara Edición Limitada',
    descripcion: 'Micro-lote de variedad Geisha de la Finca Santa Elena en Santa Bárbara. Proceso honey artesanal con notas florales a jazmín, bergamota, melocotón y una acidez brillante y sedosa.',
    precio: 380.0,
    stock: 20,
    imagen_url: '/cafe_geisha.jpg',
    categoria: 'Café de Especialidad',
    eco_impact: 'Proceso Honey ecológico que ahorra un 85% de agua en beneficio húmedo',
    variantes: [
      { nombre_variante: 'Bolsa 250g Grano Entero', precio_adicional: 0 },
      { nombre_variante: 'Bolsa 250g Molido Fino V60', precio_adicional: 0 },
      { nombre_variante: 'Lata Hermética Colección 500g', precio_adicional: 340 }
    ]
  },
  {
    id: 3,
    nombre: 'Prensa Francesa de Cobre y Vidrio Borosilicato',
    descripcion: 'Elegante cafetera de prensa francesa con estructura de cobre pulido y vaso de vidrio borosilicato resistente a altas temperaturas. Extrae los aceites esenciales del café para un cuerpo denso y aromático.',
    precio: 450.0,
    stock: 25,
    imagen_url: '/prensa_francesa.jpg',
    categoria: 'Métodos de Extracción',
    eco_impact: 'Cero filtros de papel ni residuos plásticos. Construida para décadas de uso',
    variantes: [
      { nombre_variante: 'Capacidad 600ml (3 Tazas)', precio_adicional: 0 },
      { nombre_variante: 'Capacidad 1000ml (8 Tazas)', precio_adicional: 160 }
    ]
  },
  {
    id: 4,
    nombre: 'Molino Manual Cónico en Acero y Madera de Nogal',
    descripcion: 'Molinillo de café de precisión con muelas cónicas de acero inoxidable grado 420 y cuerpo de madera de nogal natural. Ajuste micrométrico de molienda desde espresso hasta prensa francesa.',
    precio: 680.0,
    stock: 18,
    imagen_url: '/molino_manual.jpg',
    categoria: 'Accesorios Barista',
    eco_impact: 'Molienda manual de cero emisión eléctrica con durabilidad de por vida'
  },
  {
    id: 5,
    nombre: 'Cafetera V60 Cerámica Negro Mate & Servidor de Vidrio',
    descripcion: 'Cono de goteo V60 en cerámica negra mate de alta retención térmica con espirales internas para máxima extracción. Incluye servidor de vidrio con marcas dosificadoras.',
    precio: 390.0,
    stock: 30,
    imagen_url: '/cafetera_v60.jpg',
    categoria: 'Métodos de Extracción',
    eco_impact: 'Cerámica cocida a altas temperaturas con pigmentos minerales 100% no tóxicos'
  },
  {
    id: 6,
    nombre: 'Cold Brew Concentrado 18 Horas (Botella de Vidrio)',
    descripcion: 'Café de especialidad extraído en frío durante 18 horas gota a gota. Suave, achocolatado y con un 65% menos de acidez que el café caliente tradicional. Listo para servir con hielo.',
    precio: 120.0,
    stock: 40,
    imagen_url: '/cold_brew.jpg',
    categoria: 'Bebidas Preparadas',
    eco_impact: 'Botella de vidrio vintage reutilizable con sistema de devolución de envase',
    variantes: [
      { nombre_variante: 'Botella Individual 500ml', precio_adicional: 0 },
      { nombre_variante: 'Pack Semanal (3 Botellas de 500ml)', precio_adicional: 190 }
    ]
  },
  {
    id: 7,
    nombre: 'Set de Tazas y Platillos de Cerámica Artesanal (2 Unidades)',
    descripcion: 'Juego de dos tazas artesanales estilo flat white/capuchino con platillos de terracota. Textura moteada en crema y barro cocido, moldeadas a mano por alfareros hondureños.',
    precio: 280.0,
    stock: 22,
    imagen_url: '/tazas_ceramica.jpg',
    categoria: 'Vajilla y Hogar',
    eco_impact: 'Alfarería comunitaria local que apoya economías artesanales de Honduras'
  },
  {
    id: 8,
    nombre: 'Chorreador Tradicional Hondureño de Madera y Tela',
    descripcion: 'El método tradicional hondureño para colar café en su máxima expresión. Soporte de madera noble tallada con sello "Hecho en Honduras" y bolsa de filtro de tela de algodón orgánico.',
    precio: 260.0,
    stock: 35,
    imagen_url: '/chorreador_cafe.jpg',
    categoria: 'Métodos de Extracción',
    eco_impact: 'Filtro de algodón 100% orgánico lavable y reutilizable más de 300 veces'
  },
  {
    id: 9,
    nombre: 'Tamper Barista Pro en Acero Quirúrgico & Palo Rosa',
    descripcion: 'Prensador ergonómico de 58mm para café espresso profesional. Base plana en acero inoxidable 304 calibrada a peso perfecto y mango de madera pulida para un apisonado uniforme.',
    precio: 310.0,
    stock: 24,
    imagen_url: '/tamper_barista.jpg',
    categoria: 'Accesorios Barista',
    eco_impact: 'Materiales nobles sin plásticos que garantizan precisión por décadas'
  },
  {
    id: 10,
    nombre: 'Espresso Doble de Especialidad Marcala (Taza Servida Barista)',
    descripcion: 'Extracción pura de café de estricta altura de Marcala. Crema densa y avellanada de persistencia prolongada, cuerpo untuoso y notas intensas a chocolate oscuro y cáscara de naranja.',
    precio: 65.0,
    stock: 50,
    imagen_url: '/espresso_shot.jpg',
    categoria: 'Bebidas Preparadas',
    eco_impact: 'Granos 100% orgánicos de comercio justo con huella de carbono neutral compensada',
    variantes: [
      { nombre_variante: 'Extracción Simple (30ml)', precio_adicional: 0 },
      { nombre_variante: 'Doble Ristretto Intenso (40ml)', precio_adicional: 10 },
      { nombre_variante: 'Espresso Doppio Signature (60ml)', precio_adicional: 15 }
    ]
  },
  {
    id: 11,
    nombre: 'Iced Latte Macchiato en Vaso Cristalino',
    descripcion: 'Bebida de tres capas servida en vaso de vidrio facetado: sirope artesanal de vainilla silvestre, leche fresca texturizada sobre hielo tallado y corona de espresso doppio recién extraído.',
    precio: 85.0,
    stock: 35,
    imagen_url: '/iced_latte.jpg',
    categoria: 'Bebidas Preparadas',
    eco_impact: 'Servido en vaso de vidrio reutilizable con pajilla de bambú natural biodegradable',
    variantes: [
      { nombre_variante: 'Leche Entera Barista (12oz)', precio_adicional: 0 },
      { nombre_variante: 'Leche de Avena Barista Plant-Based (12oz)', precio_adicional: 15 },
      { nombre_variante: 'Edición Vainilla de Roatán Grande (16oz)', precio_adicional: 25 }
    ]
  },
  {
    id: 12,
    nombre: 'Tiramisú Tradicional al Espresso Marcala',
    descripcion: 'Postre insignia italiano elaborado con savoiardi empapados en café espresso SHG de Marcala recién extraído y licor de café, capas untuosas de crema de mascarpone auténtico y velo espolvoreado de cacao amargo holandés.',
    precio: 110.0,
    stock: 28,
    imagen_url: '/tiramisu_espresso.jpg',
    categoria: 'Repostería de Autor',
    eco_impact: 'Empaque biodegradable de caña de azúcar 100% compostable sin plásticos',
    variantes: [
      { nombre_variante: 'Porción Individual Gourmet (180g)', precio_adicional: 0 },
      { nombre_variante: 'Caja Dúo Degustación con Grano Tostado', precio_adicional: 95 }
    ]
  },
  {
    id: 13,
    nombre: 'Croissant Artesanal de Mantequilla & Glaseado de Café',
    descripcion: 'Hojaldre francés fermentado lentamente durante 72 horas con pura mantequilla de pastura. Horneado a corteza crocante caramelizada, cubierto con glaseado sedoso de infusión de café espresso y almendras tostadas fileteadas.',
    precio: 68.0,
    stock: 35,
    imagen_url: '/croissant_cafe.jpg',
    categoria: 'Repostería de Autor',
    eco_impact: 'Horneado en hornos solares térmicos y empacado en papel kraft reciclado',
    variantes: [
      { nombre_variante: 'Clásico Glaseado al Café', precio_adicional: 0 },
      { nombre_variante: 'Relleno de Crema de Avellanas & Moca', precio_adicional: 22 }
    ]
  },
  {
    id: 14,
    nombre: 'Basque Burnt Cheesecake de Café & Caramelo Salado',
    descripcion: 'Tarta de queso estilo Donostia horneada a alta temperatura para lograr una superficie tostada acaramelada y un corazón cremoso fundente, infusionada con extracto de espresso de especialidad y caramelo con sal marina de San Lorenzo.',
    precio: 125.0,
    stock: 18,
    imagen_url: '/cheesecake_espresso.jpg',
    categoria: 'Repostería de Autor',
    eco_impact: 'Ingredientes de granjas lecheras regenerativas locales de Olancho',
    variantes: [
      { nombre_variante: 'Rebanada Cremosa de Tarta', precio_adicional: 0 },
      { nombre_variante: 'Tarta Entera Artesanal (6 Porciones)', precio_adicional: 480 }
    ]
  },
  {
    id: 15,
    nombre: 'Affogato al Caffè con Gelato de Vainilla de Roatán',
    descripcion: 'La suprema combinación italo-hondureña: una generosa bola de helado artesanal fior di latte con semillas de vainilla silvestre de Roatán, ahogada al momento con un shot doble de espresso hirviendo con crema densa.',
    precio: 95.0,
    stock: 30,
    imagen_url: '/affogato_artesanal.jpg',
    categoria: 'Bebidas Preparadas',
    eco_impact: 'Servido en cristalería grabada reutilizable o vaso térmico de bagazo',
    variantes: [
      { nombre_variante: 'Gelato de Vainilla Roatán Clásico', precio_adicional: 0 },
      { nombre_variante: 'Gelato de Avellana Piamonte Artesanal', precio_adicional: 18 },
      { nombre_variante: 'Doble Shot Espresso de Altura Extra', precio_adicional: 20 }
    ]
  },
  {
    id: 16,
    nombre: 'Éclair Francés de Crema de Espresso & Cobertura Espejo',
    descripcion: 'Masa choux crujiente y aireada rellena de suntuosa crema pastelera mousseline aromatizada con espresso de Santa Bárbara, coronada con glaseado espejo de ganache de café y copos de oro comestible.',
    precio: 75.0,
    stock: 22,
    imagen_url: '/eclair_espresso.jpg',
    categoria: 'Repostería de Autor',
    eco_impact: 'Empaque de celulosa vegetal transparente 100% biodegradable en 60 días',
    variantes: [
      { nombre_variante: 'Éclair Individual de Colección', precio_adicional: 0 },
      { nombre_variante: 'Trilogía Éclairs (Espresso, Caramelo, Cacao)', precio_adicional: 130 }
    ]
  },
  {
    id: 17,
    nombre: 'Carajillo de Altura con Licor 43 & Café Marcala',
    descripcion: 'Cóctel emblemático servido en vaso old fashioned tallado con hielo cristalino artesanal: doble shot de espresso Marcala recién preparado agitado con Licor 43 especiado y un perfume de piel de naranja quemada.',
    precio: 135.0,
    stock: 25,
    imagen_url: '/carajillo_espresso.jpg',
    categoria: 'Bebidas Preparadas',
    eco_impact: 'Hielo elaborado con agua purificada de manantial filtrada por osmosis inversa',
    variantes: [
      { nombre_variante: 'Carajillo Shaken Clásico (En las Rocas)', precio_adicional: 0 },
      { nombre_variante: 'Carajillo Ahumado con Madera de Café', precio_adicional: 25 }
    ]
  },
  {
    id: 18,
    nombre: 'Flat White de Especialidad con Microespuma Sedosa',
    descripcion: 'Doble ristretto extraído a 9 bares de presión con leche emulsionada a textura de terciopelo líquido y microespuma brillante sin burbujas. Decorado con latte art de tulipán o rosetta.',
    precio: 78.0,
    stock: 40,
    imagen_url: '/flat_white_art.jpg',
    categoria: 'Bebidas Preparadas',
    eco_impact: 'Taza de cerámica térmica o vaso para llevar libre de polietileno',
    variantes: [
      { nombre_variante: 'Taza 6oz Leche Entera Barista', precio_adicional: 0 },
      { nombre_variante: 'Taza 6oz Leche de Avena Barista Edition', precio_adicional: 15 },
      { nombre_variante: 'Taza 6oz Leche de Almendras Artesanal', precio_adicional: 15 }
    ]
  }
];

export const INITIAL_USER: User = {
  id: 1,
  nombre_completo: 'Stephen Andrew',
  email: 'sthephenandrew56@gmail.com',
  telefono: '+504 8791-7652',
  direccion: 'Colonia Palmira, Tegucigalpa, Francisco Morazán',
  eco_points: 180
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 1001,
    usuario_id: 1,
    fecha_pedido: '2026-10-18',
    total: 390.0,
    subtotal: 390.0,
    descuento: 0,
    sucursal: 'Mall Multiplaza',
    estado: 'entregado',
    puntos_ganados: 39,
    items: [
      {
        id: 1,
        nombre: 'Café Especial Marcala Reserva Orgánica',
        cantidad: 2,
        precio_unitario: 195.0,
        imagen_url: '/cafe_marcala.jpg'
      }
    ]
  },
  {
    id: 1002,
    usuario_id: 1,
    fecha_pedido: '2026-10-23',
    total: 380.0,
    subtotal: 380.0,
    descuento: 0,
    sucursal: 'Mall Galerías',
    estado: 'pendiente',
    puntos_ganados: 38,
    items: [
      {
        id: 2,
        nombre: 'Café Geisha Santa Bárbara Edición Limitada',
        cantidad: 1,
        precio_unitario: 380.0,
        imagen_url: '/cafe_geisha.jpg'
      }
    ]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: 'El Secreto del Café de Marcala: Altura, Suelo y Tradición',
    resumen: 'Por qué la Denominación de Origen Marcala produce uno de los perfiles en taza más codiciados del mundo.',
    content: 'Enclavada en el departamento de La Paz a más de 1,600 metros de altitud, Marcala fue la primera Denominación de Origen de café protegida en Centroamérica. Su suelo volcánico rico en minerales, la sombra de bosques nativos de liquidámbar y los vientos frescos de montaña permiten que las cerezas de café maduren lentamente, concentrando azúcares naturales y aceites esenciales que dan vida a notas inconfundibles de chocolate amargo, caramelo y flores silvestres.',
    tag: 'Origen y Terroir',
    readTime: '3 min de lectura'
  },
  {
    id: 2,
    title: 'Guía de Extracción: V60 vs Prensa Francesa, ¿cuál es tu método?',
    resumen: 'Compara claridad aromática vs cuerpo denso para encontrar tu método de preparación perfecto.',
    content: 'Si buscas una taza limpia, brillante y aromática donde brillen las notas florales y frutales de un café Geisha, el método de goteo V60 es insuperable gracias a su filtrado fino y extracción por gravedad. Por otro lado, si prefieres un café con cuerpo robusto, sedoso y sensación envolvente para acompañar tus mañanas, la prensa francesa retiene los aceites naturales del café gracias a su émbolo de malla metálica.',
    tag: 'Guía Barista',
    readTime: '4 min de lectura'
  },
  {
    id: 3,
    title: 'Por qué moler el café al momento transforma por completo tu taza',
    resumen: 'La oxidación del grano molido y cómo conservar el 90% de los compuestos aromáticos.',
    content: 'En tan solo 15 minutos después de moler el café, se evaporan hasta el 60% de los compuestos aromáticos más volátiles. Invertir en un molino manual con muelas cónicas te permite moler exactamente la dosis que vas a preparar al momento, garantizando una crema espesa, aromas embriagadores y una dulzura natural que nunca encontrarás en un café premolido industrial.',
    tag: 'Consejos de Cata',
    readTime: '5 min de lectura'
  }
];
