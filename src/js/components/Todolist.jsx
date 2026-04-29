import { use, useEffect } from "react";
import { useState } from "react";

const Todolist = () => {
  const [tasks, setTasks] = useState([]);
  async function getTask() {
    try {
      console.log("1. Iniciando fetch...");
      let result = await fetch(
        "https://playground.4geeks.com/todo/users/Chipitico",
      );

      console.log("2. Status del response:", result.status, result.ok);

      let data = await result.json();
      console.log("3. Data completa:", data);
      console.log("4. Todos (data.todos):", data.todos);

      const mapped = data.todos.map((todo) => ({
        id: todo.id,
        text: todo.label,
        done: todo.is_done,
      }));

      console.log("5. Tasks mapeadas:", mapped);
      setTasks(mapped); // ← era setList, que no existe
    } catch (error) {
      console.error("Error en el fetch:", error);
    }
  }

  useEffect(() => {
    getTask();
  }, []);

  const [input, setInput] = useState("");

  const addTask = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    
    const newTodo = await postTask(trimmed);
    if (newTodo) {
        setTasks([...tasks, {
            id: newTodo.id,
            text: newTodo.label,
            done: newTodo.is_done
        }]);
    }
    setInput("");
};

  const toggleTask = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = async (id) => {
    await removeTask(id);
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  async function postTask(taskLabel) {
    try {
        let result = await fetch("https://playground.4geeks.com/todo/todos/Chipitico", {
            method: "POST",
            body: JSON.stringify({
                label: taskLabel,
                is_done: false
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log("POST status:", result.status);
        let data = await result.json();
        console.log("POST response:", data);
        return data;

    } catch (error) {
        console.error("Error en POST:", error);
    }
}

    async function removeTask(id) {
        try{
            let result = await fetch (`https://playground.4geeks.com/todo/todos/${id}`, {
                method: "DELETE"
            });
            console.log("DELETE status:", result.status);
        } catch (error){
            console.log("Error en DELETE:", error);
        }
    }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h1 className="fw-bold text-dark mb-1 text-center">
        Chipitico's Todolist
      </h1>
      <p className="text-secondary mb-4 text-center">
        Gestiona tus que haceres aquí abajo.
      </p>

      <div className="d-flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New task..."
          className="form-control"
        />
        <button onClick={addTask} className="btn btn-primary">
          Add
        </button>
      </div>

      <ul className="list-group">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="list-group-item d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center gap-2">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="form-check-input"
              />
              <span
                className={
                  task.done
                    ? "text-decoration-line-through text-secondary"
                    : "text-dark"
                }
              >
                {task.text}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="btn btn-outline-danger btn-sm"
            >
              Delete
            </button>
          </li>
        ))}
        {tasks.length === 0 && (
          <p className="text-secondary text-center py-3">No tasks yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Todolist;
