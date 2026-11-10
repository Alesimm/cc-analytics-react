import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import Dashboard from "./Dashboard";

describe("Dashboard", () => {
  // limpia el dom despues de cada prueba
  afterEach(() => {
    cleanup();
  });

  it("renderiza los kpis principales del club", () => {
    render(<Dashboard />);

    expect(screen.getByText("Posesión Promedio")).toBeInTheDocument();
    expect(screen.getByText("58.4%")).toBeInTheDocument();
    expect(screen.getByText("Goles a Favor / En Contra")).toBeInTheDocument();
    expect(screen.getByText("18 / 6")).toBeInTheDocument();
    expect(screen.getByText("Tiros al Arco por Partido")).toBeInTheDocument();
    expect(screen.getByText("Precisión de Pases")).toBeInTheDocument();
  });

  it("muestra el resumen del ultimo partido colo-colo vs cobreloa 2 - 0", () => {
    render(<Dashboard />);

    const seccion = screen.getByRole("region", { name: "Último Partido" });

    expect(seccion).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Colo-Colo", level: 4 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Cobreloa", level: 4 })).toBeInTheDocument();
    expect(screen.getByText("Finalizado")).toBeInTheDocument();
    expect(screen.getByText("Victoria")).toBeInTheDocument();

    // el marcador esta repartido en spans: 2, guion y 0
    const marcador = screen.getByText("Victoria").previousElementSibling;
    expect(marcador).toHaveTextContent("2-0");
  });
});
