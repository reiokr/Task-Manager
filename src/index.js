const express = require("express");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const path = require("path");

require("./db/mongoose");

const app = express();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
