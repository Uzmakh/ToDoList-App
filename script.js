const inputBox = document.getElementById("inputBox");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

let editTodo = null;

// Function to add todo
const addTodo = () => {
  const inputText = inputBox.value.trim();
  if (inputText.length === 0) {
    alert("You must write something in your to do");
    return false; //it returns false from here, Now no need to write it in else {}
  }

  // using editTodo in addTodo-func(keeping it as global)
  if (addBtn.value === "Edit") {
    // Passing the original text to editLocalTodos function before edit it in the todoList
    editLocalTodos(editTodo.target.previousElementSibling.innerHTML);
    editTodo.target.previousElementSibling.innerHTML = inputText;
    addBtn.value = "Add";
    inputBox.value = "";
  } else {
    //Creating p tag
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.innerHTML = inputText;
    li.appendChild(p);
    inputBox.value = "";

    // Creating Edit Btn
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("btn", "editBtn");
    li.appendChild(editBtn);

    // Creating Delete Btn
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Remove";
    deleteBtn.classList.add("btn", "deleteBtn");
    li.appendChild(deleteBtn);

    // Creating Complete Btn
    const completeBtn = document.createElement("button");
    completeBtn.innerText = "Complete";
    completeBtn.classList.add("btn", "completeBtn");
    li.appendChild(completeBtn);

    // Create Shuffle button
    const shuffleBtn = document.createElement("button");
    shuffleBtn.innerText = "Shuffle";
    shuffleBtn.classList.add("btn", "shuffleBtn");
    li.appendChild(shuffleBtn);

    // Create Move Up button
    const moveUpBtn = document.createElement("button");
    moveUpBtn.innerText = "↑";
    moveUpBtn.classList.add("btn", "moveUpBtn");
    li.appendChild(moveUpBtn);

    // Create Move Down button
    const moveDownBtn = document.createElement("button");
    moveDownBtn.innerText = "↓";
    moveDownBtn.classList.add("btn", "moveDownBtn");
    li.appendChild(moveDownBtn);

    todoList.appendChild(li);
    inputBox.value = "";

    // Event listener for move buttons
    todoList.addEventListener("click", (event) => {
      if (
        event.target.classList.contains("moveUpBtn") ||
        event.target.classList.contains("moveDownBtn")
      ) {
        moveTask(event); // Pass the event object to moveTask
      } else if (event.target.classList.contains("shuffleBtn")) {
        shuffleTasks(); // Shuffle tasks without needing the event object
      }
    });

    // shuffling tasks
    function shuffleTasks() {
      const todoItems = Array.from(todoList.children);
      todoItems.sort(() => Math.random() - 0.5);
      todoList.innerHTML = "";
      todoItems.forEach((item) => todoList.appendChild(item));
    }
    saveLocalTodos(inputText);
  }
};

// Function to update : (Edit/Delete) todo
const updateTodo = (e) => {
  console.log(e.target.innerHTML);
  if (e.target.innerHTML === "Remove") {
    // Declare the confirmation variable
    let confirmation;
    // Assign the result of confirm to the confirmation variable
    confirmation = confirm("Are you sure you want to remove this task?");

    if (confirmation) {
      todoList.removeChild(e.target.parentElement);
      deleteLocalTodos(e.target.parentElement);
    }
  }

  if (e.target.innerHTML === "Edit") {
    inputBox.value = e.target.previousElementSibling.innerHTML;
    inputBox.focus();
    addBtn.value = "Edit";
    editTodo = e;
  } else if (e.target.innerHTML === "Complete") {
    e.target.parentElement.classList.toggle("completed"); // Toggle completed class for visual effect
  }
};
// Move up and down
function moveTask(e) {
  const clickedElement = e.target; // Define clickedElement

  // Check if the clicked element has a parent
  if (clickedElement.parentElement) {
    const taskItem = clickedElement.parentElement;
    const taskIndex = Array.from(todoList.children).indexOf(taskItem);
    let direction = ""; // Initialize direction

    // Set direction based on the clicked button
    if (clickedElement.classList.contains("moveUpBtn")) {
      direction = "up";
    } else if (clickedElement.classList.contains("moveDownBtn")) {
      direction = "down";
    }

    // Move the task based on direction
    if (direction === "up" && taskIndex > 0) {
      todoList.insertBefore(taskItem, taskItem.previousElementSibling);
    } else if (
      direction === "down" &&
      taskIndex < todoList.children.length - 1
    ) {
      todoList.insertBefore(taskItem, taskItem.nextSibling.nextSibling);
    }
  } else {
    console.warn("Clicked outside a task element");
  }
}

// if (clickedElement.classList.contains("moveUpBtn") || clickedElement.classList.contains("moveDownBtn")) {
//   // ... move task logic
// }

// Function to save local todo
const saveLocalTodos = (todo) => {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Function to get local todo
const getLocalTodos = () => {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
    todos.forEach((todo) => {
      //Creating p tag
      const li = document.createElement("li");
      const p = document.createElement("p");
      p.innerHTML = todo;
      li.appendChild(p);

      // Creating Edit Btn
      const editBtn = document.createElement("button");
      editBtn.innerText = "Edit";
      editBtn.classList.add("btn", "editBtn");
      li.appendChild(editBtn);

      // Creating Delete Btn
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Remove";
      deleteBtn.classList.add("btn", "deleteBtn");
      li.appendChild(deleteBtn);

      todoList.appendChild(li);
    });
  }
};

// Function to delete local todo
const deleteLocalTodos = (todo) => {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  let todoText = todo.children[0].innerHTML;
  let todoIndex = todos.indexOf(todoText);
  todos.splice(todoIndex, 1);
  localStorage.setItem("todos", JSON.stringify(todos));
  // Array functions : slice / splice
  console.log(todoIndex);
};

const editLocalTodos = (todo) => {
  let todos = JSON.parse(localStorage.getItem("todos"));
  let todoIndex = todos.indexOf(todo);
  todos[todoIndex] = inputBox.value;
  localStorage.setItem("todos", JSON.stringify(todos));
};

// allow users to clear all the tasks from the list
const clearAllTodos = () => {
  todoList.innerHTML = ""; // This removes all child elements (tasks)
  localStorage.removeItem("todos"); // This removes all saved tasks from local storage
};

document.addEventListener("DOMContentLoaded", () => {
  getLocalTodos();
  const clearAllBtn = document.getElementById("clearAllBtn");
  clearAllBtn.addEventListener("click", clearAllTodos);
});

addBtn.addEventListener("click", addTodo);
todoList.addEventListener("click", updateTodo);
todoList.addEventListener("click", moveTask);
