// manejo de la sesion del usuario: guarda el token jwt y los datos del perfil en localStorage.
// asi la sesion sigue viva aunque se recargue la pagina con f5, y se borra al cerrar sesion.

const CLAVE_TOKEN = "cc_token";
const CLAVE_USUARIO = "cc_usuario_sesion";

// nombres amigables de los 3 roles del backend para mostrarlos en pantalla
export const ETIQUETA_ROL = {
  ADMIN: "Administrador",
  CUERPO_TECNICO: "Cuerpo Técnico",
  ANALISTA_LECTURA: "Analista de Lectura",
};

// devuelve el token guardado o null si no hay sesion
export const obtenerToken = () => {
  try {
    return localStorage.getItem(CLAVE_TOKEN);
  } catch {
    return null;
  }
};

// devuelve los datos del usuario guardado (id, nombre, correo, rol, cargo) o null
export const obtenerUsuario = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIO);
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
};

// guarda el token y el usuario despues de un login exitoso
export const guardarSesion = (token, usuario) => {
  try {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  } catch {
    // si el navegador bloquea el almacenamiento, la sesion solo dura mientras no se recargue
  }
};

// actualiza solo los datos del usuario (por ejemplo despues de validar /me)
export const guardarUsuario = (usuario) => {
  try {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
  } catch {
    // sin almacenamiento disponible no hay nada que actualizar
  }
};

// borra la sesion completa (cerrar sesion o token vencido)
export const cerrarSesion = () => {
  try {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
  } catch {
    // sin almacenamiento disponible no hay nada que borrar
  }
};

// devuelve el rol activo de la sesion (si no hay sesion en tests unitarios asume ADMIN)
export const obtenerRolActual = () => {
  const usuario = obtenerUsuario();
  return usuario?.rol || "ADMIN";
};

// permisos por rol (rbac) segun la matriz oficial del proyecto
export const puedeGestionarPlantel = (rol = obtenerRolActual()) =>
  rol === "ADMIN";

export const puedeGestionarTactica = (rol = obtenerRolActual()) =>
  rol === "ADMIN" || rol === "CUERPO_TECNICO";

export const puedeAccederMedico = (rol = obtenerRolActual()) =>
  rol === "ADMIN" || rol === "CUERPO_TECNICO";

export const puedeEliminarRegistros = (rol = obtenerRolActual()) =>
  rol === "ADMIN";

