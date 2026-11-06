import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RegistroMedicoForm from "./RegistroMedicoForm";
import CentroMedico from "./CentroMedico";

const plantelPrueba = [
  { id: "jug-4", nombre: "Alan Saldivia", dorsal: 4, posicion: "Defensa" },
  { id: "jug-15", nombre: "Alexander Oroz", dorsal: 20, posicion: "Delantero" },
];

describe("Módulo de Centro Médico y Control de Lesiones (Pantalla 7)", () => {
  // PRUEBA 1 (Formulario): Validacion y renderizado condicional de errores en campos vacios/invalidos
  it("muestra errores de validación y bloquea el guardado si los datos clínicos son inválidos", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(
      <RegistroMedicoForm
        plantel={plantelPrueba}
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
      />
    );

    const inputDiagnostico = screen.getByLabelText(/diagnóstico clínico/i);
    const inputDias = screen.getByLabelText(/días estimados/i);
    const botonGuardar = screen.getByRole("button", {
      name: /registrar lesión/i,
    });

    // Vaciar campos obligatorios
    fireEvent.change(inputDiagnostico, { target: { value: "" } });
    fireEvent.change(inputDias, { target: { value: "" } });

    fireEvent.click(botonGuardar);

    // Verificar mensajes de error en pantalla
    expect(
      screen.getByText(/el diagnóstico médico es obligatorio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/los días de recuperación deben ser un número entero/i)
    ).toBeInTheDocument();

    expect(mockGuardar).not.toHaveBeenCalled();
  });

  // PRUEBA 2 (Formulario): Gestion de estado y envio exitoso con mock
  it("guarda correctamente y ejecuta el callback onGuardar con los datos clínicos válidos", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(
      <RegistroMedicoForm
        plantel={plantelPrueba}
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
      />
    );

    const inputDiagnostico = screen.getByLabelText(/diagnóstico clínico/i);
    const inputDias = screen.getByLabelText(/días estimados/i);
    const botonGuardar = screen.getByRole("button", {
      name: /registrar lesión/i,
    });

    fireEvent.change(inputDiagnostico, {
      target: { value: "Desgarro miofascial en bíceps femoral" },
    });
    fireEvent.change(inputDias, { target: { value: "21" } });

    fireEvent.click(botonGuardar);

    expect(mockGuardar).toHaveBeenCalledTimes(1);
    expect(mockGuardar).toHaveBeenCalledWith(
      expect.objectContaining({
        diagnostico: "Desgarro miofascial en bíceps femoral",
        diasRecuperacion: 21,
        tipoLesion: "Muscular",
      })
    );
  });

  // PRUEBA 3 (Formulario): Evento de cancelacion
  it("ejecuta onCancelar al hacer clic en el botón Cancelar", () => {
    const mockGuardar = vi.fn();
    const mockCancelar = vi.fn();

    render(
      <RegistroMedicoForm
        plantel={plantelPrueba}
        onGuardar={mockGuardar}
        onCancelar={mockCancelar}
      />
    );

    const botonCancelar = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(botonCancelar);

    expect(mockCancelar).toHaveBeenCalledTimes(1);
  });

  // PRUEBA 4 (Vista principal): Renderizado de cabecera y metricas cuantitativas
  it("renderiza correctamente la cabecera, contadores clínicos y las fichas médicas", () => {
    render(<CentroMedico />);

    expect(
      screen.getByRole("heading", { name: /centro médico/i, level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText(/bajas activas/i)).toBeInTheDocument();
    expect(screen.getByText(/en reintegro deportivo/i)).toBeInTheDocument();
    expect(screen.getByText(/altas médicas concedidas/i)).toBeInTheDocument();

    // Comprobar presencia de fichas de prueba
    expect(screen.getByText(/Alan Saldivia/i)).toBeInTheDocument();
    expect(screen.getByText(/Alexander Oroz/i)).toBeInTheDocument();
  });

  // PRUEBA 5 (Vista principal): Filtro por categoria de lesion
  it("filtra fichas médicas correctamente al seleccionar una categoría específica", () => {
    render(<CentroMedico />);

    const botonFiltroMuscular = screen.getByRole("button", {
      name: /^muscular$/i,
    });
    fireEvent.click(botonFiltroMuscular);

    // Debe mostrar la ficha muscular de Saldivia pero no la ligamentosa de Oroz
    expect(screen.getByText(/Alan Saldivia/i)).toBeInTheDocument();
    expect(screen.queryByText(/Alexander Oroz/i)).not.toBeInTheDocument();
  });

  // PRUEBA 6 (Vista principal): Accion de conceder Alta Medica
  it("permite otorgar el alta médica y actualiza el estado clínico del futbolista", () => {
    render(<CentroMedico />);

    const botonesAlta = screen.getAllByRole("button", {
      name: /dar alta médica/i,
    });
    expect(botonesAlta.length).toBeGreaterThan(0);

    // Presionar el primer boton de alta medica disponible
    fireEvent.click(botonesAlta[0]);

    // Verificar banner de feedback
    expect(screen.getByText(/alta médica otorgada a/i)).toBeInTheDocument();
  });

  // PRUEBA 7 (Vista principal): Confirmacion inline de archivado
  it("despliega confirmación inline para archivar ficha médica sin usar confirm()", () => {
    render(<CentroMedico />);

    const botonesArchivar = screen.getAllByRole("button", {
      name: /archivar/i,
    });
    fireEvent.click(botonesArchivar[0]);

    expect(
      screen.getByText(/¿confirmar archivo de ficha médica de/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sí, archivar/i })
    ).toBeInTheDocument();
  });
});

