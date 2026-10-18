import TaskForm from "../components/TaskForm";

const NewTaskView = ({ onAgregar, guardando }) => {
  return <TaskForm onAgregar={onAgregar} guardando={guardando} />;
};

export default NewTaskView;