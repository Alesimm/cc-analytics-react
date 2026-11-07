# HANDOFF — CC Analytics

## 1. Propósito
CC Analytics es una plataforma integral de gestión y analítica deportiva desarrollada para el Club Social y Deportivo Colo-Colo.
El frontend centraliza la información deportiva del club: control de plantilla profesional, análisis individual de rendimiento, pizarra táctica de formaciones, calendario oficial de partidos, seguimiento médico de lesiones y mesa de ayuda de soporte técnico.

---

## 2. Fases de Desarrollo
- **Fase 1 (Previa):** Maqueta inicial funcional desarrollada en Vanilla JS y Tailwind CSS.
- **Fase 2 (Actual - 100% UI completada):** Construcción integral en **React 19 + Vite**, componentes modulares, gestión de estado con React Hooks (`useState`, `useMemo`, `useRef`), validaciones JavaScript puras, navegación mediante **React Router DOM v7**, persistencia en `localStorage`, y cobertura de pruebas unitarias con **Vitest** y **React Testing Library**.
- **Fase 3 (Futura):** Arquitectura backend de servicios RESTful y persistencia relacional.

---

## 3. Arquitectura y Stack Técnico Verificado
- **Runtime & Build:** Node.js, Vite 8, React 19.
- **Enrutamiento:** React Router DOM v7 (`src/App.jsx`), con layout persistente (`src/components/Layout.jsx`).
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/vite`), paleta Premium Brutalist de alto contraste adaptada para Colo-Colo.
- **Testing Unitario:** Vitest v5 + React Testing Library + `@testing-library/jest-dom` + `jsdom`. Cobertura activa de **44/44 tests aprobados** distribuidos en 8 suites co-localizadas.
- **Calidad de Código:** ESLint configurado con reglas para React y React Hooks (0 errores, 0 advertencias).
- **Estructura del Proyecto:**
  ```text
  c:\cc-analytics-react\
  ├── src/
  │   ├── assets/              # Recursos estáticos
  │   ├── components/          # Componentes compartidos y reutilizables
  │   │   ├── Layout.jsx       # Barra superior de navegación y encabezado global
  │   │   ├── JugadorCard.jsx  # Tarjeta individual de jugador en el plantel
  │   │   ├── JugadorForm.jsx  # Formulario modal de nuevo/edición de jugador
  │   │   ├── JugadorForm.test.jsx
  │   │   └── RegistroMedicoForm.jsx # Formulario modal de alta/edición médica
  │   ├── data/                # Modelos de datos y adaptadores de LocalStorage
  │   │   ├── calendarioData.js
  │   │   ├── formacionesData.js
  │   │   ├── plantelData.js
  │   │   ├── medicoData.js
  │   │   └── soporteData.js
  │   ├── views/               # Las 8 pantallas principales de la aplicación
  │   │   ├── Login.jsx & Login.test.jsx
  │   │   ├── Dashboard.jsx
  │   │   ├── Plantel.jsx
  │   │   ├── Rendimiento.jsx & Rendimiento.test.jsx
  │   │   ├── Formaciones.jsx & Formaciones.test.jsx
  │   │   ├── Calendario.jsx & Calendario.test.jsx
  │   │   ├── CentroMedico.jsx & CentroMedico.test.jsx
  │   │   └── Soporte.jsx & Soporte.test.jsx
  │   ├── App.jsx              # Configuración de rutas (React Router)
  │   ├── main.jsx             # Punto de entrada de la aplicación
  │   └── index.css            # Importación de Tailwind CSS y animaciones
  ├── AGENTS.md                # Reglas estrictas y flujo para agentes de IA
  ├── HANDOFF_CC_ANALYTICS.md  # Estado actual, mapa funcional y entregables
  ├── package.json
  └── vite.config.js
  ```

---

## 4. Referencia de Diseño e Identidad Visual
- **Mockup base:** `CC Analytics — UI Flowboard` (referencia visual de las 8 pantallas conectadas).
- **Dirección de arte:** Premium Brutalist deportivo; minimalista, corporativo, fondos oscuros (`#050505`, `#0a0a0a`), alto contraste, bordes definidos (`border-white/10`, `border-neutral-800`), navegación lateral unificada y tipografía nítida.
- **Pizarra táctica:** Fondo negro profundo con demarcaciones de cancha blancas brillantes de alto contraste (según referencia aprobada).
- **Modales de formulario:** Modales flotantes centrados con fondo oscuro semitransparente y desenfoque controlado (`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm`). Sin capas de blur rotas ni saltos bruscos.
- **Diseño Responsivo:** Adaptabilidad fluida para pantallas móviles, tablets y monitores de escritorio.

---

