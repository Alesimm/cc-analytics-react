# AGENTS.md — CC Analytics

## Objetivo
Construir CC Analytics, plataforma académica de gestión y analítica deportiva para Colo-Colo. Prioridad: cumplir la rúbrica y conservar la referencia visual aprobada, con código simple y mantenible.

## Reglas de trabajo
- Responde y explica en español, de forma directa y paso a paso.
- Antes de editar, inspecciona los archivos relevantes y el estado de Git. No asumas que el handoff refleja el código actual.
- Reutiliza componentes, estilos y lógica existentes. No reescribas ni elimines algo que funcione sin una razón concreta.
- Mantén la solución mínima que cumpla el requerimiento. Evita dependencias, abstracciones, animaciones y funciones no solicitadas.
- No inventes requisitos, datos reales, endpoints ni estado de implementación. Distingue lo verificado de lo supuesto.
- No instales dependencias ni cambies versiones sin explicar la necesidad y pedir autorización.
- No ejecutes comandos destructivos ni hagas commit, push, merge, deploy o borrados sin autorización explícita.
- No sobrescribas cambios del usuario. Revisa `git status` antes de trabajar y al terminar.
- No declares que algo funciona sin verificarlo. Indica los comandos de prueba ejecutados y los resultados reales.
- No incluyas secretos, tokens, contraseñas reales ni credenciales en el código.

## Reglas académicas obligatorias
- No uses atributos HTML `required`, `minLength`, `maxLength` ni `type="email"`.
- No uses `alert()`, `confirm()` ni ventanas emergentes para feedback.
- Los formularios deben controlarse con React `useState`; incluye `noValidate` cuando corresponda.
- Usa `type="text"` para correo y valida mediante lógica JavaScript propia.
- Muestra errores y estados de validación en la interfaz mediante estado React y clases Tailwind dinámicas.
- Valida según los requisitos confirmados de la asignatura y el comportamiento actual; no inventes reglas nuevas.
- No cambies reglas existentes de validación sin comprobar primero el código y la especificación.

## Diseño
- Sigue el mockup `CC Analytics — UI Flowboard` proporcionado por el usuario como referencia visual/funcional, con posibilidad de cambios e innovacion moderna.
- Identidad: Premium Brutalist deportivo, corporativo, minimalista; fondos oscuros, alto contraste, tipografía clara, bordes definidos y acentos medidos.
- Prioriza jerarquía visual, alineación, legibilidad, estados claros y diseño adaptable.
- No copies literalmente los detalles ilegibles de la imagen; respeta la estructura de cada pantalla y mejora la legibilidad sin alterar su propósito.
- Evita añadir tarjetas, gráficos, menús, campos o animaciones que no aporten al mockup o a la rúbrica.

## Stack y calidad
- Comprueba `package.json`, lockfile y configuración antes de asumir versiones o herramientas.
- Usa las tecnologías ya instaladas. El objetivo de frontend reportado es React + Vite, con React Router si está instalado o se autoriza añadirlo.
- Mantén componentes pequeños cuando tengan una responsabilidad clara; no fragmentes cada línea en componentes.
- Separa la navegación, las vistas y los componentes compartidos de forma simple.
- No implementes backend, microservicios ni base de datos antes de que esa fase sea solicitada y definida.

## Flujo para cada tarea
1. Identifica el requisito y los archivos implicados.
2. Revisa el código y Git.
3. Propón un plan corto si la tarea afecta arquitectura, navegación, validaciones o varias pantallas.
4. Implementa solo lo autorizado.
5. Ejecuta verificaciones disponibles (por ejemplo, lint/build si existen).
6. Resume archivos cambiados, decisiones, pruebas y pendientes.
7. Sugiere un mensaje de commit y una tarjeta de Trello solo si hubo un cambio útil; no ejecutes Git sin permiso.

## Fuentes de verdad
1. Rúbrica e instrucciones oficiales de Duoc UC.
2. Código y configuración actuales del repositorio para conocer el estado real.
3. Mockup del usuario para estructura visual y funcional.
4. Este archivo para reglas permanentes.
5. `HANDOFF_CC_ANALYTICS.md` para visión y mapa de pantallas.
Si hay contradicciones, indícalas y pregunta antes de hacer un cambio importante.
