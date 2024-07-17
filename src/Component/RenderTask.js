import React, { useContext } from "react";
import Task from "./Task";
import tasksContext from "../Context/Task";
import themeContext from "../Context/Theme";

const RenderTasks = () => {
  const { tasks } = useContext(tasksContext);
  const { theme } = useContext(themeContext);

  return (
    <div className="tasks container-fluid">
      {tasks.length > 0 ? (
        <>
          <hr />
          <div className="row gap-4">
            <div className="alert alert-success col">
              <b> Tasks waiting for you!</b>
              <p>You have {tasks.length} tasks to do.</p>
            </div>
          </div>
          <hr />

          <h1 className="text-center">
            <i className="bi bi-list-task mx-2"></i>ALL TASKS
          </h1>
          <hr />

          <div className="allTasks">
            {tasks.map((task, index) => (
              <Task key={index} task={task} index={index} />
            ))}
          </div>
        </>
      ) : (
        <div className="alert alert-danger">
          <b>No tasks!</b>
          <p>You have no tasks to do. That's great!</p>
        </div>
      )}
    </div>
  );
};

export default RenderTasks;
