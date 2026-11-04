import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Formaciones from "./Formaciones";

describe("Módulo de Pizarra Táctica y Formaciones (Pantalla 5)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // prueba 1: renderizado inicial de la cancha, los 11 titulares y la bandeja inferior de suplentes
  it("renderiza correctamente la pizarra tactica con los 11 titulares y la bandeja horizontal de suplentes", () => {
    render(<Formaciones />);

    // titulo principal del modulo
    expect(
      screen.getByRole("heading", { level: 1, name: /pizarra táctica/i })
    ).toBeInTheDocument();

    // seccion de la cancha tactica
    expect(
      screen.getByLabelText(/cancha táctica con posiciones de jugadores/i)
    ).toBeInTheDocument();

    // verificar presencia de jugadores titulares clave en la cancha
    expect(screen.getByText(/b\. cortés/i)).toBeInTheDocument();
    expect(screen.getByText(/a\. vidal/i)).toBeInTheDocument();
    expect(screen.getByText(/j\. correa/i)).toBeInTheDocument();

    // verificar presencia de la bandeja de suplentes debajo de la cancha
    expect(screen.getByText(/suplentes/i)).toBeInTheDocument();
    expect(screen.getByText(/f\. de paul/i)).toBeInTheDocument();
    expect(screen.getByText(/e\. amor/i)).toBeInTheDocument();
    expect(screen.getByText(/v\. pizarro/i)).toBeInTheDocument();
    expect(screen.getByText(/g\. paiva/i)).toBeInTheDocument();
  });

  // prueba 2: cambio interactivo entre esquemas tacticos con animaciones de transicion
  it("permite alternar entre formaciones tacticas y actualiza el esquema activo", () => {
    render(<Formaciones />);

    // verificar que inicia con 4-3-3
    expect(screen.getByText(/activo:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/4-3-3 ofensivo/i).length).toBeGreaterThan(0);

    // seleccionar esquema 4-2-3-1
    const boton4231 = screen.getByRole("button", { name: /4-2-3-1/i });
    fireEvent.click(boton4231);

    // verificar que la formacion activa se actualizo
    expect(screen.getAllByText(/4-2-3-1 control/i).length).toBeGreaterThan(0);

    // seleccionar esquema 3-5-2
    const boton352 = screen.getByRole("button", { name: /3-5-2/i });
    fireEvent.click(boton352);

    expect(screen.getAllByText(/3-5-2 bloque alto/i).length).toBeGreaterThan(0);
  });

  // prueba 3: seleccion y sustitucion con error visible directamente en la bandeja de suplentes
  it("permite sustituir jugadores compatibles y muestra error directo en suplentes si se intenta cambio incompatible", () => {
    render(<Formaciones />);

    // paso a: seleccionar al arquero brayan cortes
    const fichaCortes = screen.getByText(/b\. cortés/i);
    fireEvent.click(fichaCortes);

    // intentar sustituir al arquero con el delantero guillermo paiva
    const botonesSustituir = screen.getAllByRole("button", { name: /sustituir/i });
    const botonPaiva = botonesSustituir[3];
    fireEvent.click(botonPaiva);

    // el error debe ser visible inmediatamente en la zona de suplentes
    expect(
      screen.getByText(/no puedes colocar a un delantero en la posición de arquero/i)
    ).toBeInTheDocument();

    // paso b: sustituir al arquero cortes con el arquero suplente fernando de paul
    const botonDePaul = botonesSustituir[0];
    fireEvent.click(botonDePaul);

    // sustitucion exitosa
    expect(
      screen.getByText(/sustitución realizada: ingresó f\. de paul \(#30\) por b\. cortés/i)
    ).toBeInTheDocument();
  });

  // prueba 4: guardado de la configuracion tactica de la pizarra
  it("permite guardar la configuracion tactica y muestra feedback exitoso", () => {
    render(<Formaciones />);

    const botonGuardar = screen.getByRole("button", {
      name: /guardar configuración/i,
    });
    fireEvent.click(botonGuardar);

    expect(
      screen.getByText(/configuración táctica y parámetros del partido guardados correctamente/i)
    ).toBeInTheDocument();
  });

  // prueba 5: modificacion interactiva de parametros tacticos con barras de porcentaje
  it("permite ajustar la altura de bloque y anchura mediante sliders de porcentaje", () => {
    render(<Formaciones />);

    const sliderBloque = screen.getByLabelText(/altura del bloque defensivo/i);
    const sliderAnchura = screen.getByLabelText(/anchura del equipo/i);

    // cambiar altura de bloque a 30% (baja)
    fireEvent.change(sliderBloque, { target: { value: 30 } });
    expect(screen.getByText(/30%/i)).toBeInTheDocument();
    expect(screen.getByText(/baja \(repliegue bajo en área\)/i)).toBeInTheDocument();

    // cambiar anchura a 90% (alta)
    fireEvent.change(sliderAnchura, { target: { value: 90 } });
    expect(screen.getByText(/90%/i)).toBeInTheDocument();
    expect(screen.getByText(/amplio \(apertura máxima por bandas\)/i)).toBeInTheDocument();
  });

  // prueba 6: creacion y gestion de un nuevo esquema tactico personalizado (CRUD)
  it("permite crear un nuevo esquema tactico personalizado y seleccionarlo", () => {
    render(<Formaciones />);

    // abrir modal de nuevo esquema
    const botonNuevo = screen.getByRole("button", { name: /\+ nuevo esquema/i });
    fireEvent.click(botonNuevo);

    // ingresar nombre
    const inputNombre = screen.getByLabelText(/nombre del esquema/i);
    fireEvent.change(inputNombre, { target: { value: "4-1-4-1 Asfixiante" } });

    // guardar esquema
    const botonGuardarEsquema = screen.getByRole("button", { name: /guardar esquema/i });
    fireEvent.click(botonGuardarEsquema);

    // verificar que el nuevo esquema fue creado y se selecciono como activo
    expect(screen.getAllByText(/4-1-4-1 asfixiante/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/nuevo esquema táctico "4-1-4-1 asfixiante" creado exitosamente/i)
    ).toBeInTheDocument();
  });
});
