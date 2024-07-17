import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import tasksContext from "./Context/Task";
import themeContext from "./Context/Theme";
import RenderTasks from "./Component/RenderTask";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [input, setInput] = useState("");
  const [taskToAdd, setTaskToAdd] = useState("");
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [loginToken, setToken] = useState(() => {
    return localStorage.getItem('token') ? true : false;
  });

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:3002/task/');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const theme = 'light';

  function handleClickAndEnter() {
    if (taskToAdd && taskToAdd.taskTitle.replace(/\s/g, "").length > 0) {
      axios.post('http://localhost:3002/task', taskToAdd)
        .then(() => getData())
        .catch(error => console.log(error));

      setTaskToAdd("");
      setInput("");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a valid task!",
      });
    }
  }

  window.addEventListener("scroll", () => {
    setIsScrolled(window.scrollY > 10);
  });

  return (
    <>
      {!loginToken && (
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      )}

      {loginToken && (
        <themeContext.Provider value={{ theme }}>
          <div className={`min-100 container-fluid py-3 ${theme === 'light' ? '' : 'bg-dark text-light'}`}>
            <header>
              <div className="d-flex justify-content-around align-items-center">
                <Link to="/" className="text-decoration-none">
                  <h1 className="text-center">
                    <i className="bi bi-kanban mx-2"></i>Todo List
                  </h1>
                </Link>
                <button className="btn btn-warning" onClick={() => {
                  localStorage.clear();
                  navigate('/');
                  navigate(0);
                }}>Logout</button>
              </div>
            </header>
            <hr />
            <div className="AddTask">
              <div className="input-group mb-3">
                <input
                  onChange={(e) => {
                    setInput(e.target.value);
                    setTaskToAdd({
                      taskId: new Date().getTime(),
                      taskTitle: e.target.value.trim(),
                      taskTime: new Date().toLocaleString(),
                      taskCompleted: false,
                    });
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleClickAndEnter()}
                  type="text"
                  className="form-control"
                  value={input}
                  placeholder="Add a task..."
                  aria-label="Task"
                  aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-success"
                    onClick={handleClickAndEnter}
                    type="button"
                  >
                    <i className="bi bi-plus-lg"></i> Add Task
                  </button>
                </div>
              </div>
            </div>
            <tasksContext.Provider value={{ tasks, setTasks }}>
              <RenderTasks />
            </tasksContext.Provider>
          </div>
        </themeContext.Provider>
      )}
    </>
  );
}

export default App;
