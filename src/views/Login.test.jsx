import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { iniciarSesion } from "../services/api";

// Mock de useNavigate para verificar la redireccion
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock del cliente http: los tests no deben llamar al backend real
vi.mock("../services/api", () => ({
  iniciarSesion: vi.fn(),
}));

// helper para llenar el formulario y presionar ingresar
const completarYEnviar = (correo, clave) => {
  fireEvent.change(screen.getByLabelText(/correo institucional/i), {
    target: { value: correo },
  });
  fireEvent.change(screen.getByLabelText(/código de acceso/i), {
    target: { value: clave },
  });
  fireEvent.click(screen.getByRole("button", { name: /ingresar al sistema/i }));
};

describe("Formulario de Autenticación (Login)", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
    iniciarSesion.mockReset();
  });

  // Prueba 1: Validacion y renderizado condicional de mensajes de error
  it("muestra mensajes de error cuando se envian credenciales vacias o con dominio no permitido", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const botonIngresar = screen.getByRole("button", {
      name: /ingresar al sistema/i,
    });

    // Enviar formulario vacio
    fireEvent.click(botonIngresar);

    // Verificar que aparezcan los mensajes de error en pantalla
    expect(
      screen.getByText(/el correo debe terminar en @colocolo\.cl/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/la contraseña debe tener entre 4 y 10 caracteres/i)
    ).toBeInTheDocument();

    // No debe navegar ni llamar al backend si hay errores
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(iniciarSesion).not.toHaveBeenCalled();
  });

  // Prueba 2: envio exitoso, guarda el token jwt y redirige
  it("guarda la sesion y redirige a /dashboard cuando el backend acepta las credenciales", async () => {
    iniciarSesion.mockResolvedValue({
      token: "token-de-prueba",
      usuario: { id: "usr-admin", correo: "admin@colocolo.cl", rol: "ADMIN" },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    completarYEnviar("admin@colocolo.cl", "colo2026");

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
    expect(iniciarSesion).toHaveBeenCalledWith("admin@colocolo.cl", "colo2026");
    expect(localStorage.getItem("cc_token")).toBe("token-de-prueba");
  });

  // Prueba 3: el backend rechaza las credenciales
  it("muestra el error del servidor y no redirige cuando las credenciales son incorrectas", async () => {
    iniciarSesion.mockRejectedValue(new Error("Correo o contraseña incorrectos."));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    completarYEnviar("admin@colocolo.cl", "equivocada");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /correo o contraseña incorrectos/i
    );
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(localStorage.getItem("cc_token")).toBeNull();
  });
});
