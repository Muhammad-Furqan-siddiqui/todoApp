import React, { useState, useEffect } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  const API_URL = "http://localhost:5000/api/todos"; // Backend API URL

  // Fetch all todos from the backend
  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos(); // Fetch todos when component mounts
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newTodo }),
        });
        const newTodoItem = await response.json();
        setTodos([...todos, newTodoItem]);
        setNewTodo("");
      } catch (err) {
        console.error("Error adding todo:", err);
      }
    }
  };

  // Edit an existing todo
  const editTodo = async () => {
    if (newTodo.trim() !== "" && currentTodo) {
      try {
        const response = await fetch(`${API_URL}/${currentTodo._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newTodo }),
        });
        const updatedTodo = await response.json();
        setTodos(
          todos.map((todo) =>
            todo._id === currentTodo._id ? updatedTodo : todo
          )
        );
        setNewTodo("");
        setIsEditing(false);
        setCurrentTodo(null);
      } catch (err) {
        console.error("Error updating todo:", err);
      }
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Toggle completion status
  const toggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });
      const updatedTodo = await response.json();
      setTodos(
        todos.map((todo) =>
          todo._id === id ? updatedTodo : todo
        )
      );
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">TODO App</h1>
        <div className="flex mb-4">
          <input
            type="text"
            className="border border-gray-300 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={isEditing ? "Edit your task..." : "Add a new task..."}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button
            onClick={isEditing ? editTodo : addTodo}
            className={`${
              isEditing ? "bg-green-500" : "bg-blue-500"
            } text-white px-4 py-2 rounded-r-lg hover:${
              isEditing ? "bg-green-600" : "bg-blue-600"
            }`}
          >
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className={`flex justify-between items-center p-2 rounded ${
                todo.completed ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <span
                onClick={() => toggleComplete(todo._id, todo.completed)}
                className={`cursor-pointer ${
                  todo.completed ? "line-through text-gray-500" : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setNewTodo(todo.text);
                    setCurrentTodo(todo);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
