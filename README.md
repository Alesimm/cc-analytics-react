# CC Analytics — Plataforma de Gestión y Analítica Deportiva (Frontend)

**CC Analytics** es la aplicación web en React para la gestión estratégica del plantel profesional del **Club Social y Deportivo Colo-Colo** (Desarrollo Fullstack II — Duoc UC, Evaluación Parcial 3).

---

## Arquitectura Cliente-Servidor (Entrega 3)

Este frontend se conecta vía `fetch` (`src/services/api.js`) con el servidor independiente **`cc-analytics-backend`** (`http://localhost:3001`), incorporando:
- **Autenticación JWT (`POST /api/v1/auth/login`):** Emisión de token y verificación/renovación automática ante recargas de página (`F5`) mediante `GET /api/v1/auth/me`.
- **Control de Acceso por Roles (RBAC):**
  - `ADMIN` (`admin@colocolo.cl` / `colo2026`): Acceso completo CRUD en las 8 pantallas.
  - `CUERPO_TECNICO` (`tecnico@colocolo.cl` / `tecnico26`): Gestión operativa de directrices tácticas, formaciones y centro médico (sin eliminaciones administrativas ni edición del plantel/calendario).
  - `ANALISTA_LECTURA` (`consulta@colocolo.cl` / `consulta26`): Modo consulta en Plantel, Rendimiento, Formaciones y Calendario; acceso bloqueado a Centro Médico; creación de tickets en Soporte.

---

## Módulos de la Plataforma
1. **Login (`/login`):** Inicio de sesión validado contra el backend con opción de recordar sesión (`localStorage` vs `sessionStorage`).
2. **Panel Principal (`/dashboard`):** Resumen del último encuentro, métricas colectivas y noticias.
3. **Catálogo del Plantel (`/plantel`):** CRUD conectado a `/api/v1/jugadores` y restricciones por rol.
4. **Rendimiento Individual (`/rendimiento`):** Radar SVG de 6 ejes, partidos recientes y directrices conectadas a `/api/v2/jugadores` y `/api/v1/directrices`.
5. **Pizarra Táctica (`/formaciones`):** Cancha táctica con sustitución, parámetros y esquemas en `/api/v1/formaciones`.
6. **Calendario (`/calendario`):** Fixture de próximos encuentros e historial en `/api/v1/partidos`.
7. **Centro Médico (`/medico`):** Fichas clínicas, fases y altas médicas en `/api/v1/medico` (oculto para `ANALISTA_LECTURA`).
8. **Soporte Técnico (`/soporte`):** Mesa de ayuda conectada a `/api/v1/soporte`.

---

## Stack Tecnológico
- **Frontend:** React 19, Vite 8, React Router DOM v7, Tailwind CSS v4.
- **Cliente HTTP:** `fetch` nativo centralizado en `src/services/api.js` con envío automático de `Authorization: Bearer <token>`.
- **Testing y Calidad:** Vitest + React Testing Library + `jsdom` (`57` pruebas unitarias) y ESLint.

---

## Cómo ejecutar el proyecto

### 1. Levantar Backend y Frontend juntos
Necesitas **2 terminales** abiertas:
1. **Terminal 1 (Backend — puerto `3001`):**
   ```bash
   cd cc-analytics-backend
   npm install
   npm run dev
   ```
2. **Terminal 2 (Frontend — puerto `5173`):**
   ```bash
   cd cc-analytics-react
   npm install
   npm run dev
   ```
Luego abre `http://localhost:5173` en tu navegador.

### 2. Verificación (Tests, Linter y Build)
```bash
npm test
npm run lint
npm run build
```

---

## Equipo de Desarrollo
- **Alexander Simpertigue** (`Alesimm`) — Arquitectura Frontend/Backend, Lógica Táctica, JWT/RBAC y Testing
- **Joseph** (`josephR`) — Documentación Técnica, Especificaciones, Control Clínico y Calendario
- **Cristóbal** (`Cristobal`) — Diseño de Interfaces, Accesibilidad, Control de Calidad y Soporte Técnico
