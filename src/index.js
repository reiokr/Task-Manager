const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const path = require("path");
// /g/mongodb/bin/mongod.exe --dbpath=/g/mongodb/mongodb-data
require("./db/mongoose");

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.listen(port, () => console.log(`Server is running on port ${port}`));
