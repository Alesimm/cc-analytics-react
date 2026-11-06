import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Calendario from "./Calendario";

const renderCalendario = () => {
  return render(
    <BrowserRouter>
      <Calendario />
    </BrowserRouter>
  );
};

describe("Módulo de Calendario de Partidos y Fixture (Pantalla 6)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // prueba 1: renderizado inicial del calendario y proximo desafio
  it("renderiza correctamente la cabecera, el proximo encuentro oficial y los partidos programados", () => {
    renderCalendario();

    // titulo principal
    expect(
      screen.getByRole("heading", { level: 1, name: /calendario de partidos/i })
    ).toBeInTheDocument();

    // tarjeta destacada del proximo desafio oficial
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /próximo encuentro oficial \/\/ campeonato nacional/i,
      })
    ).toBeInTheDocument();

    // verificar presencia de rivales clave en la seccion de proximos
    expect(screen.getAllByText(/universidad católica/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/palmeiras/i)).toBeInTheDocument();
  });

  // prueba 2: alternancia de pestanas entre proximos, historial y todos
  it("permite alternar entre proximos partidos e historial de resultados", () => {
    renderCalendario();

    // inicialmente esta en proximos partidos
    expect(screen.getByText(/palmeiras/i)).toBeInTheDocument();

    // cambiar a historial de resultados
    const botonHistorial = screen.getByRole("button", {
      name: /historial de resultados/i,
    });
    fireEvent.click(botonHistorial);

    // verificar que aparecen partidos anteriores y sus marcadores
    expect(screen.getAllByText(/universidad de chile/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/junior de barranquilla/i)).toBeInTheDocument();
    expect(screen.getByText(/cobresal/i)).toBeInTheDocument();

    // cambiar a la pestana "Todos"
    const botonTodos = screen.getByRole("button", { name: /^todos \(/i });
    fireEvent.click(botonTodos);

    expect(screen.getAllByText(/universidad católica/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/universidad de chile/i).length).toBeGreaterThan(0);
  });

  // prueba 3: busqueda reactiva por nombre de rival
  it("filtra partidos en tiempo real al escribir en la barra de busqueda", () => {
    renderCalendario();

    const inputBusqueda = screen.getByLabelText(/buscar partido por rival o estadio/i);

    // buscar 'palmeiras'
    fireEvent.change(inputBusqueda, { target: { value: "Palmeiras" } });

    expect(screen.getByText(/palmeiras/i)).toBeInTheDocument();
    expect(screen.queryByText(/everton/i)).not.toBeInTheDocument();
  });

  // prueba 4: filtro secundario por competicion
  it("filtra los partidos por torneo seleccionado en el desplegable", () => {
    renderCalendario();

    const selectTorneo = screen.getByLabelText(/filtrar por torneo/i);

    // seleccionar copa libertadores
    fireEvent.change(selectTorneo, { target: { value: "Copa Libertadores" } });

    expect(screen.getByText(/palmeiras/i)).toBeInTheDocument();
    expect(screen.queryByText(/everton/i)).not.toBeInTheDocument();
  });

  // prueba 5: despliegue de ficha tecnica y estadisticas de un partido finalizado
  it("permite desplegar y ocultar la ficha tecnica con estadisticas de un partido finalizado", () => {
    renderCalendario();

    // ir a historial de resultados
    const botonHistorial = screen.getByRole("button", {
      name: /historial de resultados/i,
    });
    fireEvent.click(botonHistorial);

    // hacer clic en 'Ver Ficha' del primer partido finalizado (Superclasico vs U. de Chile)
    const botonesFicha = screen.getAllByRole("button", { name: /ver ficha/i });
    fireEvent.click(botonesFicha[0]);

    // verificar despliegue de incidencias y estadisticas
    expect(screen.getByText(/incidencias y goleadores/i)).toBeInTheDocument();
    expect(screen.getByText(/estadísticas del partido/i)).toBeInTheDocument();
    expect(screen.getByText(/posesión/i)).toBeInTheDocument();
    expect(screen.getByText(/precisión de pases/i)).toBeInTheDocument();
    expect(screen.getByText(/j\. correa 34', c\. palacios 78'/i)).toBeInTheDocument();

    // ocultar ficha
    const botonOcultar = screen.getByRole("button", { name: /ocultar ficha/i });
    fireEvent.click(botonOcultar);

    expect(screen.queryByText(/incidencias y goleadores/i)).not.toBeInTheDocument();
  });

  // prueba 6: validacion del formulario al programar un nuevo partido
  it("bloquea el envio y muestra mensajes de error propios cuando los campos estan vacios", () => {
    renderCalendario();

    // abrir modal
    const botonProgramar = screen.getByRole("button", { name: /\+ programar partido/i });
    fireEvent.click(botonProgramar);

    // intentar enviar formulario vacio
    const botonGuardar = screen.getByRole("button", { name: /guardar encuentro/i });
    fireEvent.click(botonGuardar);

    // verificar presencia de mensajes de error de validacion
    expect(screen.getByText(/debes ingresar el nombre del club rival/i)).toBeInTheDocument();
    expect(screen.getByText(/debes seleccionar la fecha del partido/i)).toBeInTheDocument();
    expect(screen.getByText(/debes ingresar la hora de inicio/i)).toBeInTheDocument();
  });

  // prueba 7: creacion y eliminacion inline de un partido programado (CRUD)
  it("permite programar un nuevo encuentro y posteriormente eliminarlo con confirmacion inline", () => {
    renderCalendario();

    // abrir modal
    const botonProgramar = screen.getByRole("button", { name: /\+ programar partido/i });
    fireEvent.click(botonProgramar);

    // completar campos
    fireEvent.change(screen.getByLabelText(/club rival/i), {
      target: { value: "Deportes La Serena" },
    });
    fireEvent.change(screen.getByLabelText(/fecha/i), {
      target: { value: "2026-12-10" },
    });
    fireEvent.change(screen.getByLabelText(/hora/i), {
      target: { value: "19:00" },
    });

    // guardar
    fireEvent.click(screen.getByRole("button", { name: /guardar encuentro/i }));

    // verificar mensaje de exito y presencia en el listado
    expect(
      screen.getByText(/partido contra deportes la serena programado exitosamente/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/deportes la serena/i).length).toBeGreaterThan(0);

    // eliminar el partido recien creado
    const botonEliminar = screen.getByRole("button", { name: /eliminar/i });
    fireEvent.click(botonEliminar);

    // verificar confirmacion inline sin confirm()
    expect(
      screen.getByText(/¿confirmas la eliminación de este partido del fixture oficial\?/i)
    ).toBeInTheDocument();

    // confirmar eliminacion
    const botonConfirmar = screen.getByRole("button", { name: /sí, eliminar/i });
    fireEvent.click(botonConfirmar);

    // verificar mensaje de feedback de eliminacion y que ya no aparece como partido
    expect(
      screen.getByText(/partido contra deportes la serena eliminado del calendario/i)
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /eliminar/i })).not.toBeInTheDocument();
  });
});