## 5. Mapa Funcional de las 8 Pantallas (100% Fase 2 Implementado)

### 1. Login (`/`) — [`src/views/Login.jsx`](file:///c:/cc-analytics-react/src/views/Login.jsx)
- Pantalla de acceso dividida: panel izquierdo con identidad de Colo-Colo y panel derecho con formulario flotante.
- Validación reactiva controlada por `useState`: inputs con `type="text"` para correo institucional (sin `type="email"`), contraseñas de 4 a 10 caracteres.
- Efecto de carga en tres fases para experiencia inmersiva previa a la redirección a `/dashboard`.
- Sin luces ambientales saturadas; paleta neutra y brutalista.
- **Testing:** [`Login.test.jsx`](file:///c:/cc-analytics-react/src/views/Login.test.jsx) (2 pruebas aprobadas).

### 2. Dashboard Principal (`/dashboard`) — [`src/views/Dashboard.jsx`](file:///c:/cc-analytics-react/src/views/Dashboard.jsx)
- Resumen general del club: próximo partido estelar con cuenta regresiva, indicadores clave de rendimiento (posesión promedio, goles marcados, efectividad de pases, vallas invictas).
- Feed de noticias internas del plantel profesional y accesos directos a los módulos táctico, médico y de plantel.
- Datos estructurados en [`src/data/calendarioData.js`](file:///c:/cc-analytics-react/src/data/calendarioData.js).

### 3. Catálogo del Plantel (`/plantel`) — [`src/views/Plantel.jsx`](file:///c:/cc-analytics-react/src/views/Plantel.jsx)
- Gestión CRUD completa de futbolistas: alta de jugador, edición de datos, filtrado por posición (porteros, defensas, mediocampistas, delanteros) y buscador en tiempo real.
- Eliminación con confirmación inline en la propia interfaz (sin utilizar `confirm()`).
- Formulario modal [`JugadorForm.jsx`](file:///c:/cc-analytics-react/src/components/JugadorForm.jsx) con validaciones de dorsal, edad, valoración y posición.
- Persistencia reactiva en LocalStorage con semillas iniciales en [`src/data/plantelData.js`](file:///c:/cc-analytics-react/src/data/plantelData.js).
- **Testing:** [`src/components/JugadorForm.test.jsx`](file:///c:/cc-analytics-react/src/components/JugadorForm.test.jsx) (4 pruebas aprobadas).

### 4. Análisis de Rendimiento Individual (`/rendimiento`) — [`src/views/Rendimiento.jsx`](file:///c:/cc-analytics-react/src/views/Rendimiento.jsx)
- Buscador y selector interactivo de futbolistas del plantel.
- Gráfico de radar SVG nativo de 6 ejes (físico, pase, remate, defensa, regate, táctica) generado matemáticamente sin librerías externas pesadas.
- Historial de partidos recientes con evolución de calificaciones, desglose físico y recomendaciones tácticas automatizadas.
- Datos provistos por [`src/data/plantelData.js`](file:///c:/cc-analytics-react/src/data/plantelData.js).
- **Testing:** [`Rendimiento.test.jsx`](file:///c:/cc-analytics-react/src/views/Rendimiento.test.jsx) (7 pruebas aprobadas).

### 5. Formaciones y Pizarra Táctica (`/formaciones`) — [`src/views/Formaciones.jsx`](file:///c:/cc-analytics-react/src/views/Formaciones.jsx)
- Pizarra táctica de campo completo con fondo negro absoluto y líneas blancas de alto contraste.
- Renderizado de 11 titulares posicionados dinámicamente y bandeja horizontal de suplentes.
- Selector de esquemas tácticos (4-3-3 Ofensivo, 4-2-3-1 Control, 3-5-2 Bloque Alto, 4-4-2 Presión).
- Formulario modal optimizado para crear nuevos esquemas tácticos con validación de nombre y descripción.
- Datos y esquemas en [`src/data/formacionesData.js`](file:///c:/cc-analytics-react/src/data/formacionesData.js).
- **Testing:** [`Formaciones.test.jsx`](file:///c:/cc-analytics-react/src/views/Formaciones.test.jsx) (6 pruebas aprobadas).

### 6. Calendario de Partidos y Fixture (`/calendario`) — [`src/views/Calendario.jsx`](file:///c:/cc-analytics-react/src/views/Calendario.jsx)
- Bloque destacado de próximo partido oficial con cuenta regresiva en vivo, rival, estadio, torneo y transmisión.
- Lista completa de partidos programados y resultados pasados con marcadores.
- Formulario modal para programar nuevos encuentros con validación de rival, fecha, hora, torneo y condición (Local / Visita).
- Eliminación de encuentros con confirmación inline protegida.
- Datos gestionados en [`src/data/calendarioData.js`](file:///c:/cc-analytics-react/src/data/calendarioData.js).
- **Testing:** [`Calendario.test.jsx`](file:///c:/cc-analytics-react/src/views/Calendario.test.jsx) (7 pruebas aprobadas).

### 7. Centro Médico y Control de Lesiones (`/centro-medico`) — [`src/views/CentroMedico.jsx`](file:///c:/cc-analytics-react/src/views/CentroMedico.jsx)
- Registro y monitoreo clínico de futbolistas lesionados o en fase de readaptación física.
- Tarjetas resumen con métricas (total lesionados, bajas prolongadas, en readaptación, aptos).
- Filtros interactivos por gravedad (Leve, Moderada, Grave) y estado médico.
- Formulario modal [`RegistroMedicoForm.jsx`](file:///c:/cc-analytics-react/src/components/RegistroMedicoForm.jsx) para registrar nuevas fichas o actualizar diagnósticos y días de baja estimada.
- Opción de dar de alta inmediata con confirmación inline.
- Datos provistos por [`src/data/medicoData.js`](file:///c:/cc-analytics-react/src/data/medicoData.js).
- **Testing:** [`CentroMedico.test.jsx`](file:///c:/cc-analytics-react/src/views/CentroMedico.test.jsx) (7 pruebas aprobadas).

### 8. Soporte Técnico y Contacto (`/soporte`) — [`src/views/Soporte.jsx`](file:///c:/cc-analytics-react/src/views/Soporte.jsx)
- Mesa de ayuda para incidencias técnicas, solicitudes de métricas, cuentas y sugerencias.
- Formulario controlado con validaciones JavaScript puras:
  - Nombre del solicitante (mínimo 3 caracteres).
  - Correo de contacto verificado mediante regex (`EMAIL_REGEX`).
  - Asunto descriptivo (mínimo 5 caracteres).
  - Detalle del requerimiento (mínimo 10 caracteres).
- Generador automático de tickets con código correlativo (`TK-xxxx`), fecha/hora y asignación a departamento.
- Catálogo de tickets con filtros por estado (Abierto, En Progreso, Resuelto), categoría y buscador por texto.
- Vista expandible de respuesta técnica y confirmación inline para eliminar tickets.
- Persistencia en LocalStorage mediante [`src/data/soporteData.js`](file:///c:/cc-analytics-react/src/data/soporteData.js).
- **Testing:** [`Soporte.test.jsx`](file:///c:/cc-analytics-react/src/views/Soporte.test.jsx) (7 pruebas aprobadas).

---

## 6. Estándares de Implementación y UX
- **Validaciones Controladas:** Formularios sin atributos HTML nativos restrictivos (`required`, `minLength`, `maxLength`, `type="email"`).
- **Feedback Inline:** Ausencia de ventanas emergentes nativas (`alert()` o `confirm()`), empleando diálogos y confirmaciones inline con Tailwind CSS.
- **Gestión de Estado:** 100% de los formularios controlados con React `useState` e implementan el atributo `noValidate` en los tags `<form>`.
- **Validaciones Propias:** Validaciones matemáticas y expresiones regulares en funciones JavaScript puras que alimentan estados de error mostrados de forma accesible en la UI.

---

## 7. Estado de Testing y Calidad Actual
- **Vitest:** 8 archivos de pruebas unitarias, **44 tests ejecutados y 44 aprobados (100% passing)**.
- **ESLint:** 0 errores y 0 advertencias (`npm run lint`).
- **Vite Build:** Compilación limpia para producción (`npm run build`).

---

## 8. Arquitectura de Entregables y Documentación
- **Documento ERS:** Especificación formal de requisitos de software y arquitectura del sistema.
- **Informe de Testing:** Detalle de pruebas unitarias y cobertura de componentes.
- **Repositorio:** Estructura modular de ramas y control de versiones semántico.
- **Empaquetado:** Código fuente exportado sin dependencias generadas (`node_modules`, `dist`).

---

## 9. Instrucciones para Nuevos Agentes
Si eres un nuevo agente o continúas el trabajo en otra sesión:
1. Lee primero `AGENTS.md` y este documento completo.
2. Ejecuta `git status` para verificar la rama actual y los archivos modificados.
3. Ejecuta `npm test`, `npm run lint` y `npm run build` para comprobar que la base está en verde antes de cualquier cambio.
4. Recuerda la regla de oro: **"modifica, no borres"** y **no ejecutes comandos de Git destructivos, commits ni push sin autorización explícita del usuario**.
5. Enfócate en los entregables formales de documentación y la auditoría final de cierre de Fase 2.
