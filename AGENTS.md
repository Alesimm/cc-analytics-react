# AGENTS.md — CC Analytics

## Objetivo
Construir y perfeccionar CC Analytics, plataforma deportiva para Colo-Colo desarrollada para la asignatura Desarrollo Fullstack II de Duoc UC.
Prioridad actual: Habiendo completado el 100% de la interfaz de usuario de la Fase 2 (las 8 pantallas funcionales), la prioridad es cumplir la rúbrica al 100%, preservar la referencia visual Premium Brutalist aprobada, y preparar los entregables formales y la defensa según la pauta oficial de Duoc UC.

## Stack y herramientas del proyecto
- **Frontend:** React 19, Vite, React Router DOM (`src/App.jsx`), Tailwind CSS v4 (`@tailwindcss/vite`).
- **Testing unitario:** Vitest, React Testing Library, `@testing-library/jest-dom`, `jsdom` (`npm test`).
- **Linter y estándares:** ESLint con configuración moderna para React Hooks (`npm run lint`).
- **Compilación de producción:** Vite build (`npm run build`).
- **Control de versiones y flujo:** Git / GitHub con ramas semánticas (`feature/...`), Pull Requests ordenados y commits descriptivos.
- **Persistencia en cliente:** LocalStorage estructurado con inicialización de datos de prueba en `src/data/`.
- **Skills y herramientas del entorno:** Pruebas automatizadas, auditoría de accesibilidad (`a11y-debugging`), inspección de rendimiento y prevención de re-renders innecesarios (`react-best-practices`), revisión de código (`code-review` / CodeRabbit) y prevención de pérdida accidental de datos.

## Reglas de trabajo
- Responde y explica en español, de forma directa y paso a paso.
- Antes de editar, inspecciona los archivos relevantes y el estado de Git (`git status`). No asumas que el handoff refleja el código actual si no lo has verificado.
- Reutiliza componentes, estilos y lógica existentes. No reescribas ni elimines algo que funcione sin una razón concreta ("modifica, no borres").
- Mantén la solución mínima que cumpla el requerimiento. Evita dependencias pesadas, abstracciones complejas, animaciones recargadas y funciones no solicitadas.
- No inventes requisitos, datos reales de personas, endpoints externos no acordados ni estado de implementación. Distingue lo verificado de lo supuesto.
- No instales dependencias ni cambies versiones sin explicar la necesidad y pedir autorización explícita.
- No ejecutes comandos destructivos ni hagas commit, push, merge, deploy o borrados sin autorización explícita del usuario.
- No sobrescribas cambios del usuario. Revisa `git status` antes de trabajar y al terminar.
- No declares que algo funciona sin verificarlo. Indica los comandos de prueba ejecutados (`npm test`, `npm run lint`, `npm run build`) y los resultados reales.
- No incluyas secretos, tokens, contraseñas reales ni credenciales en el código.

## Reglas académicas obligatorias (Checklist estricto Duoc UC)
- **PROHIBIDO:** No uses atributos HTML `required`, `minLength`, `maxLength` ni `type="email"`.
- **PROHIBIDO:** No uses `alert()`, `confirm()` ni ventanas emergentes del navegador para feedback o confirmación de acciones destructivas (usar confirmaciones inline y estados React).
- **Formularios controlados:** Todos los formularios deben controlarse mediante React `useState` e incluir `noValidate` en la etiqueta `<form>`.
- **Validación de correos:** Usar siempre `type="text"` para correos institucionales y validar mediante expresiones regulares o funciones JavaScript propias.
- **Feedback visual:** Muestra errores y estados de validación en la interfaz mediante estado React y clases Tailwind dinámicas (bordes rojos, mensajes de error accesibles).
- **Validación rigurosa:** Valida según los requisitos confirmados de la asignatura y el comportamiento actual; no inventes reglas nuevas ni relajes las existentes sin comprobar la especificación.

