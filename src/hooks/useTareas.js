import { useEffect, useRef, useState } from "react";
import {
  getTareas,
  postTarea,
  patchTarea,
  deleteTarea,
} from "../services/tareasService";

export default function useTareas() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [errorCarga, setErrorCarga] = useState("");
  const [intento, setIntento] = useState(0);
  const ocupado = useRef(false);

  useEffect(() => {
    let activo = true;
    getTareas(10)
      .then((datos) => {
        if (activo)
          setTareas(
            datos.map((t) => ({
              id: `remota-${t.id}`,
              idRemoto: t.id,
              titulo: t.title,
              completada: t.completed,
            })),
          );
      })
      .catch((err) => {
        if (activo) setErrorCarga(err.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [intento]);

  const reintentar = () => {
    setErrorCarga("");
    setCargando(true);
    setIntento((prev) => prev + 1);
  };

  const ejecutar = async (operacion) => {
    if (ocupado.current) return false;
    ocupado.current = true;
    setGuardando(true);
    setError("");
    try {
      await operacion();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      ocupado.current = false;
      setGuardando(false);
    }
  };

  const buscarRemota = (id) => {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) throw new Error("No se encontró la tarea.");
    if (tarea.idRemoto === null) {
      throw new Error(
        "Esta tarea solo existe en esta sesión. JSONPlaceholder no la guardó: no se puede modificar ni eliminar remotamente. La tarea se conserva.",
      );
    }
    return tarea;
  };

  const crearTarea = (titulo) =>
    ejecutar(async () => {
      if (!titulo.trim()) throw new Error("Escribe un título.");
      const nueva = await postTarea(titulo.trim());
      // El POST simulado no crea un recurso remoto persistente.
      setTareas((prev) => [
        {
          id: crypto.randomUUID(),
          idRemoto: null,
          titulo: nueva.title,
          completada: nueva.completed,
        },
        ...prev,
      ]);
    });

  const actualizarTarea = (id, cambios) =>
    ejecutar(async () => {
      const tarea = buscarRemota(id);
      await patchTarea(tarea.idRemoto, { completed: cambios.completada });
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...cambios } : t)),
      );
    });

  const editarTitulo = (id, titulo) =>
    ejecutar(async () => {
      if (!titulo.trim()) throw new Error("El título no puede estar vacío.");
      const tarea = buscarRemota(id);
      await patchTarea(tarea.idRemoto, { title: titulo.trim() });
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, titulo: titulo.trim() } : t)),
      );
    });

  const eliminarTarea = (id) =>
    ejecutar(async () => {
      const tarea = buscarRemota(id);
      await deleteTarea(tarea.idRemoto);
      setTareas((prev) => prev.filter((t) => t.id !== id));
    });

  return {
    tareas,
    cargando,
    guardando,
    error,
    errorCarga,
    reintentar,
    limpiarError: () => setError(""),
    crearTarea,
    actualizarTarea,
    editarTitulo,
    eliminarTarea,
  };
}
