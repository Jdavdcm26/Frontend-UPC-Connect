# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## PWA instalable (FE-31)

La app se puede instalar en el celular o el escritorio. Para eso lleva:

- `public/manifest.webmanifest`: nombre, colores e íconos (`public/icons/`).
- `public/sw.js`: service worker que guarda solo el shell (la página base y los archivos de `/assets/`).
  Nunca toca `/api`, `/sanctum`, `/admin` ni otras rutas del servidor, así que no guarda respuestas con sesión.
- `public/offline.html`: página que se muestra si no hay conexión y la app todavía no se guardó.

Solo se registra en producción (`npm run build`). Para probarlo en local: `npm run build` y luego `npm run preview`.

Lo que necesita el servidor (Nginx, BE-36):

- HTTPS en el dominio de producción (los service workers no funcionan sin él; `localhost` sí).
- Servir `index.html` en cualquier ruta de la app (SPA) y excluir de eso `/api`, `/sanctum` y `/admin`.
- `sw.js` y `manifest.webmanifest` con `Cache-Control: no-cache`, para que las actualizaciones lleguen.
- En la CSP: `worker-src 'self'` y `manifest-src 'self'`. Los estilos de `offline.html` están en un archivo aparte, sin código en línea.
