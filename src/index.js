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
