import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RutaPrivada from "./RutaPrivada";
import { obtenerPerfil } from "../services/api";

// Mock del cliente http: la prueba no llama al backend real
vi.mock("../services/api", () => ({
  obtenerPerfil: vi.fn(),
}));

// arma un router con una pantalla privada y el login para comprobar a donde llega el usuario
const renderizarRuta = () =>
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route element={<RutaPrivada />}>
          <Route path="/dashboard" element={<p>Contenido privado</p>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("Guardia de rutas privadas (sesion JWT)", () => {
  beforeEach(() => {
    localStorage.clear();
    obtenerPerfil.mockReset();
  });

  it("manda al login cuando no hay token guardado", () => {
    renderizarRuta();

    expect(screen.getByText("Pantalla de login")).toBeInTheDocument();
    expect(obtenerPerfil).not.toHaveBeenCalled();
  });

  it("mantiene la sesion al recargar cuando el backend valida el token", async () => {
    localStorage.setItem("cc_token", "token-vigente");
    obtenerPerfil.mockResolvedValue({
      usuario: { id: "usr-admin", correo: "admin@colocolo.cl", rol: "ADMIN" },
    });

    renderizarRuta();

    expect(await screen.findByText("Contenido privado")).toBeInTheDocument();
    expect(obtenerPerfil).toHaveBeenCalledTimes(1);
  });

  it("borra la sesion y manda al login cuando el token ya no es valido", async () => {
    localStorage.setItem("cc_token", "token-vencido");
    obtenerPerfil.mockRejectedValue(
      Object.assign(new Error("Token invalido."), { status: 401 })
    );

    renderizarRuta();

    expect(await screen.findByText("Pantalla de login")).toBeInTheDocument();
    await waitFor(() => {
      expect(localStorage.getItem("cc_token")).toBeNull();
    });
  });
});
