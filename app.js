const add = document.querySelector("form button");
const section = document.querySelector("section");

add.addEventListener("click", (e) => {
  // preventdefault
  e.preventDefault();

  // get the input values
  const form = e.target.parentElement;
  const todoText = form.children[0].value;
  const todoMonth = form.children[1].value;
  const todoDate = form.children[2].value;

  if (form.children[0].value === "") {
    alert("Come on! Don't add nothing to your Todo list!");
    return;
  }

  // create a todo
  const todo = document.createElement("div");
  todo.classList.add("todo");
  const text = document.createElement("p");
  text.classList.add("todo-text");
  text.innerText = todoText;
  const time = document.createElement("p");
  time.classList.add("todo-time");
  time.innerText = todoMonth + " / " + todoDate;
  todo.appendChild(text);
  todo.appendChild(time);

  // check and trash
  const check = document.createElement("button");
  check.classList.add("check");
  check.innerHTML = '<i class="fas fa-check"></i>';
  check.addEventListener("click", (e) => {
    const done = e.target.parentElement;
    done.classList.toggle("done");
  });

  const trash = document.createElement("button");
  trash.classList.add("trash");
  trash.innerHTML = '<i class="fas fa-trash"></i>';
  trash.addEventListener("click", (e) => {
    const remove = e.target.parentElement;
    remove.addEventListener("animationend", () => {
      // remove from local storage
      const text = remove.children[0].innerText;
      mylistArray.forEach((item, index) => {
        if (item.todoText === text) {
          mylistArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(mylistArray));
        }
      });

      remove.remove();
    });
    remove.style.animation = "scaleDown 0.5s forwards";
  });

  todo.appendChild(check);
  todo.appendChild(trash);

  // add animation
  todo.style.animation = "scaleUp 0.5s forwards";

  // create an object
  const mytodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };

  //store data into local storage
  const mylist = localStorage.getItem("list");
  if (mylist == null) {
    localStorage.setItem("list", JSON.stringify([mytodo]));
  } else {
    const mylistArray = JSON.parse(mylist);
    mylistArray.push(mytodo);
    localStorage.setItem("list", JSON.stringify(mylistArray));
  }

  // clear text input
  form.children[0].value = "";
  section.appendChild(todo);
});

// reload from localstorage
loadData();

function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      // create a todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todo-text");
      text.innerText = item.todoText;
      let time = document.createElement("p");
      time.classList.add("todo-time");
      time.innerText = item.todoMonth + " / " + item.todoDate;
      todo.appendChild(text);
      todo.appendChild(time);

      // create green check and red trash can
      let check = document.createElement("button");
      check.classList.add("check");
      check.innerHTML = '<i class="fas fa-check"></i>';

      check.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
      });

      let trash = document.createElement("button");
      trash.classList.add("trash");
      trash.innerHTML = '<i class="fas fa-trash"></i>';

      trash.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;

        todoItem.addEventListener("animationend", () => {
          // remove from local storage
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });

          todoItem.remove();
        });

        todoItem.style.animation = "scaleDown 0.3s forwards";
      });

      todo.appendChild(check);
      todo.appendChild(trash);

      section.appendChild(todo);
    });
  }
}

function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  // load data
  loadData();
});