## Diseño e Identidad Visual
- Sigue el mockup `CC Analytics — UI Flowboard` proporcionado por el usuario como referencia visual y funcional.
- **Identidad:** Premium Brutalist deportivo, corporativo, minimalista; fondos oscuros (`#050505`, `#0a0a0a`), alto contraste, tipografía clara, bordes definidos (`border-white/10`, `border-neutral-800`) y acentos medidos (dorado/ámbar, verde táctico, rojo alerta).
- **Pizarra táctica:** Fondo negro de alto contraste con líneas blancas de la cancha nítidas y limpias.
- **Modales y formularios flotantes:** Contenedor modal centrado en pantalla completa (`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm`) con transiciones fluidas, evitando saltos de scroll o capas de blur desalineadas.
- Prioriza jerarquía visual, alineación, legibilidad, estados vacíos claros y diseño 100% adaptable (móvil, tablet y escritorio).
- Evita añadir tarjetas, gráficos, menús, campos o animaciones que no aporten al mockup o a la rúbrica.

## Flujo para cada tarea
1. Identifica el requisito y los archivos implicados.
2. Revisa el código y Git (`git status`).
3. Propón un plan corto si la tarea afecta arquitectura, navegación, validaciones o varias pantallas.
4. Implementa solo lo autorizado ("modifica, no borres").
5. Ejecuta verificaciones disponibles (`npm test`, `npm run lint`, `npm run build`).
6. Resume archivos cambiados, decisiones, pruebas ejecutadas y pendientes.
7. Sugiere un mensaje de commit y una tarjeta de Trello solo si hubo un cambio útil; no ejecutes Git sin permiso previo.

## Cierre de Fase 2 y Entregables Formales (Evaluación 2 Duoc UC)
Una vez finalizada la Pantalla 8 (Soporte Técnico y Contacto), se alcanza el 100% de la interfaz de usuario de la Fase 2. El siguiente paso no es programar a ciegas, sino cerrar los entregables formales del encargo (que ponderan 40% de la evaluación) y preparar la defensa:

### 1. Documentación obligatoria requerida por Duoc UC (Págs. 4 y 12 del PDF)
- **Documento ERS (Especificación de Requisitos de Software) versión 2:**
  Actualizar el documento de la entrega anterior para reflejar la solución real: arquitectura React + Vite, Tailwind CSS v4, mapa de las 8 pantallas de CC Analytics, casos de uso (CRUD de plantel, fichas médicas, táctica, calendario, soporte) y el modelo de persistencia local.
- **Documento de Cobertura de Testing:**
  Informe formal detallando las pruebas unitarias:
  - Configuración del entorno (Vitest + Testing Library + jsdom).
  - Casos cubiertos (mínimo 2 por formulario, pruebas de renderizado, props, eventos y mocks).
  - Tabla de resultados demostrando el 100% de aprobación de las pruebas (40/40 pruebas).
- **Repositorio GitHub limpio y público:**
  Enlace al repositorio con el historial ordenado de Pull Requests (PRs semánticos que evidencian el trabajo paso a paso).
- **Archivo comprimido (.zip) del proyecto:**
  Exportar el proyecto limpio (excluyendo obligatoriamente las carpetas `node_modules` y `dist`).

### 2. Auditoría final de la Rúbrica y Diseño (Pulido de detalles)
- **Diseño responsivo:** Comprobar que todas las pantallas y formularios se adapten limpiamente a móvil, tablet y escritorio.
- **Consistencia visual:** Verificar que no queden textos desalineados, colores fuera de la paleta brutalista de Colo-Colo o elementos que no cumplan la guía de estilo.
- **Checklist académico estricto:** Asegurarse de que ningún formulario use atributos HTML prohibidos (`required`, `minLength`, `maxLength`, `type="email"`) ni ventanas del navegador (`alert()` / `confirm()`).

## Fuentes de verdad
1. Rúbrica e instrucciones oficiales de Duoc UC (Instrucciones Evaluación 2 y Pauta de Evaluación).
2. Código y configuración actuales del repositorio para conocer el estado real verificado.
3. Mockup del usuario `CC Analytics — UI Flowboard` para estructura visual y funcional.
4. Este archivo (`AGENTS.md`) para directrices de trabajo y stack.
5. `HANDOFF_CC_ANALYTICS.md` para el detalle de pantallas, arquitectura y mapa de entrega.
Si hay contradicciones, indícalas y consulta con el usuario antes de hacer cambios importantes.
