import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Plantel from "./Plantel";

describe("Módulo de Plantel de Jugadores (Pantalla 3 - Integración CRUD)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // prueba 1: renderizado inicial del catalogo del plantel y metricas cuantitativas
  it("renderiza correctamente la cabecera, indicadores cuantitativos y listado de futbolistas", () => {
    render(<Plantel />);

    expect(
      screen.getByRole("heading", { level: 1, name: /catálogo del plantel/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/total en plantel/i)).toBeInTheDocument();
    expect(screen.getByText(/aptos para competir/i)).toBeInTheDocument();
    expect(screen.getByText(/área médica/i)).toBeInTheDocument();

    // futbolistas emblema visibles
    expect(screen.getByText(/brayan cortés/i)).toBeInTheDocument();
    expect(screen.getByText(/arturo vidal/i)).toBeInTheDocument();
    expect(screen.getByText(/javier correa/i)).toBeInTheDocument();
  });

  // prueba 2: busqueda reactiva en tiempo real
  it("filtra futbolistas por nombre o dorsal al escribir en la barra de busqueda", () => {
    render(<Plantel />);

    const inputBusqueda = screen.getByPlaceholderText(/buscar por nombre, dorsal o posición/i);
    fireEvent.change(inputBusqueda, { target: { value: "Vidal" } });

    expect(screen.getByText(/arturo vidal/i)).toBeInTheDocument();
    expect(screen.queryByText(/brayan cortés/i)).not.toBeInTheDocument();
  });

  // prueba 3: creacion e insercion de un nuevo futbolista en el plantel
  it("permite abrir el modal, completar el formulario y registrar un nuevo jugador con feedback inline", () => {
    render(<Plantel />);

    // abrir modal con boton Nuevo Jugador
    const botonNuevo = screen.getByText(/nuevo jugador/i).closest("button");
    fireEvent.click(botonNuevo);

    // verificar presencia del modal
    expect(screen.getByRole("heading", { name: /nuevo jugador/i, level: 2 })).toBeInTheDocument();

    // completar formulario con datos validos
    fireEvent.change(screen.getByLabelText(/nombre y apellidos/i), {
      target: { value: "Carlos Carmona" },
    });
    fireEvent.change(screen.getByLabelText(/dorsal/i), {
      target: { value: "55" },
    });
    fireEvent.change(screen.getByLabelText(/edad/i), {
      target: { value: "28" },
    });

    // guardar ficha
    fireEvent.click(screen.getByRole("button", { name: /crear ficha/i }));

    // verificar feedback inline de incorporacion exitosa
    expect(
      screen.getByText(/jugador carlos carmona incorporado al plantel/i)
    ).toBeInTheDocument();

    // verificar presencia en el catalogo (aparece en el banner y en la tarjeta del jugador)
    expect(screen.getAllByText(/carlos carmona/i).length).toBeGreaterThanOrEqual(2);
  });

  // prueba 4: eliminacion de jugador con confirmacion inline sin popups
  it("permite dar de baja a un jugador con confirmacion inline segura", () => {
    render(<Plantel />);

    // buscar los botones Eliminar de los futbolistas
    const botonesEliminar = screen.getAllByRole("button", { name: /eliminar/i });
    fireEvent.click(botonesEliminar[0]);

    // debe mostrarse la confirmacion inline sin usar confirm()
    expect(
      screen.getByText(/¿confirmar baja de/i)
    ).toBeInTheDocument();

    const botonConfirmar = screen.getByRole("button", { name: /sí, dar de baja/i });
    fireEvent.click(botonConfirmar);

    // verificar feedback inline de baja
    expect(
      screen.getByText(/fue dado de baja del plantel/i)
    ).toBeInTheDocument();
  });
});
