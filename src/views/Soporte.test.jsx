import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Soporte from "./Soporte";

describe("Módulo de Soporte Técnico y Contacto (Pantalla 8)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // prueba 1: renderizado inicial de cabecera, kpis y listado de tickets
  it("renderiza correctamente la cabecera, métricas de soporte y solicitudes iniciales", () => {
    render(<Soporte />);

    // titulo principal
    expect(
      screen.getByRole("heading", { level: 1, name: /soporte técnico/i })
    ).toBeInTheDocument();

    // seccion de tickets registrados
    expect(
      screen.getByRole("heading", { level: 2, name: /historial de solicitudes/i })
    ).toBeInTheDocument();

    // tickets iniciales visibles
    expect(
      screen.getByText(/sincronización de velocidad punta en módulo de rendimiento/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/jorge almirón/i)).toBeInTheDocument();
  });

  // prueba 2: validacion de formulario sin atributos html prohibidos
  it("bloquea el envío y muestra errores de validación propios cuando los campos son inválidos", () => {
    render(<Soporte />);

    const botonEnviar = screen.getByRole("button", {
      name: /registrar ticket en mesa de ayuda/i,
    });
    fireEvent.click(botonEnviar);

    // verificar mensajes de error personalizados
    expect(
      screen.getByText(/el nombre del solicitante es obligatorio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/el correo de contacto es obligatorio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/el asunto de la solicitud es obligatorio/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/la descripción del problema es obligatoria/i)
    ).toBeInTheDocument();
  });

  // prueba 3: validacion de formato de correo electronico sin type="email"
  it("valida el formato de correo electrónico mediante lógica JS propia", () => {
    render(<Soporte />);

    const inputNombre = screen.getByLabelText(/nombre del solicitante/i);
    const inputEmail = screen.getByLabelText(/correo de contacto/i);
    const inputAsunto = screen.getByLabelText(/asunto del requerimiento/i);
    const inputDesc = screen.getByLabelText(/descripción detallada/i);

    fireEvent.change(inputNombre, { target: { value: "Esteban Pavez" } });
    fireEvent.change(inputEmail, { target: { value: "correo-invalido-sin-arroba" } });
    fireEvent.change(inputAsunto, { target: { value: "Falla de sincronización" } });
    fireEvent.change(inputDesc, {
      target: { value: "Descripción detallada de la incidencia técnica ocurrida." },
    });

    const botonEnviar = screen.getByRole("button", {
      name: /registrar ticket en mesa de ayuda/i,
    });
    fireEvent.click(botonEnviar);

    expect(
      screen.getByText(/ingresa un formato de correo válido/i)
    ).toBeInTheDocument();
  });

  // prueba 4: creacion exitosa de un nuevo ticket
  it("permite registrar un nuevo ticket y muestra la confirmación de emisión en pantalla", () => {
    render(<Soporte />);

    const inputNombre = screen.getByLabelText(/nombre del solicitante/i);
    const inputEmail = screen.getByLabelText(/correo de contacto/i);
    const inputAsunto = screen.getByLabelText(/asunto del requerimiento/i);
    const inputDesc = screen.getByLabelText(/descripción detallada/i);

    fireEvent.change(inputNombre, { target: { value: "Arturo Vidal" } });
    fireEvent.change(inputEmail, { target: { value: "a.vidal@colocolo.cl" } });
    fireEvent.change(inputAsunto, { target: { value: "Solicitud de reporte físico post partido" } });
    fireEvent.change(inputDesc, {
      target: { value: "Requiero la planilla comparativa de distancias recorridas en el clásico." },
    });

    const botonEnviar = screen.getByRole("button", {
      name: /registrar ticket en mesa de ayuda/i,
    });
    fireEvent.click(botonEnviar);

    // debe mostrar el banner de confirmacion con el ID
    expect(
      screen.getByText(/generado con éxito/i)
    ).toBeInTheDocument();

    // debe aparecer en el historial
    expect(
      screen.getAllByText(/solicitud de reporte físico post partido/i).length
    ).toBeGreaterThan(0);
  });

  // prueba 5: filtrado reactivo de tickets por busqueda y estado
  it("permite buscar y filtrar tickets en tiempo real", () => {
    render(<Soporte />);

    const inputBusqueda = screen.getByLabelText(/buscar tickets de soporte/i);
    fireEvent.change(inputBusqueda, { target: { value: "velocidad punta" } });

    expect(
      screen.getByText(/sincronización de velocidad punta en módulo de rendimiento/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/habilitación de acceso analítico/i)
    ).not.toBeInTheDocument();

    // limpiar filtro
    const selectEstado = screen.getByLabelText(/filtrar por estado/i);
    fireEvent.change(selectEstado, { target: { value: "Resuelto" } });
    fireEvent.change(inputBusqueda, { target: { value: "" } });

    expect(
      screen.getByText(/sincronización de velocidad punta en módulo de rendimiento/i)
    ).toBeInTheDocument();
  });

  // prueba 6: cambio de estado de ticket (resolver y reabrir)
  it("permite alternar el estado del ticket entre resuelto y en revisión", () => {
    render(<Soporte />);

    // el ticket 103 esta abierto
    const botonesMarcar = screen.getAllByRole("button", { name: /marcar resuelto/i });
    fireEvent.click(botonesMarcar[0]);

    expect(
      screen.getByText(/estado del ticket actualizado a "resuelto"/i)
    ).toBeInTheDocument();
  });

  // prueba 7: eliminacion con confirmacion inline sin usar confirm()
  it("permite eliminar un ticket con confirmación inline sin invocar confirm()", () => {
    render(<Soporte />);

    const botonesEliminar = screen.getAllByRole("button", { name: /^eliminar$/i });
    fireEvent.click(botonesEliminar[0]);

    // debe mostrar la confirmacion inline
    expect(
      screen.getByText(/¿eliminar ticket/i)
    ).toBeInTheDocument();

    const botonConfirmar = screen.getByRole("button", { name: /sí, eliminar/i });
    fireEvent.click(botonConfirmar);

    expect(
      screen.getByText(/ticket eliminado del registro de soporte/i)
    ).toBeInTheDocument();
  });
});

