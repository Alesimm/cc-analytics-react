import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import JugadorForm from "./JugadorForm";

const plantelPrueba = [
  { id: "jug-1", nombre: "Brayan Cortés", dorsal: 1, posicion: "Arquero", edad: 29 },
  { id: "jug-2", nombre: "Maximiliano Falcón", dorsal: 37, posicion: "Defensa", edad: 27 },
];

describe("Formulario de Jugador (Plantel - CRUD)", () => {
  // Prueba 1: Validacion y renderizado condicional de errores al enviar campos vacios
  it("muestra errores de validación y bloquea el guardado cuando los campos son inválidos", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(
      <JugadorForm
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
        plantelActual={plantelPrueba}
      />
    );

    const botonGuardar = screen.getByRole("button", { name: /crear ficha/i });

    // Enviar sin completar nombre ni dorsal ni edad
    fireEvent.click(botonGuardar);

    // Verificar mensajes de error condicionales en el DOM
    expect(
      screen.getByText(/el nombre del jugador es obligatorio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/el dorsal debe ser un número entero válido/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/la edad debe ser un número entero/i)
    ).toBeInTheDocument();

    // El callback mock de guardado no debe haberse ejecutado
    expect(mockGuardar).not.toHaveBeenCalled();
  });

  // Prueba 2: Validacion de regla deportiva (dorsal unico no repetido)
  it("detecta y muestra error si el número de dorsal ya está ocupado por otro jugador", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(
      <JugadorForm
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
        plantelActual={plantelPrueba}
      />
    );

    const inputNombre = screen.getByLabelText(/nombre y apellidos/i);
    const inputDorsal = screen.getByLabelText(/dorsal/i);
    const inputEdad = screen.getByLabelText(/edad/i);
    const botonGuardar = screen.getByRole("button", { name: /crear ficha/i });

    // Asignar datos pero con dorsal 1 que ya pertenece a Brayan Cortés
    fireEvent.change(inputNombre, { target: { value: "Nuevo Arquero" } });
    fireEvent.change(inputDorsal, { target: { value: "1" } });
    fireEvent.change(inputEdad, { target: { value: "25" } });

    fireEvent.click(botonGuardar);

    // Debe mostrar error de dorsal duplicado
    expect(
      screen.getByText(/el dorsal #1 ya está asignado a otro jugador/i)
    ).toBeInTheDocument();
    expect(mockGuardar).not.toHaveBeenCalled();
  });

  // Prueba 3: Gestion de estado, props y ejecucion exitosa de onGuardar con mock
  it("guarda correctamente y ejecuta el callback onGuardar con los datos ingresados", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(
      <JugadorForm
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
        plantelActual={plantelPrueba}
      />
    );

    const inputNombre = screen.getByLabelText(/nombre y apellidos/i);
    const inputDorsal = screen.getByLabelText(/dorsal/i);
    const inputEdad = screen.getByLabelText(/edad/i);
    const botonGuardar = screen.getByRole("button", { name: /crear ficha/i });

    // Completar con datos validos
    fireEvent.change(inputNombre, { target: { value: "Arturo Vidal" } });
    fireEvent.change(inputDorsal, { target: { value: "23" } });
    fireEvent.change(inputEdad, { target: { value: "37" } });

    fireEvent.click(botonGuardar);

    // Verificar que mockGuardar fue invocado con los datos normalizados
    expect(mockGuardar).toHaveBeenCalledTimes(1);
    expect(mockGuardar).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: "Arturo Vidal",
        dorsal: 23,
        edad: 37,
        posicion: "Mediocampista",
      })
    );
  });

  // Prueba 4: Manejo de evento Cancelar mediante props
  it("invoca la función onCancelar al hacer clic en el botón Cancelar", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(
      <JugadorForm
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
        plantelActual={plantelPrueba}
      />
    );

    const botonCancelar = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(botonCancelar);

    expect(mockCancelar).toHaveBeenCalledTimes(1);
  });
});

