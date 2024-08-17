"use client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { BASE_API_URL } from "@/app/util/db";

export default function Home() {
  const [taskname, setTaskName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(null);
  console.log(BASE_API_URL, "-------------------------------------")

  // Fetch tasks from server on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(BASE_API_URL+"/api/tasklists");
        const data = await response.json();
        if (data.success) {
          setTasks(
            data.result.map((task) => ({ _id: task._id, task: task.taskname }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const addOrUpdateTask = async () => {
    if (taskname.trim() === "") return; // Avoid adding empty tasks

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${BASE_API_URL}/api/tasklists/${tasks[currentTaskIndex]._id}`
      : `${BASE_API_URL}/api/tasklists`;

    const body = JSON.stringify({ taskname });

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      const data = await response.json();
      if (data.success) {
        alert(isEditing ? "Task Updated." : "New Task Added.");

        if (isEditing) {
          const updatedTasks = tasks.map((t, index) =>
            index === currentTaskIndex ? { ...t, task: taskname } : t
          );
          setTasks(updatedTasks);
          setIsEditing(false);
          setCurrentTaskIndex(null);
        } else {
          setTasks([...tasks, { task: taskname, _id: data.result._id }]);
        }

        setTaskName(""); // Clear the input field
      }
    } catch (error) {
      console.error("Failed to add/update task:", error);
    }
  };

  const editTask = (index) => {
    setTaskName(tasks[index].task);
    setIsEditing(true);
    setCurrentTaskIndex(index);
  };

  const removeTask = async (index) => {
    const taskId = tasks[index]._id;

    try {
      const response = await fetch(`${BASE_API_URL}/api/tasklists/${taskId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setTasks(tasks.filter((_, i) => i !== index));
        alert("Task Deleted.");
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center">
        <div className=" p-8 rounded shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

          <div className="flex w-full flex-wrap md:flex-nowrap gap-4 mb-4">
            <Input
              type="text"
              size="sm"
              label="Enter Your Task"
              value={taskname}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <Button onClick={addOrUpdateTask} className="ml-2 p-6">
              {isEditing ? "Update" : "Add"}
            </Button>
          </div>

          <ul className="list-disc list-inside">
            {tasks.map((task, index) => (
              <li
                key={task._id}
                className="flex justify-between items-center mb-2"
              >
                <span>{task.task}</span>
                <div className="flex">
                  <Button
                    onClick={() => editTask(index)}
                    className="mr-4"
                    color="primary"
                  >
                    Edit
                  </Button>
                  <Button onClick={() => removeTask(index)} color="danger">
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
