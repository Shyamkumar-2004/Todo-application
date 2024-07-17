import React, { useContext, useState } from "react";
import tasksContext from "../Context/Task";
import themeContext from "../Context/Theme";
import Swal from "sweetalert2";
import axios from "axios";
import "./Task.css"; 

const Task = ({ task }) => {
  const [taskTitle, setTaskTitle] = useState(task.taskTitle);
  const { theme } = useContext(themeContext);
  const { tasks, setTasks } = useContext(tasksContext);
  const [showDiff, setShowDiff] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    task.taskCompleted = e.target.checked;
    axios.put(`http://localhost:3002/task/${task.id}`, task).then((res) => {});

    setTasks([...tasks]);
  };

  const editTask = (taskId, task) => {
    if (taskTitle.replace(/\s/g, "").length > 0) {
      task.taskTitle = taskTitle;
      axios.put(`http://localhost:3002/task/${taskId}`, task).then((res) => {});

      setTasks(
        tasks.map((t) => {
          if (t.id === taskId) t.taskTitle = taskTitle;
          return t;
        })
      );
      setEditMode(false);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Task content can't be empty!",
      });
    }
  };

  return (
    <div className={`card task visible my-3 ${task.taskCompleted ? "completed" : theme}`}>
      <div className="card-header">
        <input type="checkbox" onChange={(e) => handleChange(e)} checked={task.taskCompleted} />
        {task.taskCompleted ? "Completed!" : "Pending..."}
        {"Click the checkbox to mark this task as " + (task.taskCompleted ? "pending" : "completed")}
      </div>
      <div className="card-body">
        {!editMode ? (
          <h5 className="card-title">{task.taskTitle}</h5>
        ) : (
          <div className="input-group mb-3">
            <input
              type="text"
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") editTask(task.id, task);
              }}
              value={taskTitle}
              className="form-control"
              placeholder="Edit task"
            />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary outline-dark" onClick={() => editTask(task.id, task)} type="button">
                <i className="bi bi-pencil"></i> Edit task
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="card-footer d-flex justify-content-between">
        <div className="icons d-flex gap-1">
          <i
            onClick={() =>
              Swal.fire({
                title: "Are you sure you want to delete this task?",
                showDenyButton: true,
                confirmButtonText: `Delete`,
                denyButtonText: `Cancel`,
              }).then((result) => {
                if (result.isConfirmed) {
                  setTasks(tasks.filter((t) => t !== task));
                  axios.delete(`http://localhost:3002/task/${task.id}`).then((res) => {});
                }
              })
            }
            title="Delete task"
            className="bi bi-trash"
          ></i>
          <i title="Edit task" onClick={() => setEditMode(!editMode)} className="bi bi-pencil"></i>
        </div>
        <div className={"taskTime align-self-end"} title={"This task was created " + (showDiff ? "Just now" : task.taskTime)}>
          {showDiff ? "Just now" : task.taskTime}
          <i onClick={() => setShowDiff(!showDiff)} title={"Click to see " + (showDiff ? "creation time" : "task age")} className="bi bi-clock-history mx-2"></i>
        </div>
      </div>
    </div>
  );
};

export default Task;
