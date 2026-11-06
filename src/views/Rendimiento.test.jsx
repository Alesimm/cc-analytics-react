import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Rendimiento from "./Rendimiento";

describe("Módulo de Rendimiento Individual (Pantalla 4)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // helper para seleccionar a un futbolista desde el estado inicial skeleton
  const seleccionarFutbolistaDemo = (nombre = /arturo vidal/i) => {
    const botonCatalogo = screen.getByRole("button", { name: /catálogo/i });
    fireEvent.click(botonCatalogo);
    const opcion = screen.getByRole("button", { name: nombre });
    fireEvent.click(opcion);
  };

  // prueba 1: renderizado del estado skeleton inicial y posterior activacion del perfil con radar chart
  it("renderiza correctamente la vista de Analisis Individual y los 6 ejes del radar", () => {
    render(<Rendimiento />);

    // titulo principal del modulo
    expect(
      screen.getByRole("heading", { name: /análisis individual/i })
    ).toBeInTheDocument();

    // estado inicial: skeleton esperando asignacion
    expect(
      screen.getByText(/ningún futbolista seleccionado/i)
    ).toBeInTheDocument();

    // seleccionar un futbolista del catalogo
    seleccionarFutbolistaDemo(/arturo vidal/i);

    // grafico radial svg nativo de 6 ejes ahora activo
    expect(
      screen.getByLabelText(/gráfico radial de estadísticas individuales/i)
    ).toBeInTheDocument();

    // secciones principales
    expect(screen.getByText(/estadísticas avanzadas/i)).toBeInTheDocument();
    expect(screen.getByText(/forma y rendimiento reciente/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /directrices y recomendaciones tácticas del cuerpo técnico/i,
      })
    ).toBeInTheDocument();
  });

  // prueba 2: cambio interactivo de jugador mediante el buscador / catalogo desplegable y actualizacion de datos
  it("permite seleccionar otro futbolista mediante el buscador/catalogo y actualiza los partidos recientes dinamicamente", () => {
    render(<Rendimiento />);

    // seleccionar brayan cortes en el catalogo
    seleccionarFutbolistaDemo(/brayan cortés/i);

    // verificar que el perfil principal se actualice con brayan cortes
    expect(
      screen.getByRole("heading", { name: /brayan cortés/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/arquero/i).length).toBeGreaterThan(0);

    // verificar que las metricas especificas de arquero aparezcan en rendimiento reciente
    expect(screen.getAllByText(/atajadas/i).length).toBeGreaterThan(0);
  });

  // prueba 3 (formulario): validacion de errores al intentar registrar directriz vacia
  it("muestra mensajes de error cuando se envia una directriz o recomendacion vacia", () => {
    render(<Rendimiento />);

    seleccionarFutbolistaDemo(/arturo vidal/i);

    // abrir el formulario de nueva directriz
    const botonNueva = screen.getByRole("button", {
      name: /\+ nueva directriz táctica/i,
    });
    fireEvent.click(botonNueva);

    const botonGuardar = screen.getByRole("button", {
      name: /guardar directriz/i,
    });
    fireEvent.click(botonGuardar);

    // verificar mensaje de error condicional en pantalla sin alert()
    expect(
      screen.getByText(/la directriz o recomendación táctica no puede estar vacía/i)
    ).toBeInTheDocument();
  });

  // prueba 4 (formulario): creacion exitosa de una directriz tactica
  it("permite registrar una nueva directriz para el futbolista y muestra feedback inline", () => {
    render(<Rendimiento />);

    seleccionarFutbolistaDemo(/arturo vidal/i);

    const botonNueva = screen.getByRole("button", {
      name: /\+ nueva directriz táctica/i,
    });
    fireEvent.click(botonNueva);

    const inputIndicacion = screen.getByLabelText(
      /directriz o recomendación táctica/i
    );
    const botonGuardar = screen.getByRole("button", {
      name: /guardar directriz/i,
    });

    fireEvent.change(inputIndicacion, {
      target: { value: "Ajustar basculaciones defensivas ante balon detenido." },
    });
    fireEvent.click(botonGuardar);

    // verificar que la directriz aparezca en pantalla
    expect(
      screen.getByText(/ajustar basculaciones defensivas ante balon detenido/i)
    ).toBeInTheDocument();

    // verificar mensaje de feedback
    expect(
      screen.getByText(/directriz táctica registrada/i)
    ).toBeInTheDocument();
  });

  // prueba 5 (admin crud): edicion de directriz existente
  it("permite editar una directriz existente y actualizar su contenido", () => {
    render(<Rendimiento />);

    seleccionarFutbolistaDemo(/arturo vidal/i);

    // buscar los botones de editar existentes en las directrices precargadas
    const botonesEditar = screen.getAllByRole("button", { name: /editar/i });
    expect(botonesEditar.length).toBeGreaterThan(0);

    fireEvent.click(botonesEditar[0]);

    // el formulario debe abrirse en modo edicion con el boton Actualizar Directriz
    const botonActualizar = screen.getByRole("button", {
      name: /actualizar directriz/i,
    });
    expect(botonActualizar).toBeInTheDocument();

    const inputIndicacion = screen.getByLabelText(
      /directriz o recomendación táctica/i
    );
    fireEvent.change(inputIndicacion, {
      target: { value: "Directriz actualizada para el microciclo semanal." },
    });

    fireEvent.click(botonActualizar);

    // verificar contenido actualizado
    expect(
      screen.getByText(/directriz actualizada para el microciclo semanal/i)
    ).toBeInTheDocument();
  });

  // prueba 6 (admin crud): eliminacion discreta con confirmacion inline
  it("permite eliminar una directriz con confirmacion inline sin usar confirm()", () => {
    render(<Rendimiento />);

    seleccionarFutbolistaDemo(/arturo vidal/i);

    const botonesEliminar = screen.getAllByRole("button", { name: /eliminar/i });
    expect(botonesEliminar.length).toBeGreaterThan(0);

    // clic en eliminar despliega confirmacion inline discreta
    fireEvent.click(botonesEliminar[0]);

    expect(screen.getByText(/¿eliminar directriz\?/i)).toBeInTheDocument();

    const botonConfirmarSi = screen.getByRole("button", { name: /^sí$/i });
    fireEvent.click(botonConfirmarSi);

    // feedback de eliminacion
    expect(
      screen.getByText(/directriz táctica eliminada/i)
    ).toBeInTheDocument();
  });

  // prueba 7: visualizacion correcta de partidos no disputados sin calificacion ficticia
  it("muestra el estado de sin participacion para futbolistas que no jugaron un cotejo", () => {
    render(<Rendimiento />);

    // seleccionar fernando de paul directamente desde el catalogo
    seleccionarFutbolistaDemo(/fernando de paul/i);

    // verificar presencia de etiqueta 'sin participacion' para los partidos en banca
    expect(
      screen.getAllByText(/sin participación/i).length
    ).toBeGreaterThan(0);
  });
});
