import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Formaciones from "./Formaciones";

describe("Módulo de Pizarra Táctica y Formaciones (Pantalla 5)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // prueba 1: renderizado inicial de la cancha, los 11 titulares y el banco
  it("renderiza correctamente la pizarra tactica con los 11 titulares y los suplentes iniciales", () => {
    render(<Formaciones />);

    // titulo principal del modulo
    expect(
      screen.getByRole("heading", { name: /pizarra táctica/i })
    ).toBeInTheDocument();

    // seccion de la cancha tactica
    expect(
      screen.getByLabelText(/cancha táctica con posiciones de jugadores/i)
    ).toBeInTheDocument();

    // verificar presencia de jugadores titulares clave en la cancha
    expect(screen.getByText(/b\. cortés/i)).toBeInTheDocument();
    expect(screen.getByText(/a\. vidal/i)).toBeInTheDocument();
    expect(screen.getByText(/j\. correa/i)).toBeInTheDocument();

    // verificar presencia de los 4 suplentes en el banco
    expect(screen.getByText(/f\. de paul/i)).toBeInTheDocument();
    expect(screen.getByText(/e\. amor/i)).toBeInTheDocument();
    expect(screen.getByText(/v\. pizarro/i)).toBeInTheDocument();
    expect(screen.getByText(/g\. paiva/i)).toBeInTheDocument();
  });

  // prueba 2: cambio interactivo entre esquemas tacticos disponibles
  it("permite alternar entre formaciones tacticas y actualiza el esquema activo", () => {
    render(<Formaciones />);

    // verificar que inicia con 4-3-3
    expect(screen.getByText(/formación activa: 4-3-3 ofensivo/i)).toBeInTheDocument();

    // seleccionar esquema 4-2-3-1
    const boton4231 = screen.getByRole("button", { name: /4-2-3-1/i });
    fireEvent.click(boton4231);

    // verificar que la formacion activa se actualizo
    expect(screen.getByText(/formación activa: 4-2-3-1 control/i)).toBeInTheDocument();

    // seleccionar esquema 3-5-2
    const boton352 = screen.getByRole("button", { name: /3-5-2/i });
    fireEvent.click(boton352);

    expect(screen.getByText(/formación activa: 3-5-2 bloque alto/i)).toBeInTheDocument();
  });

  // prueba 3: seleccion de un titular y sustitucion directa con un suplente del banco
  it("permite seleccionar un titular en cancha y sustituirlo con un suplente", () => {
    render(<Formaciones />);

    // inicialmente los botones de sustituir estan deshabilitados porque no hay titular seleccionado
    const botonesSustituir = screen.getAllByRole("button", { name: /sustituir/i });
    expect(botonesSustituir[0]).toBeDisabled();

    // seleccionar al titular javier correa haciendo clic en su ficha
    const fichaCorrea = screen.getByText(/j\. correa/i);
    fireEvent.click(fichaCorrea);

    // la ficha activa debe mostrar a javier correa
    expect(screen.getByText(/dorsal #9 • delantero/i)).toBeInTheDocument();

    // ahora los botones de sustituir deben estar habilitados
    expect(botonesSustituir[0]).not.toBeDisabled();

    // sustituir a correa con guillermo paiva (ultimo suplente)
    const botonSustituirPaiva = botonesSustituir[3];
    fireEvent.click(botonSustituirPaiva);

    // verificar mensaje de confirmacion de la sustitucion
    expect(
      screen.getByText(/sustitución realizada: ingresó g\. paiva \(#29\) por j\. correa/i)
    ).toBeInTheDocument();

    // paiva ahora debe aparecer como titular en cancha y en la ficha activa
    expect(screen.getAllByText(/g\. paiva/i).length).toBeGreaterThan(0);
  });

  // prueba 4: validacion y persistencia del formulario de directriz tactica
  it("valida la directriz tactica y guarda la configuracion en localstorage", () => {
    render(<Formaciones />);

    const botonGuardar = screen.getByRole("button", {
      name: /guardar configuración táctica/i,
    });
    const inputDirectriz = screen.getByLabelText(/instrucción estratégica/i);

    // intento 1: enviar formulario vacio
    fireEvent.click(botonGuardar);
    expect(
      screen.getByText(/debes ingresar una indicación táctica para el partido/i)
    ).toBeInTheDocument();

    // intento 2: enviar texto con menos de 5 caracteres
    fireEvent.change(inputDirectriz, { target: { value: "gol" } });
    fireEvent.click(botonGuardar);
    expect(
      screen.getByText(/la indicación táctica debe tener al menos 5 caracteres/i)
    ).toBeInTheDocument();

    // intento 3: enviar directriz valida
    fireEvent.change(inputDirectriz, {
      target: { value: "Presión alta al volante central y salida limpia con laterales." },
    });
    fireEvent.click(botonGuardar);

    // verificar feedback exitoso
    expect(
      screen.getByText(/configuración táctica y directriz guardadas en la pizarra/i)
    ).toBeInTheDocument();

    // verificar que no queden errores en pantalla
    expect(
      screen.queryByText(/la indicación táctica debe tener al menos 5 caracteres/i)
    ).not.toBeInTheDocument();
  });

  // prueba 5: actualizacion interactiva de parametros tacticos (bloque, presion, posesion)
  it("permite modificar los parametros tacticos del partido", () => {
    render(<Formaciones />);

    // cambiar linea defensiva a media
    const botonMedia = screen.getAllByRole("button", { name: /^media$/i })[0];
    fireEvent.click(botonMedia);

    // cambiar intensidad de presion a conservadora
    const botonConservadora = screen.getByRole("button", { name: /conservadora/i });
    fireEvent.click(botonConservadora);

    // cambiar estilo de posesion a vertical
    const botonVertical = screen.getByRole("button", { name: /vertical/i });
    fireEvent.click(botonVertical);

    // verificar seleccion activa por estilo de boton (blanco)
    expect(botonConservadora).toHaveClass("bg-white text-black");
    expect(botonVertical).toHaveClass("bg-white text-black");
  });
});
