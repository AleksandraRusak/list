"use client";

import { Todo } from "@/utils/types/todo";
import { useEffect, useState } from "react";

export default function Home({}) {
  useEffect(() => {
    fetch("http://localhost:3000/api/todo")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setIsLoading(false);
      });
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  const addTodo = async () => {
    if (!newTodoText) return;

    const response = await fetch("http://localhost:3000/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTodoText }),
    });

    const data = await response.json();
    console.log("data", data);
    setTodos([...todos, data]);
    setNewTodoText("");
  };

  const handleEdit = (todo: Todo) => {
    setEditTodo(todo);
  };

  const handleSave = async () => {
    if (!editTodo) return;

    const response = await fetch("http://localhost:3000/api/todo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editTodo._id,
        text: editTodo.text,
        completed: editTodo.completed,
      }),
    });

    if (response.status === 200) {
      setTodos(
        todos.map((todo: Todo) =>
          todo._id === editTodo._id ? { ...todo, text: editTodo.text } : todo
        )
      );
      setEditTodo(null);
    }
  };

  const deleteTodo = async (id: string) => {
    const response = await fetch(`http://localhost:3000/api/todo`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      setTodos(todos.filter((todo: Todo) => todo._id !== id));
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const response = await fetch(`http://localhost:3000/api/todo`, {
      method: "PUT",
      body: JSON.stringify({ id, completed: !completed }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      setTodos(
        todos.map((todo: Todo) =>
          todo._id === id ? { ...todo, completed: !completed } : todo
        )
      );
    }
  };

  return (
    <div className="font-mulish grid lg:place-items-center w-full bg-blue-100 text-purple-500 min-h-screen">
      <div className="flex lg:flex-row flex-col gap-5 lg:justify-start justify-center lg:items-start items-center w-full mx-auto">
        <div className="sm:w-9/12 lg:w-6/12 w-full px-4 lg:my-10 flex flex-col justify-center items-center">
          <h1 className="lg:text-5xl text-3xl py-8 lg:pt-14 uppercase font-medium text-purple-600">
            My Notes
          </h1>
          <h1 className="text-4xl py-8 lg:py-0 lg:pt-4 lg:pb-14 text-yellow-500">
            Get things done
          </h1>

          {editTodo ? (
            <>
              <input
                className="w-full lg:w-8/12 bg-blue-300 py-4 text-xl rounded-lg text-blue-800 outline-none px-3"
                type="text"
                value={editTodo.text!}
                onChange={(e) =>
                  setEditTodo({ ...editTodo, text: e.target.value })
                }
              />
              <button
                onClick={handleSave}
                className="bg-blue-700 px-6 py-2 rounded-lg my-7 text-yellow-200 text-lg uppercase font-semibold"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <input
                className="w-full lg:w-8/12 bg-blue-300 py-4 text-xl rounded-lg text-purple-600 outline-none px-3"
                type="text"
                placeholder="type here"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
              />
              <button
                onClick={addTodo}
                className="bg-blue-700 px-6 py-2 rounded-lg my-7 text-yellow-200 text-lg uppercase font-semibold"
              >
                Add Todo
              </button>
            </>
          )}
        </div>
        <ul className="sm:w-9/12 lg:w-5/12 w-full px-4 flex flex-col justify-center items-center my-6 py-6">
          {isLoading && (
            <p className="text-purple-600 text-2xl italic my-10">Loading...</p>
          )}
          {!isLoading && todos && todos.length == 0 ? (
            <div className="text-purple-600 text-2xl italic my-10">
              (No todos found)
            </div>
          ) : (
            <>
              {!isLoading &&
                todos &&
                todos.map((todo: Todo) => (
                  <li
                    key={todo._id}
                    className="bg-blue-300 px-6 py-5 rounded-lg my-3 hover:scale-105 text-lg w-full flex justify-between items-start transition-transform duration-200"
                  >
                    <div className="flex justify-start items-start w-8/12">
                      <input
                        type="checkbox"
                        className="w-5 h-5 cursor-pointer mt-1 mr-3"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo._id, todo.completed)}
                      />
                      <span
                        className={`${
                          todo.completed ? "line-through" : ""
                        } px-4 w-full text-blue-700`}
                      >
                        {todo.text}
                      </span>
                    </div>
                    <div className="w-4/12 md:w-4/12">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="text-blue-700 uppercase md:text-base text-sm font-semibold px-3 hover:text-sky-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="text-red-500 uppercase md:text-base text-sm font-semibold px-3 hover:text-purple-500"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
