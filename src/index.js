const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const path = require("path");

require("./db/mongoose");

const app = express();
const port = process.env.PORT || 5000;

// app.use((req, res, next) =>{
//   if(req.method === "GET"){
//     res.send('Access denied')
//   }else{
//     next()
//   }
// })

// app.use((req, res, next) =>{
//   res.status(503).send("Site is under maintenance");
// })

app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

//
// Without middleware: new request -> run route handler
//
// With middleware:    new request -> do something -> run route handler
//

// // jsonwebtoken
// const jwt = require("jsonwebtoken");

// const myFunc = async () => {
//   // create token
//   const token = jwt.sign({ _id: "abc123" }, "thisismysecret", {expiresIn:"10 days"});
//   console.log(token);
//   // verify token
//   const data = jwt.verify(token, 'thisismysecret')

//   console.log(data);
// };

// myFunc();

// const Task = require("./models/task");
// const User = require("./models/user");

// const main = async () => {
//   // const task = await Task.findById("5f4283474e129557705e5342");
//   // // find user assotciated with this task
//   // await task.populate('author').execPopulate()
//   // console.log(task.author)

//   const user = await User.findById("5f42833b4e129557705e5340");
//   await user.populate("tasks").execPopulate();
//   console.log(user.tasks);
// };

// main();
