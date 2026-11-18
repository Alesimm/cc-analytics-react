// cliente http del proyecto: todas las pantallas hablan con el backend a traves de este archivo.
// usa fetch, agrega solo el token jwt en cada peticion y convierte los errores del servidor en mensajes legibles.

import { obtenerToken, cerrarSesion } from "../data/authData";

const URL_BASE = import.meta.env?.VITE_API_URL || "http://localhost:3001";

// crea un error con el mensaje del servidor y su codigo http (401, 403, 404...)
const crearError = (mensaje, status) => Object.assign(new Error(mensaje), { status });

async function peticion(ruta, metodo = "GET", body = null) {
  const token = obtenerToken();

  let respuesta;
  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      method: metodo,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw crearError("No se pudo conectar con el servidor.", 0);
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    // si el token vencio en una ruta normal, se cierra la sesion y se vuelve al login
    if (respuesta.status === 401 && token && !ruta.startsWith("/api/v1/auth/")) {
      cerrarSesion();
      window.location.assign("/login");
    }
    throw crearError(datos.mensaje || "Ocurrio un error inesperado.", respuesta.status);
  }

  return datos;
}

// metodos cortos para usar en las pantallas: api.get("/api/v1/jugadores")
export const api = {
  get: (ruta) => peticion(ruta),
  post: (ruta, body) => peticion(ruta, "POST", body),
  put: (ruta, body) => peticion(ruta, "PUT", body),
  patch: (ruta, body) => peticion(ruta, "PATCH", body),
  delete: (ruta) => peticion(ruta, "DELETE"),
};

// post /api/v1/auth/login -> devuelve { token, usuario }
export const iniciarSesion = (correo, password) =>
  api.post("/api/v1/auth/login", { correo, password });

// get /api/v1/auth/me -> devuelve { usuario } si el token sigue vigente
export const obtenerPerfil = () => api.get("/api/v1/auth/me");
