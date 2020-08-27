const http = new EasyHTTP();
// const registrationForm = document.querySelector("#form1");
// const nameInput = document.getElementById("name");
// const ageInput = document.getElementById("age");
// const emailInput = document.getElementById("email");
// const passwordInput = document.getElementById("password");
const loginForm = document.querySelector("#form2");
const emailLogin = document.getElementById("email-login");
const passwordLogin = document.getElementById("password-login");
const tasksContainer = document.querySelector(".tasks");
const userContainer = document.querySelector(".container");
const logoutBtn = document.createElement("button");
(logoutBtn.className = "logout-button"), (logoutBtn.textContent = "Log out");
const isLogedIn = false;
const token = sessionStorage.getItem("token") || "";
const herokuURL = "https://reiokr-task-manager.herokuapp.com";
const url = "http://localhost:5000";

// things to do when windows loads
window.addEventListener("load", function (e) {
  e.preventDefault();
  
  if (token === ""){
    // registrationForm.classList.remove("hidden");
    loginForm.classList.remove("hidden");
    return;
  } else {
    loginForm.classList.add("hidden");
    let usertoken = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    userRequest(usertoken);
    taskRequest(usertoken);
  }
});

// log out from user enviroment
logoutBtn.addEventListener("click", (e)=>{
  sessionStorage.removeItem('token')
  location.reload();
})

// lgin form event listener
loginForm.addEventListener("submit", login);

// user login and authorization
function login(e) {
  e.preventDefault();
  let data = {
    email: emailLogin.value,
    password: passwordLogin.value,
  };
  http
    .post(`${herokuURL}/users/login`, data)
    .then((res) => {
      let usertoken = {
        headers: {
          Authorization: `Bearer ${res.token}`,
        },
      };
      userRequest(usertoken);
      taskRequest(usertoken);
      sessionStorage.setItem("token", res.token);
    })
    .catch((err) => console.log(err));
  // registrationForm.classList.add("hidden");
  loginForm.classList.add("hidden");
}

// get user data
const userRequest = (token) => {
  http
    .get(`${herokuURL}/users/me`, token)
    .then((res) => showUser(res))
    .catch((err) => console.log(err));
};

// get tasks
const taskRequest = (token) => {
  http
    .get(`${herokuURL}/tasks`, token)
    .then((res) => showTasks(res))
    .catch((err) => console.log(err));
};

// paint user data
const showUser = (user) => {
  const userHTML = document.createElement("div");
  userHTML.className=('user')
  userHTML.innerHTML = `
  <h3>Hello ${user.name} </h3>
  <img src="${herokuURL}/users/${user._id.toString()}/avatar" alt="user avatar">
  <h3>Welcome to your task manager!</h3>
  `;
  userContainer.appendChild(userHTML);
  userContainer.insertBefore(logoutBtn, userHTML)
};

// paint tasks
const showTasks = (tasks) => {
  const tasksHTML = document.createElement("div");
  let output = [];
  tasksHTML.className = "tasks";
  tasks.forEach((task) => {
    if (task.completed) {
      output += `
      <p class="completed">${task.description}</p>
      `;
    } else {
      output += `
      <p class="uncompleted">${task.description}</p>
      `;
    }
  });
  tasksHTML.innerHTML = output;
  userContainer.appendChild(tasksHTML);
};
