import { useState, useEffect } from "react";
import {
  getTareas,
  postTarea,
  putTarea,
  patchTarea,
  deleteTarea,
} from "../services/tareasService";

const useTareas = () => {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await getTareas(10);
        setTareas(
          datos.map((t) => ({
            id: t.id,
            titulo: t.title,
            completada: t.completed,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const crearTarea = async (titulo) => {
    setGuardando(true);
    try {
      const nueva = await postTarea(titulo);
      setTareas((prev) => [
        { id: Date.now(), titulo: nueva.title, completada: nueva.completed },
        ...prev,
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const actualizarTarea = async (id, cambios) => {
    setGuardando(true);
    try {
      await putTarea(id, cambios);
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...cambios } : t))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const editarTitulo = async (id, nuevoTitulo) => {
    setGuardando(true);
    try {
      await patchTarea(id, { title: nuevoTitulo });
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, titulo: nuevoTitulo } : t))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminarTarea = async (id) => {
    setGuardando(true);
    try {
      await deleteTarea(id);
      setTareas((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return {
    tareas,
    cargando,
    guardando,
    error,
    crearTarea,
    actualizarTarea,
    editarTitulo,
    eliminarTarea,
  };
};

export default useTareas;