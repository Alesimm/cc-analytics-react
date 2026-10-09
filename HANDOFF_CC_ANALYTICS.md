# HANDOFF — CC Analytics

## 1. Propósito
CC Analytics es una plataforma de gestión y analítica deportiva para Colo-Colo. El frontend debe centralizar información del plantel, rendimiento, tácticas, calendario, lesiones y soporte. El proyecto es académico para Desarrollo Fullstack II de Duoc UC.

## 2. Fases conocidas
- Fase 1: mockup funcional de referencia hecho con Vanilla JS y Tailwind CSS.
- Fase 2: migrar/implementar la interfaz con React + Vite, componentes y estado React; incorporar navegación entre pantallas.
- Fase 3 futura: backend con Spring Boot y MariaDB/microservicios, cuando la pauta y el equipo definan su alcance.
No adelantar la Fase 3 durante tareas de frontend.

## 3. Referencia de diseño
Archivo visual aportado por el usuario: `CC Analytics — UI Flowboard` (o imagen equivalente adjunta en la conversación). Representa ocho pantallas conectadas por navegación. Si la imagen no está en el repositorio, no asumas que existe como archivo local: solicita que se copie al proyecto o usa la imagen adjunta en la conversación como referencia.

Dirección de arte: Premium Brutalist deportivo; minimalista, corporativo, fondos oscuros/alto contraste, bordes definidos, navegación lateral común en las vistas internas y componentes coherentes. El flowboard está dibujado en blanco y negro y es esquemático: conserva la estructura y el propósito, no sus textos diminutos ilegibles.

## 4. Mapa funcional de pantallas

### 1. Login
- Pantalla de acceso centrada con marca/logotipo, nombre CC Analytics, texto de plataforma deportiva, campo de correo/usuario, contraseña y botón de ingreso.
- Mostrar validación y feedback dentro de la interfaz.
- El acceso exitoso debe conducir al dashboard mediante el mecanismo de navegación elegido para el proyecto; no limitarse a `console.log`.
- Reglas de validación ya reportadas en un contexto anterior: dominios permitidos `@duoc.cl`, `@profesor.duoc.cl`, `@gmail.com` y `@colocolo.cl`; contraseña de 4 a 10 caracteres. Son datos por verificar contra el código y la pauta antes de modificarlos.

### 2. Dashboard principal — Inicio y noticias
- Layout interno con barra lateral de navegación e identificación del usuario.
- Área principal con marcador/resumen de partido destacado.
- Resumen del rendimiento del equipo con indicadores como posesión, goles y tiros al arco.
- Panel de noticias con filas o tarjetas breves.
- Usar datos de demostración claramente ficticios si no hay backend; no presentar los datos como información real en vivo.

### 3. Catálogo del plantel — CRUD
- Buscador de jugadores.
- Acciones visibles para añadir, editar y eliminar.
- Cuadrícula de jugadores con avatar/foto, nombre, posición y datos resumidos.
- Implementar operaciones CRUD solo en el alcance acordado; si no existe backend, usar estado local/datos de prueba y aclararlo.
- Incluir estados vacíos, errores y confirmación inline para acciones destructivas; no usar `confirm()`.

### 4. Análisis de rendimiento individual
- Buscador de jugador.
- Resumen del jugador seleccionado: avatar, nombre y datos breves.
- Gráfico radial de estadísticas individuales.
- Gráfico de rendimiento reciente.
- Lista de recomendaciones tácticas.
- Si no hay librería de gráficos instalada, comprobar opciones existentes antes de añadir una dependencia. No inventar métricas como datos reales.

### 5. Formaciones — La Pizarra
- Campo táctico con distribución de jugadores y suplentes.
- Lista de formaciones guardadas, con opción de seleccionar y gestionar según alcance.
- Controles sencillos para ajustar parámetros tácticos mostrados en el mockup.
- Debe priorizarse que la pizarra sea comprensible y usable; no crear un editor complejo si la rúbrica no lo exige.

### 6. Calendario de partidos
- Sección de próximos partidos y partidos anteriores.
- Cada partido muestra rival, fecha/hora y estado/detalles básicos.
- Para partidos anteriores, mostrar resultado y acciones/resumen si corresponde.
- Datos demo hasta contar con fuente real. No inventar integración externa.

### 7. Centro médico — Lesiones
- Filtros por estado/tipo (los visibles en el mockup incluyen categorías como lesión, muscular y otros; confirmar etiquetas definitivas con la pauta).
- Tabla con jugador, tipo de lesión, gravedad, tiempo de recuperación y estado.
- Acción para añadir lesión/registro médico según permisos y alcance.
- Tratar la información médica como datos sensibles en un sistema real; para la demo usar datos ficticios y no incluir información personal real.

### 8. Soporte técnico y contacto
- Formulario con nombre, categoría/tipo de solicitud, correo, asunto y descripción.
- Validación propia y mensajes inline de éxito/error.
- No usar `alert()`, popups ni atributos HTML prohibidos.
- Si no existe backend, dejar explícito que el envío es de demostración; no fingir que se envió a un servidor.

## 5. Reglas académicas conocidas
- Prohibidos: `required`, `minLength`, `maxLength`, `type="email"`, `alert()` y `confirm()`.
- Formularios controlados con `useState`, `noValidate` cuando aplique y validaciones JavaScript propias.
- Mensajes de error mediante estado React y clases Tailwind.
- Verificar estas reglas en el código y la rúbrica antes de cerrar una tarea.

## 6. Estado del repositorio
Un contexto anterior reportó que el proyecto estaba migrando de una SPA Vanilla JS a React + Vite y que el login estaba maquetado con validaciones y estilos. También se reportó que el dashboard, navegación y módulos estaban pendientes. **Este estado es histórico y no está verificado.** Antigravity debe auditar el repositorio actual antes de planificar cambios.

No asumir:
- versiones específicas de React, Vite o Tailwind;
- que React Router está instalado;
- que todas las ocho pantallas existen;
- que el login y las validaciones descritas siguen iguales;
- que el backend está creado;
- que el mockup está guardado en la carpeta del proyecto.

## 7. Primera tarea recomendada
Auditoría de solo lectura:
1. Leer `AGENTS.md` y este documento.
2. Revisar `git status`, estructura, `package.json`, lockfile, configuración CSS/Tailwind y puntos de entrada.
3. Localizar y revisar componentes/rutas actuales.
4. Comparar implementación real con las ocho pantallas descritas.
5. Entregar resumen: implementado y verificado, implementado pero no verificado, incompleto, pendiente, discrepancias y próxima tarea prioritaria.
6. No editar archivos, instalar paquetes ni ejecutar comandos destructivos hasta recibir autorización.

## 8. Criterio de éxito
La implementación debe respetar la rúbrica, conservar la identidad visual, permitir navegar entre pantallas previstas, usar formularios y estados válidos, funcionar con el stack instalado y evitar funciones falsas o complejidad innecesaria.
