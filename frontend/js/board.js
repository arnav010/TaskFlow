const API_URL = "http://localhost:5000";

const taskForm = document.getElementById("taskForm");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskStatusInput = document.getElementById("taskStatus");
const taskMessage = document.getElementById("taskMessage");

const todoTasks = document.getElementById("todoTasks");
const progressTasks = document.getElementById("progressTasks");
const doneTasks = document.getElementById("doneTasks");

document.addEventListener("DOMContentLoaded", getTasks);

taskForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const status = taskStatusInput.value;

  if (title === "") {
    taskMessage.textContent = "Please enter a task title.";
    return;
  }

  try {
    await createTask(title, description, status);
    taskForm.reset();
    taskMessage.textContent = "Task added successfully.";
    getTasks();
  } catch (error) {
    taskMessage.textContent = "Could not add task.";
  }
});

async function getTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`);
    const tasks = await response.json();

    todoTasks.innerHTML = "";
    progressTasks.innerHTML = "";
    doneTasks.innerHTML = "";

    tasks.forEach(function (task) {
      const taskCard = createTaskCard(task);

      if (task.status === "To Do") {
        todoTasks.appendChild(taskCard);
      } else if (task.status === "In Progress") {
        progressTasks.appendChild(taskCard);
      } else {
        doneTasks.appendChild(taskCard);
      }
    });
  } catch (error) {
    taskMessage.textContent = "Could not load tasks.";
  }
}

function createTaskCard(task) {
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";

  const title = document.createElement("h3");
  title.textContent = task.title;

  const description = document.createElement("p");
  description.textContent = task.description || "No description added.";

  const actions = document.createElement("div");
  actions.className = "task-actions";

  if (task.status !== "To Do") {
    const todoButton = document.createElement("button");
    todoButton.className = "button secondary-button";
    todoButton.textContent = "To Do";
    todoButton.addEventListener("click", function () {
      moveTask(task, "To Do");
    });
    actions.appendChild(todoButton);
  }

  if (task.status !== "In Progress") {
    const progressButton = document.createElement("button");
    progressButton.className = "button secondary-button";
    progressButton.textContent = "In Progress";
    progressButton.addEventListener("click", function () {
      moveTask(task, "In Progress");
    });
    actions.appendChild(progressButton);
  }

  if (task.status !== "Done") {
    const doneButton = document.createElement("button");
    doneButton.className = "button secondary-button";
    doneButton.textContent = "Done";
    doneButton.addEventListener("click", function () {
      moveTask(task, "Done");
    });
    actions.appendChild(doneButton);
  }

  const deleteButton = document.createElement("button");
  deleteButton.className = "button danger-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", function () {
    deleteTask(task._id);
  });

  actions.appendChild(deleteButton);

  taskCard.appendChild(title);
  taskCard.appendChild(description);
  taskCard.appendChild(actions);

  return taskCard;
}

async function createTask(title, description, status) {
  await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      description: description,
      status: status
    })
  });
}

async function deleteTask(taskId) {
  try {
    await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE"
    });

    taskMessage.textContent = "Task deleted.";
    getTasks();
  } catch (error) {
    taskMessage.textContent = "Could not delete task.";
  }
}

async function moveTask(task, newStatus) {
  try {
    // The project only uses GET, POST, and DELETE routes.
    // So moving a task creates a new task with the new status, then deletes the old one.
    await createTask(task.title, task.description, newStatus);
    await fetch(`${API_URL}/tasks/${task._id}`, {
      method: "DELETE"
    });

    taskMessage.textContent = "Task moved.";
    getTasks();
  } catch (error) {
    taskMessage.textContent = "Could not move task.";
  }
}
