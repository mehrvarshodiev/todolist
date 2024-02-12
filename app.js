document.addEventListener("DOMContentLoaded", function () {
  const containerEl = document.querySelector(".container");
  let todos = [];
  //   const filterByCategory = ["all", "pending", "complete"];
  const filterByCategory = [
    { all: "" },
    { pending: false },
    { complete: true },
  ];

  //   Sidebar start
  const asideEl = document.createElement("aside");
  asideEl.classList.add("sidebar");

  const logoEL = document.createElement("a");
  logoEL.href = "/";
  logoEL.classList.add("logo");
  logoEL.innerText = "Todo App";

  const filterBoxEL = document.createElement("div");
  filterBoxEL.classList.add("filter_box");
  filterByCategory.forEach((_, i) => {
    const filterBtn = document.createElement("button");
    filterBtn.classList.add("filter_btn");
    filterBtn.innerText = Object.keys(filterByCategory[i]);
    filterBtn.dataset.status = Object.values(filterByCategory[i]);
    filterBtn.onclick = onFilterByCategory;
    filterBoxEL.appendChild(filterBtn);
  });
  filterBoxEL.childNodes[0].classList.add("active");
  const clearAllBtn = document.createElement("button");
  clearAllBtn.classList.add("clear_all_btn");
  clearAllBtn.innerText = "Clear All";
  clearAllBtn.onclick = onClearAllTodos;
  //   Sidebar End

  //   Todos Section Start
  const sectionEl = document.createElement("section");
  sectionEl.classList.add("main_section");
  const inputEl = document.createElement("input");
  inputEl.setAttribute("type", "text");
  inputEl.setAttribute("placeholder", "Enter a new todo here...");
  const addBtn = document.createElement("button");
  addBtn.classList.add("add_btn");
  addBtn.innerText = "Add";
  addBtn.onclick = onAddTodo;
  const ulEl = document.createElement("ul");
  ulEl.classList.add("todo_content");

  inputEl.onkeyup = onCheckValidation;

  //   Todos Section End

  function onCheckValidation(e) {
    if (this.value.length < 1 || this.value == "") {
      this.classList.remove("active");
      this.nextElementSibling.classList.remove("active");
    } else {
      this.classList.add("active");
      this.nextElementSibling.classList.add("active");
    }

    if (e.target.value != "" && e.keyCode == 13 && e.key == "Enter") {
      addBtn.click();
    }
  }

  function onAddTodo(e) {
    e.preventDefault();
    let newTodo = {
      id: crypto.randomUUID().toString(),
      title: inputEl.value.trim().toLowerCase(),
      status: false,
    };

    todos.push(newTodo);
    renderTodos(todos);
    inputEl.value = "";
    this.classList.remove("active");
    inputEl.classList.remove("active");
    Array.from(filterBoxEL.childNodes).forEach((filterButton) => {
      filterButton.classList.remove("active");
    });
    filterBoxEL.childNodes[0].classList.add("active");
    clearAllBtn.classList.add("active");
  }

  function renderTodos(data) {
    ulEl.innerHTML = "";
    for (const index in data) {
      const liEl = document.createElement("li");
      liEl.classList.add("todo_list");
      const titleEl = document.createElement("strong");
      data[index].status == true && titleEl.classList.add("completed");

      titleEl.innerText = data[index].title;
      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete_btn");
      deleteBtn.innerText = "Delete";
      deleteBtn.onclick = () => onDeleteTodo(data[index].id);
      const checkStatusEl = document.createElement("input");
      checkStatusEl.checked = data[index].status;
      checkStatusEl.setAttribute("type", "checkbox");
      checkStatusEl.onchange = () => onChangeTodoStatus(data[index].id);
      liEl.append(titleEl, checkStatusEl, deleteBtn);
      ulEl.appendChild(liEl);
    }
  }
  renderTodos(todos);

  function onDeleteTodo(id) {
    let deleteConfirmation = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    deleteConfirmation &&
      ((todos = todos.filter((todo) => todo.id !== id)), renderTodos(todos));
  }

  function onChangeTodoStatus(id) {
    todos = todos.map((todo) => {
      if (todo.id == id) {
        todo.status = !todo.status;
      }
      return todo;
    });

    renderTodos(todos);
  }

  function onFilterByCategory() {
    if (todos?.length > 0) {
      let filteredTodos = "";
      Array.from(this.parentNode.childNodes).forEach((filterButton) => {
        filterButton.classList.remove("active");
      });
      this.classList.add("active");
      if (this.dataset.status == "") {
        filteredTodos = [...todos];
      } else {
        filteredTodos = todos.filter((todo) => {
          return String(todo.status) == this.dataset.status;
        });
      }
      renderTodos(filteredTodos);
    }
  }

  function onClearAllTodos() {
    if (todos?.length > 0) {
      todos.length = 0;
      console.log(todos);
      renderTodos(todos);
      this.innerText = "Cleared!";
      setTimeout(() => {
        this.innerText = "Clear All";
        this.classList.remove("active");
      }, 1500);
      return;
    }
  }

  asideEl.append(logoEL, filterBoxEL, clearAllBtn);
  sectionEl.append(inputEl, ulEl);
  inputEl.insertAdjacentElement("afterend", addBtn);
  containerEl.append(asideEl, sectionEl);
});
