# Café Vistro HN

**Café Vistro HN** ("Specialty Coffee Roasters & Tienda de Café") es una plataforma web completa de comercio electrónico y panel de clientes para una tostaduría boutique y cafetería de especialidad en Honduras.

## Características Principales

- **Diseño Moderno & Fiel**: Stack React + Vite + TypeScript con Tailwind CSS, preservando la paleta "Coffee Mist" y soporte de modo Oscuro / Claro.
- **Fondo Interactivo**: Experiencia visual dinámica optimizada con fallback estático para accesibilidad.
- **Catálogo de Café y Accesorios**:
  - Filtros por categoría y búsqueda en tiempo real.
  - Granos de origen (Marcala, Geisha), métodos de extracción (V60, Prensa Francesa, Chorreador) y repostería artesanal.
  - Selector de variantes (peso, molienda, tueste) y cantidades.
- **Carrito y Puntos Eco**:
  - Sucursales de retiro: Mall Multiplaza (Tegucigalpa) y Mall Galerías (San Pedro Sula).
  - Canje de puntos de fidelidad por descuentos directos en lempiras (L.).
  - Validación y cálculo de cupones y totales en servidor.
- **Historial de Pedidos ("Mis Pedidos")**:
  - Desglose detallado de ítems, estado del pedido y comprobante.
- **Blog de Barismo y Cultura de Café**:
  - Artículos sobre métodos de extracción, perfiles de tueste y sostenibilidad ambiental.
- **Autenticación Segura**:
  - Sesiones HTTPOnly, protección CSRF y contraseñas hasheadas con bcrypt.

## Ejecución

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilación para producción
npm run build
```
