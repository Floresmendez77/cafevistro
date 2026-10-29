# Café Vistro HN

Tienda de café de especialidad (Honduras). Frontend React + Vite + TypeScript + Tailwind; backend en **Firebase** (Auth, Firestore, Cloud Functions).

## Requisitos
- Node.js 20+ y npm
- Java JDK 21 (solo para los emuladores): `winget install EclipseAdoptium.Temurin.21.JDK`

## Configuración
1. `npm install`
2. Copia `.env.example` a `.env` y completa los valores `VITE_FIREBASE_*`.

## Desarrollo local (emuladores, sin costo)
Abre 3 terminales en la carpeta del proyecto:

```powershell
npm run emulators   # 1) Auth + Firestore + Functions + panel en http://127.0.0.1:4000
npm run seed        # 2) con los emuladores ya corriendo: carga productos, cupones, sucursales, blog y usuario demo
npm run dev         # 3) la tienda en http://localhost:3000
```

Usuario demo (solo emulador): `sthephenandrew56@gmail.com` / `Cafe1234!` (admin, 180 Puntos Eco).
Cupones: `CAFE15` (15 %), `VISTRO50` (L. 50, mín. L. 200), `BARISTA20` (20 %, mín. L. 350).

## Seguridad
- Precios, descuentos, cupones, stock y Puntos Eco se calculan **solo** en Cloud Functions (`createOrder`, `applyCoupon`, `createProfile`).
- El cliente no puede escribir pedidos, puntos ni rol (ver `firestore.rules`). Los cupones no son legibles desde el navegador.
- `.env` nunca se sube a Git. La `apiKey` web de Firebase no es secreta; la protección real son las reglas.

## Despliegue (requiere plan Blaze para Functions)
```powershell
npx firebase login
npm run deploy:rules
npm run deploy:functions
npm run seed -- --prod --yes   # opcional: carga el catálogo en producción (requiere credenciales)
```

## Estructura
- `src/services/api.ts` – cliente sobre Firebase (mismas firmas que la versión PHP anterior)
- `src/lib/firebase.ts` – inicialización y conexión a emuladores en desarrollo
- `functions/` – Cloud Functions (TypeScript, Node 20, región us-central1)
- `scripts/seed.ts` – carga de datos iniciales
