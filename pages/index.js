import React, { useCallback, useEffect, useState } from "react";
import TodoForm from "../components/TodoForm";
import TodoItem from "../components/TodoItem";

export default function Home() {
  const [todoItem, setTodoItem] = useState("");
  const [todo, setTodoList] = useState([]);
  const [firstRender, setFirstRender] = useState(true);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]);

  const setTodosInLocalStorage = (todos) => {
    if (window !== undefined) {
      if (todos !== null) {
        //console.log("Setting todo");
        localStorage.setItem("todos", JSON.stringify(todos));
        //console.log(JSON.parse(localStorage.getItem("todos")));
      } else {
        localStorage.setItem("todos", JSON.stringify([]));
      }
    }
  };

  const getInitialTodos = () => {
    if (typeof window !== undefined && typeof localStorage !== undefined) {
      const initialTodos = JSON.parse(localStorage.getItem("todos"));
      console.log(initialTodos);
      if (initialTodos) {
        return initialTodos;
      }
      return [];
    }
  };

  const filterTodos = () => {
    switch (currentFilter) {
      case "all":
        return todo;
        break;

      case "completed":
        return todo.filter((el) => el.completed === true);
        break;

      case "incomplete":
        return todo.filter((el) => el.completed === false);
        break;
    }
  };

  const submitNewTodo = () => {
    setTodoItem("");
    setTodoList((prevState) => [
      ...prevState,
      {
        name: todoItem,
        completed: false,
        date: new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      },
    ]);
  };

  const handleIsCompleted = (id) => {
    setTodoList((prevState) =>
      prevState.map((el) => {
        if (el.id === id) {
          return { ...el, completed: true };
        } else {
          return el;
        }
      })
    );
  };

  const deleteTodo = (id) => {
    setTodoList((prevState) => prevState.filter((el) => el.id !== id));
  };

  const handleFilterChange = () => {
    const result = filterTodos();
    setFilteredTodos(result);
  };

  useEffect(() => {
    if (firstRender) {
      console.log("check first render");
      setTodoList(getInitialTodos());
      setFirstRender((prevState) => !prevState);
    } else {
      handleFilterChange();
      setTodosInLocalStorage(todo);
    }
  }, [todo, currentFilter]);

  return (
    <div className="p-6 relative bg-gradient-to-r from-cyan-500 to-blue-500 h-screen w-screen flex justify-center place-items-start">
      <div className="p-10">
        <h1 className="text-6xl text-white font-mono">Next Todo List</h1>
        <div className="mt-20">
          <TodoForm
            todoItem={todoItem}
            setTodoItem={setTodoItem}
            setCurrentFilter={setCurrentFilter}
            submitNewTodo={submitNewTodo}
          />
        </div>
        {filteredTodos.length > 0 && (
          <div className=" rounded p-4 bg-white-gradient flex flex-col place-items-start mt-20 justify-center h-full">
            {filteredTodos.map((el, i) => (
              <TodoItem
                handleIsCompleted={handleIsCompleted}
                deleteTodo={deleteTodo}
                item={el}
                key={i}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
