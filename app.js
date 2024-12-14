// Select DOM elements
const todoInput = document.querySelector(".todo-input"); // Input field for adding new tasks
const todoButton = document.querySelector(".todo-button"); // Button to add new tasks
const todoList = document.querySelector(".todo-list"); // UL element to display tasks
const filterOption = document.querySelector(".filter-todo"); // Dropdown for filtering tasks

// Create event listeners for each button.
todoButton.addEventListener("click", addTodo); // Step 2: Add new task when the button is clicked
document.addEventListener("DOMContentLoaded", renderTodos); // Step 5: Load tasks from localStorage when the page is loaded
todoList.addEventListener("click", deleteOrCompleteTodo); // Step 7: Delete or complete a task
filterOption.addEventListener("change", filterTodos); // Step 10: Filter tasks based on completion status

// Step 1: Function to add a new task
// event: is a signal that something has happened in the browser
function addTodo(event) {
  // console.log("Event Object:", event);
  // console.log("Event type:", event.type);
  // console.log("Target element:", event.target);

  // Prevent form submission
  event.preventDefault();

  // Remove the spaces in the front and back
  const cleanTodoInput = todoInput.value.trim();

  if (cleanTodoInput !== "") {
    // ****** DO NOT ADD THIS YET ******
    // Save the task to localStorage
    saveLocalTodos(cleanTodoInput);
    // *********************************

    // Create a new todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // Create a new list item for the task
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-item");
    newTodo.innerText = cleanTodoInput;
    todoDiv.appendChild(newTodo);

    // Create a button to mark the task as completed
    const completedButton = document.createElement("button");
    completedButton.classList.add("complete-btn");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    todoDiv.appendChild(completedButton);

    // Create a button to delete the task
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-btn");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    todoDiv.appendChild(trashButton);

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    todoDiv.appendChild(editButton);

    // Append the todo div to the todo list
    todoList.appendChild(todoDiv);
    todoInput.value = "";
  }
}

/*
    How to access the local storage
    1. Right click the browser
    2. Inpect Element
    3. Application Tab
    4. Storage
    5. Local Storage
*/

// Step 3: Function to save tasks to localStorage
// Middleware - a web server is middleware that connects websites to the backend database.
// Metaphor: You should buy the ingredients first before you start to cook the dish.

/*
    How to access the local storage
    1. Right click the browser
    2. Inspect Element
    3. Application Tab
    4. Storage
    5. Local Storage
*/

function getTodosFromLocalStorage() {
  let todosArray;
  if (localStorage.getItem("todos") === null) {
    todosArray = [];
  } else {
    todosArray = JSON.parse(localStorage.getItem("todos"));
  }
  return todosArray;
}

// console.log(getTodosFromLocalStorage());
// Check what it will return. Can be a array with objects or empty array

// The argument that is passed to the todo parameter is the actual textual data.
function saveLocalTodos(todo) {
  const todosArray = getTodosFromLocalStorage();
  const todoObject = { todo: todo, status: "Uncompleted" };
  todosArray.push(todoObject);
  localStorage.setItem("todos", JSON.stringify(todosArray));
}

/*
  // ****** Add this to the addTodo() ******

  // Save the task to localStorage
  saveLocalTodos(todoInput.value);
*/

// Step 4: Function to load tasks from localStorage when the page is loaded
function renderTodos() {
  const todosArray = getTodosFromLocalStorage();
  todosArray.forEach(function (todoObject) {
    // Create todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // Create list item for the task
    const newTodo = document.createElement("li");
    newTodo.classList.add("todo-item");
    newTodo.innerText = todoObject.todo;
    todoDiv.appendChild(newTodo);

    // Create a button to mark the task as completed
    const completedButton = document.createElement("button");
    completedButton.classList.add("complete-btn");
    completedButton.innerHTML = `<i class="fas fa-check"></i>`;
    todoDiv.appendChild(completedButton);

    // Create a button to delete the task
    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-btn");
    trashButton.innerHTML = `<i class="fas fa-trash"></i>`;
    todoDiv.appendChild(trashButton);

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    todoDiv.appendChild(editButton);

    if (todoObject.status != "Uncompleted") {
      todoDiv.classList.add("completed");
    }

    // Append todo div to the todo list
    todoList.appendChild(todoDiv);
  });
}

