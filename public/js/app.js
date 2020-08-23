const http = new EasyHTTP();
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const registrationForm = document.querySelector("#form1");
const loginForm = document.querySelector("#form2");
const emailLogin = document.getElementById("email-login");
const passwordLogin = document.getElementById("password-login");
let c = document.cookie;
const logOutBtn = document.createElement("button");

// registration form event listener
registrationForm.addEventListener(
  "submit",
  (registerNewUser = (e) => {
    e.preventDefault();
    // create user object from input data
    const data = {
      name: nameInput.value,
      age: ageInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };
    // post new user to server using easyHTTP library
    http
      .post("http://localhost:5000/users", data)
      .then((data) => {
        console.log(`User ${data.name} - ${data.email} created and stored`);
      })
      .catch((error) => console.log(error));
    registrationForm.reset();
  })
);

loginForm.addEventListener(
  "submit",
  (loginUser = (e) => {
    e.preventDefault();
    const data = {
      email: emailLogin.value,
      password: passwordLogin.value,
    };

    http
      .post("http://localhost:5000/users/login", data)
      .then((data) => {
        if (c.includes(data.password)) {
          return console.log("user is already logged in");
        } else {
          console.log("user is now logged in");
          getUserData(data);
        }
      })
      .catch((error) => console.log(error));
    loginForm.reset();
  })
);

const getUserData = (data) => {
  http
    .get(`http://localhost:5000/users/${data._id}`)
    .then((data) => {
      if (c.includes(data.password)) {
        return;
      }
      document.cookie = data.name + "=" + data.password;
    })
    .catch((error) => console.log(error));
};
