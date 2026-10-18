// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App";

const datos = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Tarea ${i + 1}`,
  completed: i >= 6,
}));
let fallo;
let peticiones;
let demora;
beforeEach(() => {
  fallo = "";
  demora = 0;
  peticiones = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url, opciones = {}) => {
      const metodo = opciones.method || "GET";
      peticiones.push({
        url,
        metodo,
        body: opciones.body && JSON.parse(opciones.body),
      });
      if (demora) await new Promise((resolve) => setTimeout(resolve, demora));
      const ok = fallo !== metodo;
      return {
        ok,
        json: async () =>
          metodo === "GET"
            ? datos
            : { id: 201, ...JSON.parse(opciones.body || "{}") },
      };
    }),
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
async function iniciar() {
  const usuario = userEvent.setup();
  render(<App />);
  await screen.findByText("Total");
  await usuario.click(
    screen.getByRole("button", { name: "Tareas", exact: true }),
  );
  return usuario;
}
function contador(texto) {
  return screen.getByText(texto).parentElement.firstChild.textContent;
}

test("01 - carga diez tareas y calcula el resumen", async () => {
  await iniciar();
  expect(screen.getAllByRole("listitem")).toHaveLength(10);
  expect(peticiones[0].url).toContain("?_limit=10");
  fireEvent.click(screen.getByRole("button", { name: "Resumen", exact: true }));
  expect(contador("Total")).toBe("10");
  expect(contador("Pendientes")).toBe("6");
  expect(contador("Completadas")).toBe("4");
});

test("02 - búsqueda y filtro se conservan entre vistas y actualizan mostrando", async () => {
  const u = await iniciar();
  await u.click(
    screen.getByRole("button", { name: "Pendientes", exact: true }),
  );
  await u.type(
    screen.getByRole("textbox", { name: "Buscar tarea" }),
    "TAREA 1",
  );
  expect(screen.getAllByRole("listitem")).toHaveLength(1);
  await u.click(screen.getByRole("button", { name: "Resumen", exact: true }));
  expect(contador("Mostrando (pendientes y búsqueda)")).toBe("1");
  await u.click(screen.getByRole("button", { name: "Tareas", exact: true }));
  expect(screen.getByRole("textbox", { name: "Buscar tarea" }).value).toBe(
    "TAREA 1",
  );
  await u.clear(screen.getByRole("textbox", { name: "Buscar tarea" }));
  await u.type(
    screen.getByRole("textbox", { name: "Buscar tarea" }),
    "inexistente",
  );
  expect(
    screen.getByText("No hay tareas que coincidan con los filtros."),
  ).toBeTruthy();
});

test("03 - valida creación y mantiene dos tareas aunque el POST repita id", async () => {
  const u = await iniciar();
  await u.click(
    screen.getByRole("button", { name: "Nueva tarea", exact: true }),
  );
  const input = screen.getByRole("textbox", {
    name: "Título de la nueva tarea",
  });
  await u.type(input, "   ");
  await u.click(screen.getByRole("button", { name: "Agregar", exact: true }));
  expect(screen.getByRole("alert").textContent).toContain("vacío");
  expect(peticiones.filter((p) => p.metodo === "POST")).toHaveLength(0);
  await u.clear(input);
  await u.type(input, "Nueva A");
  await u.click(screen.getByRole("button", { name: "Agregar", exact: true }));
  await screen.findByText(/Tarea creada/);
  await u.type(input, "Nueva B");
  await u.click(screen.getByRole("button", { name: "Agregar", exact: true }));
  await screen.findByText(/Tarea creada/);
  await u.click(screen.getByRole("button", { name: "Tareas", exact: true }));
  expect(screen.getAllByRole("listitem")).toHaveLength(12);
  expect(screen.getByText("Nueva A")).toBeTruthy();
  const fila = screen.getByText("Nueva B").closest("li");
  fireEvent.click(fila.querySelector("button"));
  await screen.findByText(/Esta tarea solo existe/);
  expect(screen.getByText("Nueva A")).toBeTruthy();
  expect(screen.getByText("Nueva B")).toBeTruthy();
  expect(peticiones.filter((p) => p.metodo === "PATCH")).toHaveLength(0);
});

test("04 - completa una tarea y envía completed a la API", async () => {
  const u = await iniciar();
  await u.click(
    screen.getByRole("button", { name: "Pendientes", exact: true }),
  );
  await u.click(
    screen.getAllByRole("button", { name: "Completar", exact: true })[0],
  );
  await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(5));
  expect(peticiones.at(-1)).toEqual({
    url: "https://jsonplaceholder.typicode.com/todos/1",
    metodo: "PATCH",
    body: { completed: true },
  });
  await u.click(screen.getByRole("button", { name: "Resumen", exact: true }));
  expect(contador("Completadas")).toBe("5");
});

test("05 - edición con Enter y blur; rechaza título vacío y permite Escape", async () => {
  const u = await iniciar();
  await u.dblClick(screen.getByText("Tarea 1", { exact: true }));
  let input = screen.getByRole("textbox", { name: "Editar título" });
  await u.clear(input);
  await u.keyboard("{Enter}");
  expect(screen.getByRole("alert").textContent).toContain("vacío");
  await u.type(input, "Título editado");
  await u.keyboard("{Enter}");
  await screen.findByText("Título editado", { exact: true });
  expect(peticiones.filter((p) => p.metodo === "PATCH")).toHaveLength(1);
  await u.dblClick(screen.getByText("Título editado", { exact: true }));
  input = screen.getByRole("textbox", { name: "Editar título" });
  await u.clear(input);
  await u.type(input, "Por foco");
  await u.tab();
  await screen.findByText("Por foco", { exact: true });
  await u.dblClick(screen.getByText("Por foco", { exact: true }));
  await u.type(
    screen.getByRole("textbox", { name: "Editar título" }),
    " cancelado",
  );
  await u.keyboard("{Escape}");
  expect(screen.getByText("Por foco", { exact: true })).toBeTruthy();
});

test("06 - cancelar conserva la tarea y confirmar ejecuta DELETE", async () => {
  const u = await iniciar();
  await u.click(
    screen.getAllByRole("button", { name: "Eliminar", exact: true })[0],
  );
  await u.click(screen.getByRole("button", { name: "Cancelar", exact: true }));
  expect(screen.getAllByRole("listitem")).toHaveLength(10);
  await u.click(
    screen.getAllByRole("button", { name: "Eliminar", exact: true })[0],
  );
  await u.click(screen.getByRole("button", { name: "Confirmar", exact: true }));
  await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(9));
  expect(peticiones.at(-1).metodo).toBe("DELETE");
});

test("07 - error remoto conserva tareas y permite reintentar", async () => {
  const u = await iniciar();
  fallo = "PATCH";
  await u.click(
    screen.getAllByRole("button", { name: "Completar", exact: true })[0],
  );
  await screen.findByRole("alert");
  expect(screen.getAllByRole("listitem")).toHaveLength(10);
  fallo = "";
  await u.click(
    screen.getAllByRole("button", { name: "Completar", exact: true })[0],
  );
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  expect(
    screen.getAllByRole("button", { name: "Desmarcar", exact: true }),
  ).toHaveLength(5);
});

test("08 - POST fallido conserva el texto y no anuncia éxito", async () => {
  const u = await iniciar();
  fallo = "POST";
  await u.click(
    screen.getByRole("button", { name: "Nueva tarea", exact: true }),
  );
  await u.type(
    screen.getByRole("textbox", { name: "Título de la nueva tarea" }),
    "No perder",
  );
  await u.click(screen.getByRole("button", { name: "Agregar", exact: true }));
  await screen.findByRole("alert");
  expect(
    screen.getByRole("textbox", { name: "Título de la nueva tarea" }).value,
  ).toBe("No perder");
  expect(screen.queryByText(/Tarea creada/)).toBeNull();
});

test("09 - carga fallida se puede reintentar", async () => {
  fallo = "GET";
  render(<App />);
  await screen.findByRole("alert");
  fallo = "";
  fireEvent.click(screen.getByRole("button", { name: "Reintentar carga" }));
  await screen.findByText("Total");
  expect(contador("Total")).toBe("10");
});

test("10 - bloquea operaciones y edición mientras espera la respuesta", async () => {
  const u = await iniciar();
  demora = 150;
  fireEvent.click(
    screen.getAllByRole("button", { name: "Completar", exact: true })[0],
  );
  expect(
    screen.getAllByRole("button", { name: "Eliminar", exact: true })[0]
      .disabled,
  ).toBe(true);
  fireEvent.doubleClick(screen.getByText("Tarea 2", { exact: true }));
  expect(screen.queryByRole("textbox", { name: "Editar título" })).toBeNull();
  await waitFor(() =>
    expect(
      screen.getAllByRole("button", { name: "Eliminar", exact: true })[0]
        .disabled,
    ).toBe(false),
  );
  await u.click(screen.getByRole("button", { name: "Resumen", exact: true }));
  expect(contador("Total")).toBe("10");
});

test("11 - operaciones sucesivas conservan cambios y actualizan los contadores", async () => {
  const u = await iniciar();
  await u.click(
    screen.getByRole("button", { name: "Nueva tarea", exact: true }),
  );
  const input = screen.getByRole("textbox", {
    name: "Título de la nueva tarea",
  });
  for (const titulo of ["Estudiar", "Repasar"]) {
    await u.type(input, titulo);
    await u.click(screen.getByRole("button", { name: "Agregar", exact: true }));
    await screen.findByText(/Tarea creada/);
  }
  await u.click(screen.getByRole("button", { name: "Tareas", exact: true }));
  fireEvent.click(
    screen
      .getByText("Tarea 1", { exact: true })
      .closest("li")
      .querySelector("button"),
  );
  await waitFor(() =>
    expect(screen.getByText("Tarea 1", { exact: true }).className).toContain(
      "task-completed",
    ),
  );
  fireEvent.click(
    screen
      .getByText("Tarea 2", { exact: true })
      .closest("li")
      .querySelectorAll("button")[1],
  );
  await u.click(screen.getByRole("button", { name: "Confirmar", exact: true }));
  await waitFor(() => expect(screen.getAllByRole("listitem")).toHaveLength(11));
  await u.click(screen.getByRole("button", { name: "Resumen", exact: true }));
  expect(contador("Total")).toBe("11");
  expect(contador("Pendientes")).toBe("6");
  expect(contador("Completadas")).toBe("5");
});

test("12 - error al eliminar mantiene el modal y la tarea", async () => {
  const u = await iniciar();
  fallo = "DELETE";
  await u.click(
    screen.getAllByRole("button", { name: "Eliminar", exact: true })[0],
  );
  await u.click(screen.getByRole("button", { name: "Confirmar", exact: true }));
  await screen.findByRole("alert");
  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(screen.getAllByRole("listitem")).toHaveLength(10);
  await u.click(screen.getByRole("button", { name: "Cancelar", exact: true }));
  expect(screen.queryByRole("dialog")).toBeNull();
});