/*  
    // ****** Add this to the Event Listener Section ******
    
    document.addEventListener("DOMContentLoaded", renderTodos); 
    // Step 5: Load and render tasks from localStorage when the page is loaded
*/

// Step 6: Function to delete or complete task
function deleteOrCompleteTodo(event) {
  const target = event.target;

  if (target.classList.contains("trash-btn")) {
    const todoDiv = target.parentElement;
    todoDiv.classList.add("fall");
    const task = todoDiv.innerText;

    // ****** DO NOT ADD THIS YET ******
    // Delete the task from localStorage
    removeLocalTodos(task);
    // *********************************

    todoDiv.addEventListener("transitionend", function () {
      todoDiv.remove();
    });
  }

  if (target.classList.contains("complete-btn")) {
    const todoDiv = target.parentElement;
    if (todoDiv.classList.contains("completed")) {
      const task = todoDiv.innerText;
      updateLocalTodoStatus(task, "Uncompleted");
      todoDiv.classList.remove("completed");
    } else {
      const task = todoDiv.innerText;
      updateLocalTodoStatus(task, "Completed");
      todoDiv.classList.add("completed");
    }
  }

  // Inside the deleteOrCompleteTodo function:
  if (target.classList.contains("edit-btn")) {
    // New condition for edit button
    const todoDiv = target.parentElement;
    const todoText = todoDiv.innerText;

    // Create an input field for editing
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = todoText; // Pre-fill with current text
    editInput.classList.add("edit-input");

    // Replace the todo item with the input field
    todoDiv.querySelector(".todo-item").replaceWith(editInput);

    // Add a save button to confirm edit
    const saveButton = document.createElement("button");
    saveButton.innerHTML = `<i class="fas fa-check"></i>`;
    saveButton.classList.add("save-btn");
    todoDiv.appendChild(saveButton);

    // Function to handle editing and save
    const saveTask = () => {
      const newTodoText = editInput.value.trim();
      if (newTodoText !== "") {
        updateTodo(todoText, newTodoText);

        const listItem = document.createElement("li");
        listItem.classList.add("todo-item");
        listItem.innerText = newTodoText;

        // Update the displayed text
        todoDiv.querySelector(".edit-input").replaceWith(listItem);

        saveButton.remove();
      }
    };

    // Event listener for save button
    saveButton.addEventListener("click", saveTask);
  }
}

// Step 8: Function to remove the task from the localStorage
// The argument that will be passed to the todo parameter is the todoDiv container.
function removeLocalTodos(todo) {
  const todosArray = getTodosFromLocalStorage();
  const todoObjectIndex = todosArray.findIndex((todoObject) => {
    return todoObject.todo === todo;
  });

  todosArray.splice(todoObjectIndex, 1);
  localStorage.setItem("todos", JSON.stringify(todosArray));
}

function updateTodo(todo, newtodo) {
  const todosArray = getTodosFromLocalStorage();
  const todoObject = todosArray.find((todoObject) => {
    return todoObject.todo === todo;
  });
  todoObject.todo = newtodo;
  localStorage.setItem("todos", JSON.stringify(todosArray));
}

function updateLocalTodoStatus(todo, newStatus) {
  const todosArray = getTodosFromLocalStorage();
  const todoObject = todosArray.find((todoObject) => {
    return todoObject.todo === todo;
  });
  todoObject.status = newStatus;
  localStorage.setItem("todos", JSON.stringify(todosArray));
}

/*  
    // ****** Add this to the deleteOrCompleteTodo() ******

    // Remove task from localStorage
    removeLocalTodos(todo);
*/

// Step 9: Function to filter task based on completion status
function filterTodos(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    const filterValue = e.target.value;
    switch (filterValue) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
    }
  });
}
