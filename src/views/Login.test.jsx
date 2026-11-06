import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

// Mock de useNavigate para verificar la redireccion
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Formulario de Autenticación (Login)", () => {
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

    // No debe navegar si hay errores
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Prueba 2: Gestion de estado y envio exitoso con credenciales validas
  it("permite el ingreso y redirige a /dashboard cuando los datos son correctos", () => {
    mockNavigate.mockClear();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const inputEmail = screen.getByLabelText(/correo institucional/i);
    const inputPassword = screen.getByLabelText(/código de acceso/i);
    const botonIngresar = screen.getByRole("button", {
      name: /ingresar al sistema/i,
    });

    // Simular escritura de datos validos (cambio de estado)
    fireEvent.change(inputEmail, {
      target: { value: "entrenador@colocolo.cl" },
    });
    fireEvent.change(inputPassword, {
      target: { value: "colo2026" },
    });

    // Simular envio de formulario
    fireEvent.click(botonIngresar);

    // Verificar que no hay errores y navega al dashboard
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
